const {app, BrowserWindow, Menu} = require('electron');
const {session} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const autoUpdaterClass = require('./class/autoUpdate').autoUpdate;
let now = new Date();
now = new Date(now.setSeconds(now.getSeconds() + 120));
const cookie_mail = {url: 'http://www.imoges.be', name: 'imoges_account_login', value: 'manu@absolute-fx.com', expirationDate: 999999999999999999999999999, domain: 'imoges.be'};
const cookie_password = {url: 'http://www.imoges.be', name: 'imoges_account_password', value: 'manux88', expirationDate: 999999999999999999999999999, domain: 'imoges.be'};
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

    //win.webContents.openDevTools();

    session.defaultSession.cookies.set(cookie_mail, (error) => {
        if (error) console.error(error);
    });
    session.defaultSession.cookies.get({url: 'http://www.imoges.be'}, (error, cookies) => {
        console.log(cookies);
    });

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
});
