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
        {label: 'Ajouter un bien', icon: 'fa fa-plus', action: 'addRealty'}
    ]
);

// SIDE MENU ACTION SWITCHER
function sideMenuAction(action)
{
    switch (action){
        case 'addRealty':
            //addProject();
            break;
        case 'stat':
            //showStats();
            break;
    }
}

// CALL TO SERVICE


// INIT
$(document).ready(function() {
    $('#example').dataTable({
        "language": {
            "lengthMenu": "_MENU_"
        }
    });
    $('.dataTables_filter input').attr('placeholder','Search...');


    //DOM Manipulation to move datatable elements integrate to panel
    $('.panel-ctrls').append($('.dataTables_filter').addClass("pull-right")).find("label").addClass("panel-ctrls-center");
    $('.panel-ctrls').append("<i class='separator'></i>");
    $('.panel-ctrls').append($('.dataTables_length').addClass("pull-left")).find("label").addClass("panel-ctrls-center");

    $('.panel-footer').append($(".dataTable+.row"));
    $('.dataTables_paginate>ul.pagination').addClass("pull-right m0");

});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// PAGE SPECIFIC ACTIONS //**********************************************************************************


// SIDE NAV ACTIONS

