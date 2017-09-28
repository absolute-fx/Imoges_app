const {app, BrowserWindow, Menu} = require('electron');
const {session} = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path');
const url = require('url');
const isDev = require('electron-is-dev');
const autoUpdaterClass = require('./class/autoUpdate').autoUpdate;
let template;
let menu;
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


    template = require('./view/js/menuTemplate')(win);
    menu = Menu.buildFromTemplate(template);

    //win.webContents.openDevTools();

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
    win.setMaximizable(true);
    win.maximize();
    win.setMenu(null);
    Menu.setApplicationMenu(menu);
    setCookies(data.login, data.pass);
    win.webContents.send('login-success', data);
    /*
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
        hash: 'v' + app.getVersion()
    }));
    */
});

function setCookies(login, pass)
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

}

ipc.on('getCookies', function (event, data) {

    /*
    session.defaultSession.cookies.remove('http://www.imoges.be','imoges_account_login', (error) => {
        if (error) console.error(error);
    });
    */

    session.defaultSession.cookies.get({url: 'http://www.imoges.be'}, (error, cookie) => {
        console.log(cookie);
    });

    let cookieData = {};
    session.defaultSession.cookies.get({url: 'http://www.imoges.be', name: 'imoges_account_login'}, (error, cookie) => {
        //console.log(cookie.length);
        if(cookie.length > 0) cookieData.login = cookie[0].value;
        session.defaultSession.cookies.get({url: 'http://www.imoges.be', name: 'imoges_account_password'}, (error, cookie) => {
            //console.log(error);
            if(cookie.length > 0)cookieData.pass = cookie[0].value;
            win.webContents.send('cookie', cookieData);
        });

    });
});
