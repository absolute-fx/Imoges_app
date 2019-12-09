const actualYear = new Date();
const electron = require('electron');
const ipc = electron.ipcRenderer;
const menuItems = require('./view/js/menuData').menuItems;
const handlebars = require('handlebars');
const sideMenu = require('./view/js/widgets/SideMenu').SideMenu;
const notifier = require('electron-notification-desktop');
const sessionUser = require('electron').remote.getGlobal('user');
const app = electron.app;
const ManageParameters = require('./class/ManageParameters');
const Connexion = require(__dirname + '/class/Connection.js');
const fs = require('fs');

$(document).ready(function() {
    $('#userName').html(sessionUser.firstname);
    $('#userAvatar').attr('src', sessionUser.avatar);
    getPageData();
    initPage();
    createLibDir();
});

function createLibDir(){
    const rootPath = appParams.system.root_path;
    if(!fs.existsSync(rootPath)){
        console.log('---------------------------------------> NOT EXISTING!!!!!!!!!!!!!!!!!!!!')
    }
}

function initPage()
{
    $('body').append('<div id="sideMenuTpl"></div>');
    $('#sideMenuTpl').load('view/html/widgets/SideMenu.html');
    $('#actualYear').html(actualYear.getFullYear());

    Connexion.setConnection().then(c =>{
        ManageParameters.getParameters().then(parameters =>{
            ipc.send('setParameters', parameters);
            $('#core-app').load('view/html/pages/' + menuItems[0].page + '.html', ()=>{

                ipc.send('initializeMenu');

                $('.page-heading h1 i').fadeOut({complete: ()=>{
                    $('.page-heading h1 i').remove();
                }});
            }).hide().fadeIn();
        });
    });
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

function notifyUser(title, message, duration)
{
    notifier.notify(title, {
        message: message,
        duration: duration,
        icon: 'file://' + __dirname + '/view/images/notification-icon.png'
    });
}

ipc.on('message', function(event, text) {
    /*
    var container = document.getElementById('messages');
    var message = document.createElement('div');
    message.innerHTML = text;
    container.appendChild(message);
    */
    notifyUser('ImmoEngine Updater', text, 10);
});

/*
ipc.on('update-available', function (event, args) {
    window.location.replace("update.html#"+window.location.hash.substring(1));
});
*/

$('#logsSideBtn').click(function () {

});

