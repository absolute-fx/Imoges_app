const electron = require('electron');
const ipc = electron.ipcRenderer;
let connexion;


$(document).ready(function () {
    setTimeout(connectToServer, 100);
});

$('form').submit(function(){
    let userId = 23;
    $('.container').fadeOut(() => {complete: loadIndex(userId)});
    return false;
});

function loadIndex(userId){
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
