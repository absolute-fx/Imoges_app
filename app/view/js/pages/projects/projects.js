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
var projects = [
    {id: 1, libelle_projet: 'Résidence Alexandre II', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/project-main-image-web.jpg'},
    {id: 2, libelle_projet: 'Les Demoiselles', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/demoiselles.jpg'},
    {id: 0, libelle_projet: 'Résidence Ines', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/ines.jpg'},
    {id: 3, libelle_projet: 'Résidence O. Strebelle', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/strebelle.jpg'}
];

// INIT
$(document).ready(()=>{
    setProjectsBoxes();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE SPECIFIC ACTIONS //**********************************************************************************

// BOX ACTION SETTERS
var projectsNavigationData = [
    {btnLabel: 'Infos projet', btnAction: 'infos'},
    {btnLabel: 'Biens', btnAction: 'goods'},
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
            editProject(id);
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
    editProject({});
}

// PROJECT EDIT
function editProject(data){
    let editProjectTemplate = fs.readFileSync( __dirname + '/view/html/pages/project-form.html').toString();
    let tpl = handlebars.compile(editProjectTemplate);
    let projectData = {id_projet: 1, libelle_projet: "Résidence Ines", adresse_projet: "12 rue somewhere", ville_projet: "Ecaussinnes", cp_projet: '6132', description_courte_projet: "Une belle description courte", description_longue_projet: "Une belle description longue"};

    //console.log(tpl(editProjectTemplate));
    //console.log(tpl(projectData));

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
    alert("Cette fonctionalité n'est pas encore développée")
}