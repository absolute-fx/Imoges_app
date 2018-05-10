const fs = require('fs');
const appParams = require('electron').remote.getGlobal('appParameters');

class DesktopManagement{
    static addDirectory(dirName, path)
    {
        let f_path = (path) ? appParams.system.root_path + '/' + path + '/' + dirName : appParams.system.root_path + '/' + dirName ;
        let p_path = (path) ? appParams.system.root_path + '/' + path : appParams.system.root_path;

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

    static checkAllDirectories(type, dir, parent)
    {
        let dirPath;
        let rootPath = appParams.system.root_path;
        switch (type)
        {
            case 'Projects':
                dirPath = rootPath + '/' + parent + '/' + appParams.system.projects_dirs.default.libraries + '/' + dir;

                if(fs.existsSync(dirPath)){
                    return true;
                }
                else {
                    return false;
                }
                break;

            case 'Realties' :
                dirPath = rootPath + '/' + parent + '/' + appParams.system.projects_dirs.default.libraries + '/' + dir;
                if(fs.existsSync(dirPath)){
                    return true;
                }
                else {
                    return false;
                }
                break;
        }
        console.log(dirPath);
    }
}

module.exports.DesktopManagement = DesktopManagement;