const {app, BrowserWindow, Menu} = require('electron');
const {session} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const autoUpdaterClass = require('./class/autoUpdate').autoUpdate;
const aclClass = require('./class/Acl').Acl;

let template;
let menu;
let win;
let acl;

global.pageVars ={};
global.appParams = {libraryPath: 'E:/JOBS/Imoges - Site V3/files_holder'};

function createWindow() {

    win = new BrowserWindow({width: 640, height: 235, icon: "icon.ico", backgroundColor: "#37474f", minimizable: false, maximizable: false});
    win.setMenu(null);


    template = require('./view/js/menuTemplate')(win);
    menu = Menu.buildFromTemplate(template);

    /*
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'v' + app.getVersion()
    }));
    */

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'v' + app.getVersion()
    }));



    win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });

    // ACL
    //acl = new aclClass();

    /*
    if (!isDev) {
        const autoUpdater = new autoUpdaterClass(win);
        autoUpdater.autoUpdater.checkForUpdates();
    }
    else{
        win.webContents.send('show-loging');
    }
    */


}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
});


// INIT HTML
ipc.on('html-page-ready', function (event) {
    if (!isDev) {
        const autoUpdater = new autoUpdaterClass(win);
        autoUpdater.autoUpdater.checkForUpdates();
    }
    else{
        win.webContents.send('show-logging');
    }
});


ipc.on('logged-in', function(event, data) {
    win.setSize(1200, 850);
    win.center();
    win.setMinimizable(true);
    win.setMaximizable(true);
    win.maximize();
    win.setMenu(null);
    win.webContents.send('init-mMain');
    //setCookies(data, data.login, data.pass);

    /*
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'v' + app.getVersion()
    }));
    */
});

/*
function setCookies(data, login, pass)
{
    const cookie_mail = {url: 'http://www.imoges.be', name: 'imoges_account_login', value: login, expirationDate: 999999999999999999999999999, domain:'www.imoges.be'};
    const cookie_password = {url: 'http://www.imoges.be', name: 'imoges_account_password', value: pass, expirationDate: 999999999999999999999999999, domain:'www.imoges.be'};

    session.defaultSession.cookies.set(cookie_mail, (error) => {
        if (error) console.error(error);
    });

    session.defaultSession.cookies.set(cookie_password, (error) => {
        if (error) console.error(error);
    });
    session.defaultSession.cookies.get({url: 'http://www.imoges.be', name: 'imoges_account_login'}, (error, cookie) => {
        console.log(cookie);
    });

    session.defaultSession.cookies.get({url: 'http://www.imoges.be', name: 'imoges_account_password'}, (error, cookie) => {
        console.log(cookie);
    });
    win.webContents.send('login-success', data);
}

ipc.on('getCookies', function (event, data) {

    session.defaultSession.cookies.get({url: 'http://www.imoges.be'}, (error, cookie) => {
        console.log(cookie);
    });

    let cookieData = {};
    session.defaultSession.cookies.get({url: 'http://www.imoges.be', name: 'imoges_account_login'}, (error, cookie) => {
        if(cookie.length > 0) cookieData.login = cookie[0].value;
        session.defaultSession.cookies.get({url: 'http://www.imoges.be', name: 'imoges_account_password'}, (error, cookie) => {
            if(cookie.length > 0)cookieData.pass = cookie[0].value;
            win.webContents.send('cookie', cookieData);
        });

    });
});
*/




// UPDATER
ipc.on('update-available', function (event, data) {
    win.webContents.send('show-update');
});

ipc.on('update-not-available', function (event, data) {
    win.webContents.send('show-logging');
});
// UPDATER FIN


ipc.on('setPageVar', function (event, data) {
    global.pageVars = {name: data.name, id: data.id};
    //console.log(global.pageVars);
});

ipc.on('initializeMenu', function (event, data) {
    Menu.setApplicationMenu(menu);
});

ipc.on('setParameters', function(event, parameters) {
    global.appParameters = parameters;
});

ipc.on('setUserSession', function (event, data) {
    global.user = data.dataValues;
    console.log(global.user);
});

ipc.on('unsetAppMenu', function(event) {
    win.setMenu(null);
});

ipc.on('setAppMenu', function(event) {
    win.setMenu(menu);
});