const actualYear = new Date();
const electron = require('electron');
const ipc = electron.ipcRenderer;
const menuItems = require('./view/js/menuData').menuItems;
const handlebars = require('handlebars');
const sideMenu = require('./view/js/widgets/SideMenu').SideMenu;
const pjson = require('../package.json');
const WindowsBalloon = require('node-notifier').WindowsBalloon;

$(document).ready(function() {
    getPageData();
    initPage();
});

function initPage()
{
    $('body').append('<div id="sideMenuTpl"></div>');
    $('#sideMenuTpl').load('view/html/widgets/SideMenu.html');
    $('#actualYear').html(actualYear.getFullYear());
    $('#appVersion').html('V' + pjson.version);

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
            }).hide().fadeIn()
        });
    }

    if(menuItems.children != null)
    {
        for (let i in menuItems.children)
        {
            setPageElement(menuItems.children[i], pItem)
        }
    }
    return pItem;
}

function notifyMe(message)
{
    var notifier = new WindowsBalloon({
        withFallback: false, // Try Windows Toast and Growl first?
        customPath: void 0 // Relative/Absolute path if you want to use your fork of notifu
    });

    notifier.notify({
        title: 'ImmoEngine updater',
        message: message,
        sound: true, // true | false.
        time: 10000, // How long to show balloon in ms
        wait: false, // Wait for User Action against Notification
        type: 'info' // The notification type : info | warn | error
    }, function(error, response) {
        //console.log(response);
    });
}



$('#logsSideBtn').click(function () {
    notifyMe('test message');
    console.log('click');
});