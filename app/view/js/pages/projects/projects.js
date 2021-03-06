// DEPENDENCIES
var bootBox = require('bootbox');
//var fs = require('fs');
var ipcRenderer = require('electron').ipcRenderer;
var MenuActions = require('./view/js/widgets/MenuActions').MenuActions;
var FormEdition = require('./view/js/widgets/FormEdition').FormEdition;
var DesktopManagement = require('./view/js/widgets/DesktopManagement').DesktopManagement;
var appParams = require('electron').remote.getGlobal('appParameters');

// PARAMS SETTERS
var itemsByRow = 3;
var sideNavTitle = 'Actions';
var projects;
var project;
var phases;
var heatingTypes = [
    {id: 'E', label: 'Electrique'},
    {id: 'M', label: 'Mazout'},
    {id: 'G', label: 'Gaz'},
    {id: 'S', label: 'Solaire'}
];
var cpeb = [
    {id: '1', label: 'A++'},
    {id: '2', label: 'A+'},
    {id: '3', label: 'A'}
];
var facades = [
    {id: 1, label: 1},
    {id: 2, label: 2},
    {id: 3, label: 3},
    {id: 4, label: 4}
];
var projectTypes = [
    {id: 1, label: 'Maisons'},
    {id: 2, label: 'Appartements'},
    {id: 8, label: 'Autres'}
];

var environmentTypes = [
    {id: 'CP', label: 'Campagne'},
    {id: 'RR', label: 'Résidentiel'},
    {id: 'US', label: 'Urbain'}
];

// SIDE MENU SETTER ~ UN-SETTER
sideMenu.setSideMenu(sideNavTitle,
    [
        {label: 'Ajouter un projet', icon: 'fa fa-plus', action: 'addProject'}
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

// CALL TO SERVICES
function getProjectsList()
{
    require(__dirname + '/class/repositories/Projects').findAll({where: {project_status: 1}}).then((projects) => {
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
        getProjectsList();
        //console.log(phases);
    }).catch((error) => {
        alert(error.toString());
    });
}

function loadProjectLibrary(id)
{
    var whereQuery = {where: {library_category_table_name : 'Projects', library_category_table_id : id,}};
    var lib;
    require(__dirname + '/class/repositories/Librarycategories').findAll(whereQuery).then(
        (library) => {
            lib = library
            var whereQuery = {where: {project_status: 1}};
            require(__dirname + '/class/repositories/Projects').findAll(whereQuery).then((projects) => {
                setProjLibInterface(id, lib, projects);
            }).catch((error) => {
                alert(error.toString());
            });
        }).catch((error)=>{

    });
}


// INIT
$(document).ready(()=>{
    getPhasesList();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE SPECIFIC ACTIONS //**********************************************************************************

// BOX ACTION SETTERS
var projectsNavigationData = [
    {btnLabel: 'Infos projet', btnAction: 'infos'},
    {btnLabel: 'Biens', btnAction: 'realty'},
    {btnLabel: 'Bibliothèque', btnAction: 'library'},
    {btnLabel: 'Clients', btnAction: 'clientsList'},
    {btnLabel: 'Partenaires', btnAction: 'partners'},
    {btnLabel: 'Factures', btnAction: 'invoices'},
    {btnLabel: 'Support', btnAction: 'support'}
];

// PROJECT BOXES INSTANCES
function setProjectsBoxes(projects)
{

    let projectListTemplate = $('#projectListTpl').html();
    let tpl = handlebars.compile(projectListTemplate);
    let projectList = {projectRow: []};
    let row = -1;
    let image;
    if(projects.length > 6 && projects.length <= 8) itemsByRow = 4;
    if(projects.length > 8) itemsByRow = 6;

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
        case 'library':
            loadProjectLibrary(id);
            break;
        default:
            console.log("chargement page " + action + " avec paramètre id de projet @ " + id);
            ipcRenderer.send('setPageVar', {name: 'project', id: id});
            //console.log(MenuActions.searchInMenu('page', action, 'label'));
            $('#page-heading').html(MenuActions.searchInMenu('page', action, 'label') + ' - <span id="projectName">' + $('*[data-projectId="' + id + '"] h2').html() + '</span>').hide().fadeIn();
            $('#core-app').load('view/html/pages/' + action + '.html', ()=>{

            }).hide().fadeIn();
    }
    return false;
}

// SIDE NAV ACTIONS
function addProject()
{
    console.log('Add project');
    ipcRenderer.send('unsetAppMenu');
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
            if(result)
            {
                createProject(result);
            }
            else
            {
                ipcRenderer.send('setAppMenu');
            }
        }
    });

}

