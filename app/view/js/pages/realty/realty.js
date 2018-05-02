// DEPENDENCIES
var bootBox = require('bootbox');
var fs = require('fs');
var ipcRenderer = require('electron').ipcRenderer;
var MenuActions = require('./view/js/widgets/MenuActions').MenuActions;
var FormEdition = require('./view/js/widgets/FormEdition').FormEdition;
var pageVars = require('electron').remote.getGlobal('pageVars');

// PARAMS SETTERS
var itemsByRow = 3;
var sideNavTitle = 'Actions';
var projects;
var realtiesTable;
var contractType = [{id: 0, label: "Vente"}, {id: 1, label:"Location"}];
var kitchenTypes =  [
    {label: 'Hyper-équipée  ', value: 'XE'},
    {label: 'Equipée  ', value: 'CE'},
    {label: 'Semi-équipée  ', value: 'SE'},
    {label: 'Non-équipée  ', value: 'NE'},
    {label: 'Américaine semi-équipée  ', value: 'AS'},
    {label: 'Américaine équipée   ', value: 'AC'},
    {label: 'Américaine hyper-équipée   ', value: 'AX'},
    {label: 'Américaine Non-équipée  ', value: 'AN'}];

var realtyTypes = [
    {id: '0000', label: 'Maison'},
    {id: '5001', label: 'Appartement'},
    {id: '5005', label: 'Flat/Studio'},
    {id: '5007', label: 'Loft'},
    {id: '5003', label: 'Duplex'},
    {id: '5004', label: 'Triplex'},
    {id: '5002', label: 'Rez-de-chaussée'},
    {id: '5006', label: 'Penthouse'},
    {id: '5008', label: 'Kot'},
    {id: '5009', label: 'Séniorie'}
];

var terraceOrientations = [
    {id: 'N', label: 'Nord'},
    {id: 'NE', label: 'Nord Est'},
    {id: 'E', label: 'Est'},
    {id: 'SE', label: 'Sud Est'},
    {id: 'S', label: 'Sud'},
    {id: 'SO', label: 'Sud Ouest'},
    {id: 'O', label: 'Ouest'},
    {id: 'NO', label: 'Nord Ouest'}
];

var realtyFacades = [
    {id: 1, label: 1},
    {id: 2, label: 2},
    {id: 3, label: 3},
    {id: 4, label: 4}
];

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

