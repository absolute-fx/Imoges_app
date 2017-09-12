const {app, BrowserWindow, Menu} = require('electron');
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
let win;
const autoUpdaterClass = require('./class/autoUpdate').autoUpdate;

function createWindow () {

    win = new BrowserWindow({width: 1200, height: 800, icon: "icon.ico"});

    const template = require('./view/js/menuTemplate')(win);
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', () => {
        win = null
    });
    if (!isDev) {
        const autoUpdater = new autoUpdaterClass(win);
        autoUpdater.autoUpdater.checkForUpdates();
    }
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
    app.quit()
}
});

app.on('activate', () => {
    if (win === null) {
    createWindow()
}
});


