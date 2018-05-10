var {dialog} = require('electron').remote;

$(document).ready(function () {
    // SIDE MENU SETTER ~ UNSETTER
    sideMenu.unsetSideMenu();

    let parametersTemplate = $('#parametersTpl').html();
    let tpl = handlebars.compile(parametersTemplate);

    var appParams = {local:{},  global: require('electron').remote.getGlobal('appParameters')};

    // Phases
    let phasesSelectValue = '';
    for(var i in appParams.global.project.project_phases)
    {
        if(i == 0){
            phasesSelectValue += appParams.global.project.project_phases[i].id;
        }
        else {
            phasesSelectValue += ',' + appParams.global.project.project_phases[i].id;
        }
    }
    appParams.local.phases_list = phasesSelectValue;

    // Catégories projet
    var projCatSelect = '';
    for(var i in appParams.global.project.projects_categories)
    {
        if(i == 0){
            projCatSelect += i;
        }
        else {
            projCatSelect += ',' + i;
        }
    }
    appParams.local.cat_project_list = projCatSelect;

    // catégories projet
    var realCatSelect = '';
    for(var i in appParams.global.realty.realties_categories)
    {
        if(i == 0){
            realCatSelect += i;
        }
        else {
            realCatSelect += ',' + i;
        }
    }
    appParams.local.cat_realty_list = realCatSelect;


    $('#parameters-wrapper').html(tpl(appParams));

    // action sélection de dossier
    $('#system-path-select').click(() =>{
        dialog.showOpenDialog({properties: ['openDirectory']}, function(dir){
            if(dir)
            {
                console.log(dir);
                $('#system-path-dir').val(dir.toString());
            }
        });
    });

    getPhasesList();
    getProjectCats();
    getRealtyCats();
});

// PHASES
function getPhasesList()
{
    require(__dirname + '/class/repositories/Phases').findAll().then((p) => {
        phases = p;
        for(var i in phases)
        {
            phases[i].text = phases[i].title;
        }
        setPhasesSelect(phases);

    }).catch((error) => {
        alert(error.toString());
    });
}

function setPhasesSelect(phases)
{
    $("#default-phases").select2({width: "100%", tags: phases, val: phases, maximumSelectionSize: 6 }).on('change', function (e) {
        phaseSelectAction(e);
    });
}

function phaseSelectAction(event)
{
    if(event.added) {
        if (event.added.id == event.added.text) {
            // insert de la nouvelle phase
            require(__dirname + '/class/repositories/Phases').insert({
                'title': event.added.text
            }).then((phase) => {
                console.log("Phase added : " + phase.id);
                logThisEvent({
                    log_message: 'Ajout de la phase <strong data-id="' + phase.id + '" data-table="Phases">' + phase.title + '</strong>',
                    log_action_type: 'add',
                    log_status: true,
                    log_table_name: 'Phases',
                    log_table_id: phase.id
                });
                // ajout ds paramètres
                var newEntries = require('electron').remote.getGlobal('appParameters');
                var pp = newEntries.project.project_phases;
                pp.push({id: phase.id, label: phase.title});
                newEntries.project.project_phases = pp;

                ManageParameters.setMultipleParameters(newEntries).then(newParams =>{
                    ipc.send('setParameters', newParams);
                });
            });
        }
        else {
            // ajout ds paramètres
            var existingEntry = require('electron').remote.getGlobal('appParameters');
            var pp = existingEntry.project.project_phases;
            pp.push({id: event.added.id, label: event.added.text});
            existingEntry.project.project_phases = pp;

            ManageParameters.setMultipleParameters(existingEntry).then(newParams =>{
                ipc.send('setParameters', newParams);
            });
        }
    }
    else
    {
        if(event.removed)
        {
            var removeEntry = require('electron').remote.getGlobal('appParameters');
            var pp = removeEntry.project.project_phases;
            var nPp = [];
            for(var i in pp)
            {
                if(pp[i].id != event.removed.id)
                {
                    nPp.push(pp[i]);
                }
            }
            removeEntry.project.project_phases = nPp;
            ManageParameters.setMultipleParameters(removeEntry).then(newParams =>{
                ipc.send('setParameters', newParams);
            });

        }
    }
}
// FIN PHASES


// CATEGORIES PROJET
function getProjectCats()
{
    var projectCategories = require('electron').remote.getGlobal('appParameters').project.projects_categories;
    var selectCatProductVal = [];

    for(var i in projectCategories)
    {
        selectCatProductVal.push({id:i, text: projectCategories[i]});
    }
    setProjectCatSelect(selectCatProductVal);
}

function setProjectCatSelect(projectCats)
{
    $("#default-projects-categories").select2({width: "100%", tags: projectCats, val: projectCats, maximumSelectionSize: 6 }).on('change', function (e) {
        projectCatSelectAction(e);
    });
}

function projectCatSelectAction(event)
{
    if(event.added) {
        var allParams = require('electron').remote.getGlobal('appParameters');
        var pC = allParams.project.projects_categories;
        pC.push(event.added.text);
        allParams.project.projects_categories = pC;

        ManageParameters.setMultipleParameters(allParams).then(newParams =>{
            ipc.send('setParameters', newParams);
        });
    }
    else {
        if(event.removed)
        {
            var allParams = require('electron').remote.getGlobal('appParameters');
            var pC = allParams.project.projects_categories;
            var nPc = [];
            for(var i in pC)
            {
                if(i != event.removed.id)
                {
                    nPc.push(pC[i]);
                }
            }
            allParams.project.projects_categories = nPc;
            ManageParameters.setMultipleParameters(allParams).then(newParams =>{
                ipc.send('setParameters', newParams);
            });
        }
    }
}
// CATEGORIES PROJET FIN


// CATEGORIES BIENS
function getRealtyCats()
{
    var realtyCategories = require('electron').remote.getGlobal('appParameters').realty.realties_categories;
    var selectCatRealtyVal = [];

    for(var i in realtyCategories)
    {
        selectCatRealtyVal.push({id:i, text: realtyCategories[i]});
    }
    setRealtyCatSelect(selectCatRealtyVal);
}

function setRealtyCatSelect(realtyCats)
{
    $("#default-realties-categories").select2({width: "100%", tags: realtyCats, val: realtyCats, maximumSelectionSize: 6 }).on('change', function (e) {
        realtyCatSelectAction(e);
    });
}

function realtyCatSelectAction(event)
{
    if(event.added) {
        var allParams = require('electron').remote.getGlobal('appParameters');
        var pC = allParams.realty.realties_categories;
        pC.push(event.added.text);
        allParams.realty.realties_categories = pC;

        ManageParameters.setMultipleParameters(allParams).then(newParams =>{
            ipc.send('setParameters', newParams);
        });
    }
    else {
        if(event.removed)
        {
            var allParams = require('electron').remote.getGlobal('appParameters');
            var pC = allParams.realty.realties_categories;
            var nPc = [];
            for(var i in pC)
            {
                if(i != event.removed.id)
                {
                    nPc.push(pC[i]);
                }
            }
            allParams.realty.realties_categories = nPc;
            ManageParameters.setMultipleParameters(allParams).then(newParams =>{
                ipc.send('setParameters', newParams);
            });
        }
    }
}

// CATEGORIES BIENS FIN
