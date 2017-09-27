const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
let connexion;


$(document).ready(function () {
    setTimeout(connectToServer, 100);
});

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
            $('.container').fadeOut(() => {complete: loadIndex(userData)});
        }
    });
    return false;
});

function loadIndex(userData){
    console.log('call auth:send');
    ipc.send('auth', userData);
}

function connectToServer() {
    connexion = require(__dirname + '/class/Connection.js');
    ipc.send('getCookies');
    $('.loader').hide();
    $('#login-container').fadeIn();
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