// CALL TO SERVICES
function initRealtiesList()
{
    var whereQuery = (projectId) ? {where: {ProjectId: projectId, realty_status: 1}} : {where: {realty_status: 1}};
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

function loadRealty(id) {
    require(__dirname + '/class/repositories/Realties').findById(id).then(
        (realty) => {
            console.log(realty);
            setEditRealty(realty);
        });
}

function loadLibrary(id)
{
    var whereQuery = {where: {library_category_table_name : 'Realties', library_category_table_id : id}};
    var lib;
    require(__dirname + '/class/repositories/Librarycategories').findAll(whereQuery).then(
        (library) => {
            lib = library
            var whereQuery = (projectId) ? {where: {ProjectId: projectId, realty_status: 1}} : {where: {realty_status: 1}};
            require(__dirname + '/class/repositories/Realties').findAll(whereQuery).then((realties) => {
                setLibraryInterface(id, lib, realties);
            }).catch((error) => {
                alert(error.toString());
            });
        }).catch((error)=>{

    });
}

function addLibraryCategory(realty)
{
    var toInsert = {Library_category_label: 'general',library_category_table_name: 'Realties', library_category_table_id: realty.id}
    require(__dirname + '/class/repositories/Librarycategories').insert(toInsert).then(
        (category) =>{
            realty.category = category;
            logThisEvent({
                log_message: 'Ajout de la catégorie <strong data-id="' + category.id + '" data-table="Categories">' + category.Library_category_label + '</strong> au bien <strong data-id="' + realty.id + '" data-table="Realties">' + realty.realty_title + '</strong>',
                log_action_type: 'add',
                log_status: true,
                log_table_name: 'Categories',
                log_table_id: category.id
            });
            setEditRealty(realty);
        });
}

// INIT
$(document).ready(function() {
    deactivateSideMenu();
    initRealtiesList();
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
    if(projectId) toInsert.ProjectId = projectId;
    console.log(toInsert);
    require(__dirname + '/class/repositories/Realties').insert(toInsert).then(
        (realty) =>{

            console.log(realty);
            let realtiesLisTemplate = $('#realtyListTpl').html();
            let tpl = handlebars.compile(realtiesLisTemplate);

            if(realty.ProjectId)
            {
                let realtyProject = projects.find((project) => project.id == realty.ProjectId);
                let title = realtyProject.project_title;
                realty.project_title = title;
            }
            else
            {
                realty.project_title = 'Aucun';
            }

            if(realty.realty_net_price) realty.realty_price = Math.ceil(realty.realty_net_price + (realty.realty_net_price * (realty.realty_vat /100))) + ' €';
            if(realty.realty_surface) realty.realty_surface = realty.realty_surface + ' m²';
            realty.realty_active_online = (realty.realty_active_online == 0) ? 'Hors ligne' : 'En ligne';

            let r = {realties: [realty]};
            realtiesTable.row.add($(tpl(r))[0]).draw();



            logThisEvent({
                log_message: 'Ajout du bien <strong data-id="' + realty.id + '" data-table="Realties">' + realty.realty_title + '</strong> au projet <strong data-id="' + realty.ProjectId + '" data-table="Projects">' + realty.project_title + '</strong>',
                log_action_type: 'add',
                log_status: true,
                log_table_name: 'Realties',
                log_table_id: realty.id
            });

            //setEditRealty(realty);
            addLibraryCategory(realty);
        }
    );
}

function setEditRealty(realtyData) {
    if(realtyData.realty_active_online) realtyData.realty_active_online = 'checked';
    if(realtyData.realty_acoustic_isolation) realtyData.realty_acoustic_isolation = 'checked';
    if(realtyData.realty_security_system) realtyData.realty_security_system = 'checked';
    if(realtyData.realty_door_phone) realtyData.realty_door_phone = 'checked';
    if(realtyData.realty_videophone) realtyData.realty_videophone = 'checked';
    if(realtyData.realty_security_door) realtyData.realty_security_door = 'checked';
    if(realtyData.realty_laundry) realtyData.realty_laundry = 'checked';

    var projectArrayId;
    realtyData.projects = projects;
    for(var i in realtyData.projects)
    {
        if(realtyData.projects[i].id == realtyData.ProjectId){
            realtyData.projects[i].selected = 'selected';
            projectArrayId = i;
        }
        else
        {
            realtyData.projects[i].selected = '';
        }
    }
    if(realtyData.projects[projectArrayId])
    {
        if(realtyData.projects[projectArrayId].project_floor_number)
        {
            var floors = Number(realtyData.projects[projectArrayId].project_floor_number);
            realtyData.realty_floors_list = [];
            realtyData.project_has_floor = 'Choisissez...';
            for(var i =0; i< floors; i++ )
            {
                var label;
                var id = i;
                if(i==0)
                {

                    label = "rez";
                }
                else
                {
                    label = "Etage " + i;
                }

                realtyData.realty_floors_list.push({id:id, label: label});
                if(realtyData.realty_floor == id)
                {
                    realtyData.realty_floors_list[id].selected = 'selected';
                }
                else
                {
                    realtyData.realty_floors_list[id].selected = '';
                }
            }
        }
        else
        {
            realtyData.project_has_floor = 'Voir projet';
        }
    }
    else
    {
        realtyData.project_has_floor = 'Non dispo';
    }

    realtyData.realty_contract_type_lst = contractType;
    for(var i in contractType)
    {
        if(realtyData.realty_contract_type == contractType[i].id) {
            realtyData.realty_contract_type_lst[i].selected = 'selected';
        }
        else
        {
            realtyData.realty_contract_type_lst[i].selected = '';
        }
    }

    realtyData.realtyTypes = realtyTypes;
    for(var i in realtyTypes)
    {
        if(realtyData.realty_type == realtyTypes[i].id)
        {
            realtyData.realtyTypes[i].selected = 'selected';
        }
        else
        {
            realtyData.realtyTypes[i].selected = '';
        }
    }

    realtyData.kitchenTypes = kitchenTypes;
    for(var i in kitchenTypes)
    {
        if(realtyData.realty_kitchen_type == kitchenTypes[i].value)
        {
            realtyData.kitchenTypes[i].selected = 'selected';
        }
        else
        {
            realtyData.kitchenTypes[i].selected = '';
        }
    }

    realtyData.terraceOrientations = terraceOrientations;
    for(var i in terraceOrientations)
    {
        if(realtyData.realty_terrace_orientation == terraceOrientations[i].id)
        {
            realtyData.terraceOrientations[i].selected = 'selected';
        }
        else
        {
            realtyData.terraceOrientations[i].selected = '';
        }
    }

    realtyData.realty_facades_number_lst = realtyFacades;
    for(var i in realtyFacades)
    {
        if(realtyData.realty_facades_number == realtyFacades[i].id)
        {
            realtyData.realty_facades_number_lst[i].selected = 'selected';
        }
        else
        {
            realtyData.realty_facades_number_lst[i].selected = '';
        }
    }

    if(realtyData.realty_availability)
    {
        var availabilityDate = new Date(realtyData.realty_availability);
        realtyData.realty_availability_date = FormEdition.setDateNumberFormat(availabilityDate.getDate()) + '/' + FormEdition.setDateNumberFormat(availabilityDate.getMonth() + 1) + '/' + availabilityDate.getFullYear();
    }

    if(realtyData.realty_start_diffusion_date) {
        var diffusionDate = new Date(realtyData.realty_start_diffusion_date);
        realtyData.realty_diffusion_date = FormEdition.setDateNumberFormat(diffusionDate.getDate()) + '/' + FormEdition.setDateNumberFormat(diffusionDate.getMonth() + 1) + '/' + diffusionDate.getFullYear();
    }

    realtyData.bedroomsList = getDetailsList(realtyData.realty_bedrooms);
    realtyData.bathroomsList = getDetailsList(realtyData.realty_bathrooms);
    realtyData.showersList = getDetailsList(realtyData.realty_showers);

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
        if(realties[i].ProjectId)
        {
            var realtyProject = projects.find((project) => project.id == realties[i].ProjectId);
            var title = realtyProject.project_title;
            realties[i].project_title = title;
        }
        else
        {
            realties[i].project_title = 'Aucun';
        }



        if(realties[i].realty_net_price) realties[i].realty_price = Math.round(parseFloat(realties[i].realty_net_price) + (parseFloat(realties[i].realty_net_price) * (realties[i].realty_vat /100))) + ' €';
        if(realties[i].realty_surface) realties[i].realty_surface = realties[i].realty_surface + ' m²';
        realties[i].realty_active_online = (realties[i].realty_active_online == 0) ? 'Hors ligne' : 'En ligne';

        //console.log(realtyProject.project_title);
    }

    $('#realtiesList tbody').html(tpl(r));

    realtiesTable = $('#realtiesList').DataTable({
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

function setLibraryInterface(realtyId, libraryCategories, realties){

    var libraryData = {readonly: 'readonly'};
    libraryData.categories = libraryCategories
    libraryData.tables = [
        {label : 'Projet', value: 'Projects', selected: ''},
        {label : 'Biens', value: 'Realties', selected: 'selected'}
        ];

    //console.log(realties);
    libraryData.elements = [];
    var selected;
    for (var i in realties)
    {
        selected = (realtyId == realties[i].id)? 'selected': '';
        libraryData.elements.push({id: realties[i].id, label: realties[i].realty_title, selected: selected});
    }

    libraryData.id = '{{id}}';
    libraryData.Library_category_label = '{{Library_category_label}}';

    let libraryTemplate = fs.readFileSync( __dirname + '/view/html/pages/libraries.html').toString();
    let tpl = handlebars.compile(libraryTemplate);
    bootBox.dialog({
        message: tpl(libraryData),
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

    });
}


function removeRealty(id) {
    bootBox.confirm("Voulez-vous vraiment supprimer ce bien", function(result){
        if(result) removeAction(id);
    });
}

function removeAction(id)
{
    require(__dirname + '/class/repositories/Realties').findById(id).then(
        (realty) => {
            FormEdition.editByInputs('Realties', id,[{name: 'realty_status', val: 0}]);
            realtiesTable.row($('#realty-' + id)).remove().draw();

            var fromProject = projects.find((project) => project.id == realty.ProjectId);
            logThisEvent({
                log_message: 'Suppression du bien <strong data-id="' + id + '" data-table="Realties">' + realty.realty_title + '</strong> du projet <strong data-id="' + realty.ProjectId + '" data-table="Projects">' + fromProject.project_title + '</strong>',
                log_action_type: 'remove',
                log_status: true,
                log_table_name: 'Realties',
                log_table_id: realty.id
            });
        });
}

function arrangeData(){

}

function goToProjects() {
    var action = 'projects';
    $('#page-heading').html(MenuActions.searchInMenu('page', action, 'label')).hide().fadeIn();
    $('#core-app').load('view/html/pages/' + action + '.html').hide().fadeIn();
}

function getDetailsList(str)
{
    var objectList = [];
    if(str)
    {
        str = str.replace(/\s+/g, '');
        var listArray = str.split(';');

        for(var i in listArray)
        {
            objectList.push({n: (Number(i) + 1), surface: listArray[i]});
        }

    }
    return objectList;
}