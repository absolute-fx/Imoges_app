Tools = require("./Tools").Tools;

class autoUpdate
{
    constructor(window) {
        this.window = window;
        this.autoUpdater =  require("electron-updater").autoUpdater;
        this.log = require('electron-log');
        this.isDev = require('electron-is-dev');
        this.autoUpdater.logger = this.log;
        this.autoUpdater.logger.transports.file.level = 'info';
        this.log.info('App starting...');

        this.init();
    }

    init(){
        this.autoUpdater.on('checking-for-update', () => {
            Tools.sendStatusToWindow(this.window, 'message', 'Checking for update...');
        });
        this.autoUpdater.on('update-available', (info) => {
            Tools.sendStatusToWindow(this.window, 'message', 'checking-for-update');
            this.window.webContents.send('update-available');
        });
        this.autoUpdater.on('update-not-available', (info) => {
            Tools.sendStatusToWindow(this.window, 'message', 'Update not available.');
        });
        this.autoUpdater.on('error', (err) => {
            console.log(err);
            Tools.sendStatusToWindow(this.window, 'message', 'Error in auto-updater');
        });
        this.autoUpdater.on('download-progress', (progressObj) => {
            Tools.sendStatusToWindow(this.window, 'message', Math.round(progressObj.percent)+'%');
            Tools.sendStatusToWindow(this.window, 'download-progress', {
                'bytesPerSecond': Tools.FileConvertSize(progressObj.bytesPerSecond),
                'percentValue' : Math.round(progressObj.percent),
                'percent' : Math.round(progressObj.percent)+'%',
                'transferred' : Tools.FileConvertSize(progressObj.transferred),
                'total' : Tools.FileConvertSize(progressObj.total)
            });
        });
        this.autoUpdater.on('update-downloaded', (info) => {
            setTimeout(function() {
                this.autoUpdater.quitAndInstall();
            }, 1000)
        });

    }

}

module.exports.autoUpdate = autoUpdate;