const {app, BrowserWindow, Menu} = require('electron');
const {session} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const autoUpdaterClass = require('./class/autoUpdate').autoUpdate;
const aclClass = require('./class/Acl').Acl;
var autoUpdater;

let template;
let menu;
let win;
let acl;

global.pageVars ={};
global.appParams = {libraryPath: 'E:/JOBS/Imoges - Site V3/files_holder'};

function createWindow() {

    win = new BrowserWindow({width: 640, height: 235, icon: "icon.ico", backgroundColor: "#37474f", minimizable: false, maximizable: false});
    win.setMenu(null);

    win.loadURL(url.format({
        pathname: path.join(__dirname, '_index.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'v' + app.getVersion()
    }));

    template = require('./view/js/menuTemplate')(win);
    menu = Menu.buildFromTemplate(template);

    autoUpdater = new autoUpdaterClass(win);

    // ACL
    acl = new aclClass();

    win.on('closed', () => {
        win = null;
    });


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
        autoUpdater.autoUpdater.checkForUpdates();
    }
    else{
        win.webContents.openDevTools();
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
});

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