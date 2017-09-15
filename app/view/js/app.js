const actualYear = new Date();
const electron = require('electron');
const ipc = electron.ipcRenderer;
const menuItems = require('./view/js/menuData').menuItems;
const handlebars = require('handlebars');
const sideMenu = require('./view/js/widgets/SideMenu').SideMenu;
//const pjson = require('../package.json');
const notifier = require('electron-notification-desktop');

$(document).ready(function() {
    getPageData();
    initPage();
    //notifyMe('blabla', 'bloblo', 10);
});

function initPage()
{
    $('body').append('<div id="sideMenuTpl"></div>');
    $('#sideMenuTpl').load('view/html/widgets/SideMenu.html');
    $('#actualYear').html(actualYear.getFullYear());
    //$('#appVersion').html('V' + pjson.version);

    $('#core-app').load('view/html/pages/' + menuItems[0].page + '.html', ()=>{

    }).hide().fadeIn();
}

function getPageData() {
    let pItem;
    for (let i in menuItems)
    {
        pItem = {};
        pItem = setPageElement(menuItems[i], pItem);
    }
}

function setPageElement(menuItems, pItem)
{
    if(menuItems.page != null)
    {
        ipc.on(menuItems.page, function (event, args) {
            $('#core-app').load('view/html/pages/' + menuItems.page + '.html', ()=>{
                $('#page-heading').html(menuItems.label).hide().fadeIn();
            }).hide().fadeIn();
        });
    }

    if(menuItems.children != null)
    {
        for (let i in menuItems.children)
        {
            setPageElement(menuItems.children[i], pItem);
        }
    }
    return pItem;
}

function notifyMe(title, message, duration)
{
    notifier.notify(title, {
        message: message,
        duration: duration,
        icon: 'file://' + __dirname + '/view/images/notification-icon.png'
    })
}

ipc.on('message', function(event, text) {
    /*
    var container = document.getElementById('messages');
    var message = document.createElement('div');
    message.innerHTML = text;
    container.appendChild(message);
    */
    notifyMe('ImmoEngine Updater', text, 10);
});

ipc.on('update-available', function (event, args) {
    window.location.replace("update.html#"+window.location.hash.substring(1));
});

$('#logsSideBtn').click(function () {
    notifyMe('test message');
    console.log('click');
});