// CREATE PROJECT
function createProject(projectName)
{
    $('.bootbox .modal-footer').html('<i class="fa fa-cog fa-spin"></i>');

    // Paramètres
    var pP = appParams.project.project_phases;
    var pC = appParams.project.projects_categories;

    require(__dirname + '/class/repositories/Projects').insert({project_title: projectName}).then((project) =>{
        logThisEvent({
            log_message: 'Ajout du projet <strong data-id="' + project.id + '" data-table="Projects">' + projectName + '</strong>',
            log_action_type: 'add',
            log_status: true,
            log_table_name: 'Projects',
            log_table_id: project.id
        });

        for(var i in pP)
        {
            project.addPhases(pP[i].id);
            logThisEvent({
                log_message: 'Liaison de la phase <strong data-id="' + pP[i].id + '" data-table="Phases">' + pP[i].label + '</strong> au projet <strong data-id="' + project.id + '" data-table="Projects">' + projectName + '</strong>',
                log_action_type: 'bind',
                log_status: true,
                log_table_name: 'project_phases'
            });
        }

        DesktopManagement.addDirectory(projectName);
        DesktopManagement.addDirectory(appParams.system.projects_dirs.default.realties, projectName);
        DesktopManagement.addDirectory(appParams.system.projects_dirs.default.libraries, projectName);

        for (var i in appParams.system.projects_dirs.user_defined)
        {
            DesktopManagement.addDirectory(appParams.system.projects_dirs.user_defined[i], projectName);
        }


        for(var i in pC)
        {
            var toInsert = {
                Library_category_label: pC[i],
                library_category_table_name: 'Projects',
                library_category_table_id: project.id
            };
            require(__dirname + '/class/repositories/Librarycategories').insert(toInsert).then(
                (category) =>{
                    var logMessage = 'Ajout de la catégorie <strong data-id="' + category.id + '" data-table="Librarycategories">' + category.Library_category_label + '</strong> au projet <strong data-id="' + project.id + '" data-table="Projects">' + projectName + '</strong>';
                    logThisEvent({
                        log_message: logMessage ,
                        log_action_type: 'add',
                        log_status: true,
                        log_table_name: 'Librarycategories',
                        log_table_id: category.id
                    });
                    DesktopManagement.addDirectory(category.Library_category_label, projectName + '/' + appParams.system.projects_dirs.default.libraries);
                });
        }

        $('#projects-wrapper a').each(function(){
            $(this).unbind( "click" );
        });
        $('#projects-wrapper').html('');
        getProjectsList();
        loadProjectData(project.id);
    });
}

// LOAD A PROJECT DATA
function loadProjectData(projectId)
{
    require(__dirname + '/class/repositories/Projects').find(projectId).then(p => {
        //console.log(project);
        project = p;
        let endBuildDate = new Date(project.project_end_build_date);
        let startBuildDate = new Date(project.project_start_build_date);
        let startDiffusionDate = new Date(project.project_start_diffusion_date);
        project.project_end_build_date = FormEdition.setDateNumberFormat(endBuildDate.getDate()) + '/' + FormEdition.setDateNumberFormat(endBuildDate.getMonth() + 1) + '/' + endBuildDate.getFullYear();
        if(project.project_end_build_date == '01/01/1970') project.project_end_build_date = '';
        project.project_start_build_date = FormEdition.setDateNumberFormat(startBuildDate.getDate()) + '/' + FormEdition.setDateNumberFormat(startBuildDate.getMonth() + 1) + '/' + startBuildDate.getFullYear();
        if(project.project_start_build_date == '01/01/1970') project.project_start_build_date = '';
        project.project_start_diffusion_date = FormEdition.setDateNumberFormat(startDiffusionDate.getDate()) + '/' + FormEdition.setDateNumberFormat(startDiffusionDate.getMonth() + 1) + '/' + startDiffusionDate.getFullYear();
        if(project.project_start_diffusion_date == '01/01/1970') project.project_start_diffusion_date = '';

        setEditProject(project);
    }).catch((error) => {
        alert(error.toString());
    });
}

