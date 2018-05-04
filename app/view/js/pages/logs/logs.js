var FormEdition = require('./view/js/widgets/FormEdition').FormEdition;
var logsTable;
var iconList = {
        add: {icon: 'fa-plus-square', color: 'text-muted'},
        remove: {icon: 'fa-trash-o', color: 'text-muted'},
        bind: {icon: 'fa-chain', color: 'text-muted'},
        unbind: {icon: 'fa-chain-broken', color: 'text-muted'},
        update: {icon: 'fa-pencil', color: 'text-muted'},
        upload: {icon: 'fa-cloud-upload', color: 'text-muted'},
        newDir: {icon: 'fa-folder', color: 'text-muted'}
    };

$(document).ready(() => {
    // SIDE MENU SETTER ~ UNSETTER
    sideMenu.unsetSideMenu();

    getLogsList();
});

function getLogsList()
{
    // CALL TO SERVICES
    //var whereQuery = (projectId) ? {where: {ProjectId: projectId, realty_status: 1}} : {where: {realty_status: 1}};
    require(__dirname + '/class/repositories/Logs').findAll({order: [['id', 'DESC']], limit: 200}).then((logs) => {
        console.log(logs);
        setLogsList(logs);
    }).catch((error) => {
        alert(error.toString());
    });
}

function setLogsList(logs)
{
    let logsLisTemplate = $('#logsListTpl').html();
    let tpl = handlebars.compile(logsLisTemplate);

    for(var i in logs)
    {
        logs[i].icon = iconList[logs[i].log_action_type].icon;
        logs[i].iconColor = iconList[logs[i].log_action_type].color;
        logs[i].status = (logs[i].log_status) ? 'success' : 'danger';
        logs[i].statusIcon = (logs[i].log_status) ? 'fa-check' : 'fa-exclamation-circle';
        var date = new Date(logs[i].createdAt);
        var dateString = FormEdition.setDateNumberFormat(date.getDate()) + '/' + FormEdition.setDateNumberFormat(date.getMonth() + 1) + '/' + date.getFullYear();
        logs[i].log_date = dateString;
    }

    var l = {logs: logs};

    $('#logsList tbody').html(tpl(l));

    console.log($(document).width());
    var fineTunedList = ($(document).width() > 1920) ? 50: 20;

    logsTable = $('#logsList').DataTable({
        pageLength: fineTunedList,
        lengthMenu: [[10, 20, 50, 100], [10, 20, 50, 100]],
        ordering: false,
        language: {
            lengthMenu: "_MENU_",
        },
        columnDefs: [
            { orderable: false, "targets": 2, sType: "html" }
        ]
    });

    $('.dataTables_filter input').attr('placeholder','Rechercher...');


    //DOM Manipulation to move datatable elements integrate to panel
    $('.panel-ctrls').append($('.dataTables_filter').addClass("pull-right")).find("label").addClass("panel-ctrls-center");
    $('.panel-ctrls').append("<i class='separator'></i>");
    $('.panel-ctrls').append($('.dataTables_length').addClass("pull-left")).find("label").addClass("panel-ctrls-center");

    $('.panel-footer').append($(".dataTable+.row"));
    $('.dataTables_paginate>ul.pagination').addClass("pull-right m0");
}