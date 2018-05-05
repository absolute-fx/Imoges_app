var {dialog} = require('electron').remote;
var appParams = require('electron').remote.getGlobal('appParameters');

$(document).ready(function () {
    // SIDE MENU SETTER ~ UNSETTER
    sideMenu.unsetSideMenu();

    let parametersTemplate = $('#parametersTpl').html();
    let tpl = handlebars.compile(parametersTemplate);
    $('#parameters-wrapper').html(tpl(appParams));

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



/*

fs.readFile(__dirname + '/parameters.json', 'utf8', (err, data) =>{
            if (err){
                console.log(err);
            } else {
                appParameters = JSON.parse(data);
                obj.table.push({id: 2, square:3}); //add some data
                json = JSON.stringify(obj); //convert it back to json
                fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back
            }
        });
 */