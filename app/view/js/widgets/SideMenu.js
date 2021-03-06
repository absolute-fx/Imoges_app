/**
 * Gestion du menu latéral par contexte
 * nécessite Handlebars et Jquery
 */
const electron = require('electron');
const mainWindow = require('electron').remote.getCurrentWindow();

class SideMenu{
    static setSideMenu(title, buttons)
    {
        let data = {sideMenuTitle: title, sideMenuItems: buttons};
        let sideMenuTemplate = $('#sideMenuTemplate').html();
        let sideMenu_tpl = handlebars.compile(sideMenuTemplate);
        let sideMenu = sideMenu_tpl(data);
        let action;

        $('#context-menu').html(sideMenu).hide().fadeIn();

        //mainWindow.webContents.removeListener('sideMenuAction', send);

        $('#sideContextMenuList a').each((index, button)=>{

            $(button).click(function(){
                action = $(button).attr('data-action');
                sideMenuAction(action);
                return false;
            });
        });
    }

    static unsetSideMenu()
    {
        $('#context-menu').html('');
    }
}
module.exports.SideMenu = SideMenu;