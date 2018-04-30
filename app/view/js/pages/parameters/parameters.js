var {dialog} = require('electron').remote;

$(document).ready(function () {
    $('#system-path-select').click(() =>{
        dialog.showOpenDialog({properties: ['openDirectory']}, function(dir){
            console.log(dir);
            $('#system-path-dir').val(dir.toString());
        });
    })
});