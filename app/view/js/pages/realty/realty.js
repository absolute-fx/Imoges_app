// DEPENDENCIES
var bootBox = require('bootbox');
var fs = require('fs');
var ipcRenderer = require('electron').ipcRenderer;
var MenuActions = require('./view/js/widgets/MenuActions').MenuActions;
var  pageVars = require('electron').remote.getGlobal('pageVars');

// PARAMS SETTERS
var itemsByRow = 3;
var sideNavTitle = 'Actions';
var projects;

// SIDE MENU SETTER ~ UNSETTER
var btns = [ {label: 'Ajouter un bien', icon: 'fa fa-plus', action: 'addRealty'}];
var projectId;
if(pageVars.id)
{
    btns.push({label: 'Retour aux projets', icon: 'fa fa-arrow-left', action: 'goToProjects'});
    projectId = pageVars.id;
    ipcRenderer.send('setPageVar', {});
}else{
    btns.push({label: 'Liste des projets', icon: 'fa fa-eye', action: 'goToProjects'});
    projectId = null;
}
sideMenu.setSideMenu(sideNavTitle,btns);

// SIDE MENU ACTION SWITCHER
function sideMenuAction(action)
{
    switch (action){
        case 'addRealty':
            addRealty();
            break;
        case 'goToProjects':
            goToProjects();
            break;
    }
}

// CALL TO SERVICE
function getRealtiesList()
{
    var whereQuery = (projectId) ? {where: {realty_project_id: projectId, realty_status: 1}} : {where: {realty_status: 1}};
    require(__dirname + '/class/repositories/Realties').findAll(whereQuery).then((realties) => {
        require(__dirname + '/class/repositories/Projects').findAll({where: {project_status: 1}}).then((p) => {
            projects = p;
            setRealtiesList(realties);
        }).catch((error) => {
            alert(error.toString());
        });
    }).catch((error) => {
        alert(error.toString());
    });
}

function SearchProject(project)
{
    return project.id === 2;
}

// INIT
$(document).ready(function() {
    getRealtiesList();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE SPECIFIC ACTIONS //**********************************************************************************

// SIDE NAV ACTIONS
function addRealty()
{
    var title = "Ajouter un bien";
    if(projectId) title += ' à ' + $('#projectName').html();
    bootBox.prompt({
        title: title,
        size: "medium",
        backdrop: true,
        buttons: {
            cancel: {
                label: 'Annuler',
            },
            confirm: {
                label: 'Ajouter le bien',
                className: 'btn-primary'
            }
        },
        callback: function (result) {
            if(result != null)
            {
                addRealtyAction(result);
            }
        }
    });
}

function addRealtyAction(realtyName) {
    $('.bootbox .modal-footer').html('<i class="fa fa-cog fa-spin"></i>');
    var toInsert = {realty_title: realtyName};
    if(projectId) toInsert.realty_project_id = projectId;
    console.log(toInsert);
    require(__dirname + '/class/repositories/Realties').insert(toInsert).then(
        (realty) =>{
            console.log(realty);
            setEditRealty(realty)
        }
    );
}

function setEditRealty(realtyData) {
    let editRealtyTemplate = fs.readFileSync( __dirname + '/view/html/pages/realty-form.html').toString();
    let tpl = handlebars.compile(editRealtyTemplate);

    bootBox.dialog({
        message: tpl(realtyData),
        onEscape: true,
        title: realtyData.realty_title,
        size: "large",
        backdrop: true,
        buttons: {
            cancel: {
                label: 'Fermer',
            }
        }
    }).on("shown.bs.modal", function() {

    });
}

function setRealtiesList(realties)
{
    let realtiesLisTemplate = $('#realtyListTpl').html();
    let tpl = handlebars.compile(realtiesLisTemplate);

    var r = {realties: realties};
    for(var i in realties)
    {
        var realtyProject = projects.find((project) => project.id == realties[i].realty_project_id);
        var title = realtyProject.project_title;
        realties[i].project_title = title;
        //console.log(realtyProject.project_title);
    }

    //console.log(title);

    $('#realtiesList tbody').html(tpl(r));

    $('#realtiesList').dataTable({
        "language": {
            "lengthMenu": "_MENU_"
        }
    });
    $('.dataTables_filter input').attr('placeholder','Rechercher...');


    //DOM Manipulation to move datatable elements integrate to panel
    $('.panel-ctrls').append($('.dataTables_filter').addClass("pull-right")).find("label").addClass("panel-ctrls-center");
    $('.panel-ctrls').append("<i class='separator'></i>");
    $('.panel-ctrls').append($('.dataTables_length').addClass("pull-left")).find("label").addClass("panel-ctrls-center");

    $('.panel-footer').append($(".dataTable+.row"));
    $('.dataTables_paginate>ul.pagination').addClass("pull-right m0");
}


function goToProjects() {
    var action = 'projects';
    $('#page-heading').html(MenuActions.searchInMenu('page', action, 'label')).hide().fadeIn();
    $('#core-app').load('view/html/pages/' + action + '.html').hide().fadeIn();
}