// PARAMS SETTERS
var pageName = 'projects';
var itemsByRow = 3;
var sideNavTitle = 'Outils';

// SIDE MENU SETTER
sideMenu.setSideMenu(
    pageName,
    sideNavTitle,
    [
        {label: 'Ajouter un projet', icon: 'fa fa-plus', action: 'addProject'},
        {label: 'Statistiques', icon: 'fa fa-bar-chart-o', action: 'stat'}
    ]
);

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
            console.log('chargement modale');
            break;
        default:
            console.log("chargement page " + action + " avec paramètre id de projet @ " + id);
    }
    return false;
}