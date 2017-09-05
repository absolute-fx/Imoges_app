const electron = require('electron');
const pjson = require('./package.json');
const dialog = require('electron').dialog;

function contactSupport()
{
    electron.shell.openExternal('mailto:info@absolute-fx.com;info@proglab.com?subject=Support application Vietamine');
}

function goToWebsite(){
    electron.shell.openExternal('http://www.vietamine.be/');
}

module.exports = function(window){
    return[
        {
            label: 'Serveur',
            submenu: [
                {
                    label: 'Tester la connexion serveur',
                    click: () => {
                        window.webContents.send('isServerUp', []);
                    }
                },
                {
                    label: 'Charger le contenu actuel du site',
                    click: () => {
                        window.webContents.send('getSlideData', []);
                    }
                }
            ]
        },
        {
            label: 'Edition',
            submenu: [
                {
                    label: 'Reset du formulaire',
                    click: () => {
                        window.webContents.send('resetForm', []);
                    }
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Annuler',
                    role: 'undo'
                },
                {
                    label: 'Refaire',
                    role: 'redo'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Couper',
                    role: 'cut'
                },
                {
                    label: 'Copier',
                    role: 'copy'
                },
                {
                    label: 'Coller',
                    role: 'paste'
                },
                {
                    label: 'Supprimer',
                    role: 'delete'
                },
                {
                    label: 'Tout sélectionner',
                    role: 'selectall'
                }
            ]
        },
        {
            label: 'Aide',
            submenu: [
                {
                    label: "Version " + pjson.version,
                    enabled: false
                },
                {
                    label: "Voir le site",
                    click: () => {
                        goToWebsite()
                    }
                },
                {
                    label: "Contacter le support",
                    click: () => {
                        contactSupport()
                    }
                },
                {
                    label: "Debug",
                    role: "toggledevtools"
                }
            ]
        },
        {
            label: 'Quitter',
            role: 'quit'
        },
    ]
};