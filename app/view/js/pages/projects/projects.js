// DEPENDENCIES
var bootBox = require('bootbox');
var fs = require('fs');

// PARAMS SETTERS
var itemsByRow = 3;
var sideNavTitle = 'Outils';

// SIDE MENU SETTER ~ UNSETTER
sideMenu.setSideMenu(
    sideNavTitle,
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
        console.log(projects);
    }).catch((error) => {
        alert(error.toString());
    });
}
var projects = [
    {id: 1, libelle_projet: 'Résidence Alexandre II', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/project-main-image-web.jpg'},
    {id: 2, libelle_projet: 'Les Demoiselles', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/demoiselles.jpg'},
    {id: 0, libelle_projet: 'Résidence Ines', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/ines.jpg'},
    {id: 3, libelle_projet: 'Résidence O. Strebelle', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/strebelle.jpg'}
];

// INIT
$(document).ready(()=>{
    getProjectsList();
    setProjectsBoxes();
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
function setProjectsBoxes() {

    let projectListTemplate = $('#projectListTpl').html();
    let tpl = handlebars.compile(projectListTemplate);
    let projectList = {projectRow: []};
    let row = -1;

    for (let i in projects)
    {
        if( i % itemsByRow === 0)
        {
            projectList.projectRow.push({projects: []});
            row ++;
        }
        projectList.projectRow[row].projects.push({
            colSize: (12 / itemsByRow),
            projectLabel: projects[i].libelle_projet,
            projectImage: projects[i].main_image,
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
            setEditProject(id);
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
                createProject();
            }
        }
    });

}

// CREATE PROJECT
function createProject()
{
    $('.bootbox .modal-footer').html('<i class="fa fa-cog fa-spin"></i>');

    var project = require(__dirname + '/class/repositories/Projects').insert({project_title: projectName});

    require(__dirname + '/class/repositories/Phases').find(1).then(
        (phase) => {
            project.save().then((project) => {
                project.addPhases(phase.id);
                console.log(project);
            });
        }
    );
}
// PROJECT EDIT
var allStepsList = [
    {id: 0, text: "Défrichage terrain"},
    {id: 1, text: "Fondations"},
    {id: 2, text: "Gros oeuvre"},
    {id: 3, text: "Toiture"},
    {id: 4, text: "Pose chassis"},
    {id: 5, text: "Finitions"},
    {id: 6, text: "Terminé"}
];

function loadProjectData(projectId)
{
    setEditProject({});
}

var projectInputVal;
function setEditProject(data){
    let editProjectTemplate = fs.readFileSync( __dirname + '/view/html/pages/project-form.html').toString();
    let tpl = handlebars.compile(editProjectTemplate);

    let projectData = {
        id_projet: 1,
        libelle_projet: "Résidence Ines",
        adresse_projet: "Avenue de la déportation 41",
        ville_projet: "Ecaussinnes",
        cp_projet: '7190',
        lat_projet: '50.56170591970849',
        long_projet: '4.158356019708435',
        description_courte_projet: "Une belle description courte",
        description_longue_projet: "Une belle description longue",
        phase_actuelle_projet: 4,
        phases_construction: [1,2,3,4,5,6]
    };

    let stepId;
    let projectSteps = [];
    let state;
    let count = 0;
    let colSize = Math.floor(12 / projectData.phases_construction.length);

    for(var i in projectData.phases_construction)
    {
        stepId = projectData.phases_construction[i];
        for(var u in allStepsList)
        {
            if(stepId == allStepsList[u].id)
            {
                if(projectData.phase_actuelle_projet == allStepsList[u].id){
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
                if(i == 0 && projectData.phases_construction.length == 5){
                    projectSteps.push({stepLabel: allStepsList[u].text, id: allStepsList[u].id, state: state, colSize: colSize +1});
                }
                else
                {
                    projectSteps.push({stepLabel: allStepsList[u].text, id:allStepsList[u].id, state: state, colSize: colSize});
                }
            }
        }
    }
    projectData.projectSteps = projectSteps;
    projectInputVal = projectSteps;

    bootBox.dialog({
        message: tpl(projectData),
        onEscape: true,
        title: projectData.libelle_projet,
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

function showStats(){
    alert("Cette fonctionalité n'est pas encore disponible");
}