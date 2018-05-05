const fs = require('fs');
const appParams = require('electron').remote.getGlobal('appParams');

class DesktopManagement{
    static addDirectory(dirName, path)
    {
        let f_path = (path) ? appParams.libraryPath + '/' + path + '/' + dirName : appParams.libraryPath + '/' + dirName ;
        let p_path = (path) ? appParams.libraryPath + '/' + path : appParams.libraryPath;

        if (!fs.existsSync(f_path)){
            fs.mkdirSync(f_path);
            logThisEvent({
                log_message: 'Répertoire <strong data-desktop-link="' + f_path + '">' + dirName + '</strong> créé dans <strong data-desktop-link="' + p_path + '">' + p_path + '</strong>',
                log_action_type: 'newDir',
                log_status: true
            });
        }
        else
        {
            logThisEvent({
                log_message: 'Le répertoire <strong data-desktop-link="' + f_path + '">' + dirName + '</strong> existait déjà dans <strong data-desktop-link="' + p_path + '">' + p_path + '</strong>',
                log_action_type: 'newDir',
                log_status: false
            });
        }
    }
}

module.exports.DesktopManagement = DesktopManagement;