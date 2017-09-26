// DEPENDENCIES
var bootBox = require('bootbox');
var fs = require('fs');

// PARAMS SETTERS
var itemsByRow = 3;
var sideNavTitle = 'Outils';
var projects;
var phases;

// SIDE MENU SETTER ~ UNSETTER
sideMenu.setSideMenu(sideNavTitle,
    [
        {label: 'Ajouter un projet', icon: 'fa fa-plus', action: 'addProject'},
        {label: 'Statistiques', icon: 'fa fa-bar-chart-o', action: 'stat'}
    ]
);

// SIDE MENU ACTION SWITCHER
function sideMenuAction(action)
{
    switch (action){
        case 'addProject':
            addProject();
            break;
        case 'stat':
            showStats();
            break;
    }
}

// CALL TO SERVICE
function getProjectsList()
{
    require(__dirname + '/class/repositories/Projects').findAll({

    }).then((projects) => {
        //console.log(projects);
        setProjectsBoxes(projects);
    }).catch((error) => {
        alert(error.toString());
    });
}

function getPhasesList()
{
    require(__dirname + '/class/repositories/Phases').findAll().then((p) => {
        phases = p;
        for(var i in phases)
        {
            phases[i].text = phases[i].title; // On pourrait mettre 'text directement en DB
        }

        //console.log(phases);
        getProjectsList();
    }).catch((error) => {
        alert(error.toString());
    });
}

// INIT
$(document).ready(()=>{
    getPhasesList();
    //setProjectsBoxes();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE SPECIFIC ACTIONS //**********************************************************************************

// BOX ACTION SETTERS
var projectsNavigationData = [
    {btnLabel: 'Infos projet', btnAction: 'infos'},
    {btnLabel: 'Biens', btnAction: 'realty'},
    {btnLabel: 'Clients', btnAction: 'clients'},
    {btnLabel: 'Partenaires', btnAction: 'partners'},
    {btnLabel: 'Bibliothèque', btnAction: 'libraries'},
    {btnLabel: 'Factures', btnAction: 'invoices'},
    {btnLabel: 'Support', btnAction: 'support'}
];

// PROJECT BOXES INSTANCES
function setProjectsBoxes(projects) {

    let projectListTemplate = $('#projectListTpl').html();
    let tpl = handlebars.compile(projectListTemplate);
    let projectList = {projectRow: []};
    let row = -1;
    let image;

    for (let i in projects)
    {
        if( i % itemsByRow === 0)
        {
            projectList.projectRow.push({projects: []});
            row ++;
        }
        if(projects[i].main_image)
        {
            image = projects[i].main_image;
        }
        else
        {
            image = 'file://' + __dirname + '/view/images/image_thumb_default.png';
        }
        projectList.projectRow[row].projects.push({
            colSize: (12 / itemsByRow),
            projectLabel: projects[i].project_title,
            projectImage: image,
            id: projects[i].id,
            navigation: projectsNavigationData
        });
    }
    //console.log(projectList);
    $('#projects-wrapper').html(tpl(projectList));

    let projectId, projectAction;
    $('#projects-wrapper a').each(function(){
        $(this).click(()=>{
            projectId = $(this).closest('.projectBox').attr('data-projectId');
            projectAction = $(this).attr('data-action');
            projectsNavigation(projectAction, projectId);
        });
    });
}

// PROJECT BOXES ACTIONS SWITCHER
function projectsNavigation(action, id)
{
    switch (action)
    {
        case 'infos':
            loadProjectData(id);
            break;
        default:
            console.log("chargement page " + action + " avec paramètre id de projet @ " + id);
    }
    return false;
}

// SIDE NAV ACTIONS
function addProject() {
    console.log('Add project');

    bootBox.prompt({
        title: "Ajouter un projet",
        size: "medium",
        backdrop: true,
        buttons: {
            cancel: {
                label: 'Annuler',
            },
            confirm: {
                label: 'Ajouter le projet',
                className: 'btn-primary'
            }
        },
        callback: function (result) {
            if(result != null)
            {
                createProject(result);
            }
        }
    });

}

// CREATE PROJECT
function createProject(projectName)
{
    $('.bootbox .modal-footer').html('<i class="fa fa-cog fa-spin"></i>');

    var project = require(__dirname + '/class/repositories/Projects').insert({project_title: projectName});

    require(__dirname + '/class/repositories/Phases').find(1).then(
        (phase) => {
            project.save().then((project) => {
                project.addPhases(phase.id);
                console.log(project);
                setEditProject(project.id);
            });
        }
    );
}

// LOAD A PROJECT DATA
function loadProjectData(projectId)
{
    require(__dirname + '/class/repositories/Projects').find(projectId).then(project => {
        //console.log(project);
        setEditProject(project);
    }).catch((error) => {
        alert(error.toString());
    });
}

// PROJECT EDIT FORM -> SET DATA IN HANDLEBARS + INITIALIZE (dependencies: project-form.html, edit-project.js)
function setEditProject(projectData){
    if(projectData.project_active_online) projectData.project_active_online = 'checked';
    let editProjectTemplate = fs.readFileSync( __dirname + '/view/html/pages/project-form.html').toString();
    let tpl = handlebars.compile(editProjectTemplate);

    let phaseId, state;
    let selectData = "";
    let count = 0;
    let colSize = Math.floor(12 / projectData.Phases.length);

    console.log(projectData);


    for(var i in projectData.Phases)
    {
        if(i == 0){
            selectData += projectData.Phases[i].id;
        }else {
            selectData += ',' + projectData.Phases[i].id;
        }

        phaseId = projectData.Phases[i].id;
        for(var u in phases)
        {
            if(phaseId == phases[u].id)
            {
                if(projectData.project_actual_phase == phases[u].id){
                    count = 1;
                }else if(count > 0){
                    count = 2;
                }

                switch(count)
                {
                    case 0:
                        state = 'complete';
                        break;

                    case 1:
                        state = 'active';
                        break;

                    case 2:
                        state = 'disabled';
                        break;
                }
                projectData.Phases[i].state = state;
                if(i == 0 && projectData.Phases.length == 5){
                    projectData.Phases[i].colSize = colSize + 1;
                }
                else
                {
                    projectData.Phases[i].colSize = colSize;
                }
            }
        }
    }
    projectData.selectData = selectData;

    bootBox.dialog({
        message: tpl(projectData),
        onEscape: true,
        title: projectData.project_title,
        size: "large",
        backdrop: true,
        buttons: {
            cancel: {
                label: 'Fermer',
            }
        }
    }).on("shown.bs.modal", function() {
        initMap();
    });
}

// SHOW STATS
function showStats(){
    alert("Cette fonctionalité n'est pas encore disponible");
}