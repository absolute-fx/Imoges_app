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
        var autoUpdater = this.autoUpdater;
        autoUpdater.on('checking-for-update', () => {
            Tools.sendStatusToWindow(this.window, 'message', 'Vérification des mises à jour');
        });
        autoUpdater.on('update-available', (info) => {
            Tools.sendStatusToWindow(this.window, 'message', 'Mise à jour détectée');
            this.window.webContents.send('update-available');
        });
        autoUpdater.on('update-not-available', (info) => {
            Tools.sendStatusToWindow(this.window, 'message', 'Vous utilisez la dernière version de ImmoEngine');
        });
        autoUpdater.on('error', (err) => {
            console.log(err);
            Tools.sendStatusToWindow(this.window, 'message', 'Error in auto-updater '+err.toString());
        });
        autoUpdater.on('download-progress', (progressObj) => {
            //Tools.sendStatusToWindow(this.window, 'message', Math.round(progressObj.percent)+'%');
            Tools.sendStatusToWindow(this.window, 'download-progress', {
                'bytesPerSecond': Tools.FileConvertSize(progressObj.bytesPerSecond),
                'percentValue' : Math.round(progressObj.percent),
                'percent' : Math.round(progressObj.percent)+'%',
                'transferred' : Tools.FileConvertSize(progressObj.transferred),
                'total' : Tools.FileConvertSize(progressObj.total)
            });
        });
        autoUpdater.on('update-downloaded', (info) => {
            //Tools.sendStatusToWindow(this.window, 'message', JSON.stringify(info));
            console.log(JSON.stringify(info));
            var releaseVersion = info.version ;
            var releaseName = info.releaseName;
            var releaseDescription = info.releaseMessage;
            var versionInfos = "<p>Version " + releaseVersion + " | " + releaseName + "</p>";
            if(releaseDescription != "") versionInfos += "<p>" + releaseDescription + "</p>";
            Tools.sendStatusToWindow(this.window, 'message', versionInfos);
            setTimeout(function() {
                autoUpdater.quitAndInstall();
            }, 50000);

        });

    }

}

module.exports.autoUpdate = autoUpdate;