// PROJECT EDIT FORM -> SET DATA IN HANDLEBARS + INITIALIZE (dependencies: project-form.html, edit-project.js)
function setEditProject(projectData)
{
    if(projectData.project_active_online) projectData.project_active_online = 'checked';
    if(projectData.project_handicapped_access) projectData.project_handicapped_access = 'checked';
    if(projectData.project_lift) projectData.project_lift = 'checked';
    if(projectData.project_concierge) projectData.project_concierge = 'checked';
    if(projectData.project_air_conditioning) projectData.project_air_conditioning = 'checked';
    if(projectData.project_heat_pump) projectData.project_heat_pump = 'checked';
    if(projectData.project_double_glazing) projectData.project_double_glazing = 'checked';
    if(projectData.project_PV) projectData.project_PV = 'checked';

    let editProjectTemplate = fs.readFileSync( __dirname + '/view/html/pages/project-form.html').toString();
    let tpl = handlebars.compile(editProjectTemplate);

    let phaseId, state;
    let selectData = "";
    let count = 0;
    let colSize = Math.floor(12 / projectData.Phases.length);

    projectData.heating_types_list = heatingTypes;
    for(var i in heatingTypes)
    {
        if(projectData.project_heating_type == heatingTypes[i].id)
        {
            projectData.heating_types_list[i].selected = 'selected';
        }
        else
        {
            projectData.heating_types_list[i].selected = '';
        }
    }

    projectData.project_peb_list = cpeb;
    for(var i in cpeb)
    {
        if(projectData.project_peb == cpeb[i].id)
        {
            projectData.project_peb_list[i].selected = 'selected';
        }
        else
        {
            projectData.project_peb_list[i].selected = '';
        }
    }

    projectData.project_facade_number_list = facades;
    for(var i in facades)
    {
        if(projectData.project_facade_number == facades[i].id)
        {
            projectData.project_facade_number_list[i].selected = 'selected';
        }
        else
        {
            projectData.project_facade_number_list[i].selected = '';
        }
    }

    projectData.project_types_list = projectTypes;
    for(var i in projectTypes)
    {
        if(projectData.project_type == projectTypes[i].id)
        {
            projectData.project_types_list[i].selected = 'selected';
        }
        else
        {
            projectData.project_types_list[i].selected = '';
        }
    }

    projectData.project_environment_type_list = environmentTypes;
    for(var i in environmentTypes)
    {
        if(projectData.project_environment_type == environmentTypes[i].id)
        {
            projectData.project_environment_type_list[i].selected = 'selected';
        }
        else
        {
            projectData.project_environment_type_list[i].selected = '';
        }
    }

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
    ipcRenderer.send('unsetAppMenu');
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
    }).on("hidden.bs.modal", function () {
        ipcRenderer.send('setAppMenu');
    });
}

// SET LIBRARY
function setProjLibInterface(projectId, libraryCategories, projects)
{
    var libraryData = {readonly: 'readonly'};
    libraryData.categories = libraryCategories
    libraryData.tables = [
        {label : 'Projet', value: 'Projects', selected: 'selected'},
        {label : 'Biens', value: 'Realties', selected: ''}
    ];

    libraryData.elements = [];
    var selected;
    for (var i in projects)
    {
        selected = (projectId == projects[i].id)? 'selected': '';
        libraryData.elements.push({id: projects[i].id, label: projects[i].project_title, selected: selected});
    }

    libraryData.id = '{{id}}';
    libraryData.Library_category_label = '{{Library_category_label}}';

    let libraryTemplate = fs.readFileSync( __dirname + '/view/html/pages/libraries.html').toString();
    //let tpl = handlebars.compile(libraryTemplate);
    ipcRenderer.send('unsetAppMenu');
    let libraryModal = bootBox.dialog({
        //message: tpl(libraryData),
        message: libraryTemplate,
        onEscape: true,
        title: 'Librairie',
        size: "large",
        backdrop: true,
        buttons: {
            cancel: {
                label: 'Fermer',
            }
        }
    }).on("shown.bs.modal", function() {
        let tabContent = $('#libraryTpl').html();
        let tplTab = handlebars.compile(tabContent);
        $('#libraryWrapper').html(tplTab(libraryData));
        $('.category-edit').hide();
        $('.uploader-zone').hide();
        $.getScript("./view/js/pages/libraries/libraries.js", function(data){return data;});
    }).on("hidden.bs.modal", function () {
        ipcRenderer.send('setAppMenu');
        $('#documents-tree').jstree('destroy');
    }).show();
}

// SHOW STATS
function showStats()
{
    alert("Cette fonctionalité n'est pas encore disponible");
}