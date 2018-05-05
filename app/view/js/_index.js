const actualYear = new Date();
const electron = require('electron');
const ipc = electron.ipcRenderer;
const menuItems = require('./view/js/menuData').menuItems;
const handlebars = require('handlebars');
const sideMenu = require('./view/js/widgets/SideMenu').SideMenu;
const notifier = require('electron-notification-desktop');
const app = electron.app;
const ManageParameters = require('./class/ManageParameters');
const Connexion = require(__dirname + '/class/Connection.js');

$(document).ready(function() {
    ipc.send('html-page-ready');
});


// IPC
ipc.on('show-logging', function (event){
    initApp();
});

ipc.on('show-update', function (event){
    initUpdate();
});

ipc.on('download-progress', function (event, progressObj){
    $('#preloadPercentBar').attr('style', 'width: ' + progressObj.percent);
    $('#preloadPercent').html(progressObj.percent);
    $('#loaderCallback').html(progressObj.bytesPerSecond+'/s (' + progressObj.transferred + '/' + progressObj.total+')');
});

ipc.on('init-mMain', function (event){
    initMain();
});

ipc.on('message', function(event, text) {
    notifyUser('ImmoEngine Updater', text, 10);
});

// INITS
function initApp()
{
    Connexion.setConnection().then(c =>{
        ManageParameters.getParameters().then(parameters =>{
            ipc.send('setParameters', parameters);
            init_login(parameters);
        });
    });
}

function init_login(parameters){
    let loginTemplate = $('#loginTpl').html();
    let tpl = handlebars.compile(loginTemplate);
    $('#app-frame').html(tpl({}));

    $('#login').val(parameters.user.login);
    $('#password').val(parameters.user.password);
    //$('.loader').hide();
    $('#login-container').fadeIn();
    $('#password').focus();

    $('#login-form').submit(function(){
        let login = $('#login').val();
        let pass = $('#password').val();
        require(__dirname + '/class/repositories/Users').auth(login, pass).then((user) => {
            if (user.id === undefined)
            {
                throw new Error('Erreur de login/pass');
            }
            else
            {
                ipc.send('setUserSession', user);
                $('.container').fadeOut(() => {complete: ipc.send('logged-in');});
            }
        });
        return false;
    });
}

function initUpdate()
{
    let updateTemplate = $('#updateTpl').html();
    let tpl = handlebars.compile(updateTemplate);
    $('#app-frame').html(tpl({}));
}

function initMain()
{
    $('body').removeClass('updater');
    $('body').addClass('infobar-offcanvas');
    let mainTemplate = $('#mainTpl').html();
    let tpl = handlebars.compile(mainTemplate);
    let sessionUser = require('electron').remote.getGlobal('user');
    $('#app-frame').html(tpl({}));
    $.getScript(__dirname + '/view/js/application.js',(data, tS, jqxhr) =>{

    });
    $('#userName').html(sessionUser.firstname);
    $('#userAvatar').attr('src', sessionUser.avatar);
    getPageData();
    initPage();
}

function initPage()
{
    $('body').append('<div id="sideMenuTpl"></div>');
    $('#sideMenuTpl').load('view/html/widgets/SideMenu.html');
    $('#actualYear').html(actualYear.getFullYear());

    $('#core-app').load('view/html/pages/' + menuItems[0].page + '.html', ()=>{
        setSideMenuListeners();
        ipc.send('initializeMenu');
        $('.page-heading h1 i').fadeOut({complete: ()=>{
            $('.page-heading h1 i').remove();
        }});
    }).hide().fadeIn();
}

// MENU CONSTRUCT
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
            console.log(menuItems.page);
            $('#sideMenuButtons li').removeClass('active');
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

// CONSTANT SIDE MENU
function setSideMenuListeners()
{
    $('#logsSideBtn').click(function () {

    });

    $('#parameters-btn').click(function(){
        deactivateSideMenu();
        $(this).parent('li').addClass('active')

        $('#page-heading').html('Paramètres').hide().fadeIn();
        $('#core-app').load('view/html/pages/parameters.html', ()=>{

        }).hide().fadeIn();
    });

    $('#logs-btn').click(function(){
        deactivateSideMenu();
        $(this).parent('li').addClass('active')
        $('#page-heading').html('Logs').hide().fadeIn();
        $('#core-app').load('view/html/pages/logs.html', ()=>{

        }).hide().fadeIn();
    });
}


// CONSTANTS TOOLS
function deactivateSideMenu()
{
    $('#sideMenuButtons li').removeClass('active');
}

function logThisEvent(data)
{
    data.UserId = sessionUser.id;
    data.log_user_name = sessionUser.firstname + " " + sessionUser.lastname[0] + '.';
    require(__dirname + '/class/repositories/Logs').insert(data).then(
        (log) =>{

        });
}

function notifyUser(title, message, duration)
{
    notifier.notify(title, {
        message: message,
        duration: duration,
        icon: 'file://' + __dirname + '/view/images/notification-icon.png'
    });
}