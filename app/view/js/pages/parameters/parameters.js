var {dialog} = require('electron').remote;

$(document).ready(function () {
    // SIDE MENU SETTER ~ UNSETTER
    sideMenu.unsetSideMenu();

    $('#system-path-select').click(() =>{
        dialog.showOpenDialog({properties: ['openDirectory']}, function(dir){
            console.log(dir);
            $('#system-path-dir').val(dir.toString());
        });
    })

    $("#default-phases").select2({width: "100%", tags: [{id: 1, text: 'Fondation'}, {id: 2, text: 'Maçonnerie'}], val: [{id: 1, text: 'Fondation'}, {id: 2, text: 'Maçonnerie'}], maximumSelectionSize: 6 }).on('change', function (e) {
        //setStepsList(e);
    });

    $("#default-projects-categories").select2({width: "100%", tags: [{id: 1, text: 'Général'}, {id: 2, text: 'Cahier des charges'}], val: [{id: 1, text: 'Général'}, {id: 2, text: 'Cahier des charges'}], maximumSelectionSize: 6 }).on('change', function (e) {
        //setStepsList(e);
    });

    $("#default-realties-categories").select2({width: "100%", tags: [{id: 1, text: 'Général'}], val: [{id: 1, text: 'Général'}], maximumSelectionSize: 6 }).on('change', function (e) {
        //setStepsList(e);
    });

});