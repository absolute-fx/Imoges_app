const {app, BrowserWindow, Menu} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const autoUpdaterClass = require('./class/autoUpdate').autoUpdate;

let win;

function createWindow() {
    win = new BrowserWindow({width: 640, height: 235, icon: "icon.ico", backgroundColor: "#37474f", minimizable: false, maximizable: false});
    win.setMenu(null);
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'v' + app.getVersion()
    }));



    win.on('closed', () => {
        win = null;
    });

    if (!isDev) {
        const autoUpdater = new autoUpdaterClass(win);
        autoUpdater.autoUpdater.checkForUpdates();
    }
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



ipc.on('auth', function(event, data) {
    win.setSize(1200, 850);
    win.center();
    win.setMinimizable(true);
    win.setMaximizable(true);
    win.maximize();
    console.log(data);
    const template = require('./view/js/menuTemplate')(win);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'v' + app.getVersion()
    }));
    //win.setW;
});