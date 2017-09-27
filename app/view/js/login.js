const electron = require('electron');
const ipc = electron.ipcRenderer;
const remote = electron.remote;
let connexion;


$(document).ready(function () {
    setTimeout(connectToServer, 100);
});

$('#submit').click(function(){
    require(__dirname + '/class/repositories/Users').auth($('#login').val(), $('#password').val()).then((user) => {
        if (user.id === undefined)
        {
            throw new Error('Erreur de login/pass');
        }
        else
        {
            $('.container').fadeOut(() => {complete: loadIndex(user.id)});
        }
    });
    return false;
});

function loadIndex(userId){
    console.log('call auth:send');
    ipc.send('auth', userId);
}

function connectToServer() {
    connexion = require(__dirname + '/class/Connection.js');
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
