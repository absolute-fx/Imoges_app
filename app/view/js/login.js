const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
const ManageParameters = require('./class/ManageParameters');
const Connexion = require(__dirname + '/class/Connection.js');


$(document).ready(function (){
    init();
});

function init() {
    Connexion.setConnection().then(c =>{
        //ipc.send('getCookies');
        ManageParameters.getParameters().then(parameters =>{
            $('#login').val(parameters.user.login);
            $('#password').val(parameters.user.password);
            $('.loader').hide();
            $('#login-container').fadeIn();
            $('#password').focus();
        });
    });
}

$('form').submit(function(){
    let login = $('#login').val();
    let pass = $('#password').val();
    let userData = {login: login, pass: pass};
    require(__dirname + '/class/repositories/Users').auth(login, pass).then((user) => {
        if (user.id === undefined)
        {
            throw new Error('Erreur de login/pass');
        }
        else
        {
            userData.id = user.id;
            ipc.send('setUserSession', user);
            $('.container').fadeOut(() => {complete: loadIndex(userData)});
        }
    });
    return false;
});

function loadIndex(userData){
    console.log('call auth:send');
    ipc.send('auth', userData);
}



ipc.on('update-available', function (event, args) {
    window.location.replace("update.html#"+window.location.hash.substring(1));
});

ipc.on('login-success', function (event, args) {
    console.log('login');
    remote.getCurrentWindow().user_id = args;
    console.log(args);
    window.location.replace("index.html#"+window.location.hash.substring(1));
});

ipc.on('cookie', function (event, arg) {
    $('#login').val(arg.login);
    $('#password').val(arg.pass);
});