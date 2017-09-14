const electron = require('electron');
const pjson = require('../../package.json');
const menuItems = require('./menuData').menuItems;

function contactSupport()
{
    electron.shell.openExternal('mailto:info@absolute-fx.com;info@proglab.com?subject=Support application Imoges');
}

function goToWebsite()
{
    electron.shell.openExternal('http://www.imoges.be/');
}


function setItemElement(window, menuItem, mItem)
{
    switch(menuItem.type)
    {
        case 'separator':
            mItem.type = 'separator';
            break;
        case 'version':
            mItem.label = 'Version ' + pjson.version;
            mItem.enabled = menuItem.enabled;
            break;
        case 'afxLabSupport':
            mItem.label = menuItem.label;
            mItem.click = () => {
                            contactSupport();
                        };
            break;
        case 'goToSite':
            mItem.label = menuItem.label;
            mItem.click = () => {
                            goToWebsite();
                        };
            break;
        default:

            mItem.label = menuItem.label;
            if(menuItem.page != null)
            {
                mItem.click =  () => {
                                window.webContents.send(menuItem.page);
                            };
            }
            if(menuItem.role != null)
            {
                mItem.role = menuItem.role;
            }
            if(menuItem.enabled != null)
            {
                mItem.enabled = menuItem.enabled;
            }
            if(menuItem.children != null)
            {
                let mItemB;
                mItem.submenu = [];
                for (let i in menuItem.children)
                {
                    mItemB = {};
                    mItem.submenu.push(setItemElement(window, menuItem.children[i], mItemB));
                }
            }

    }
    return mItem;
}

function buildMenu(window)
{
    let menuObject = [];
    let mItem;
    for (let menuItem in menuItems)
    {
        mItem = {};
        mItem = setItemElement(window, menuItems[menuItem], mItem);
        menuObject.push(mItem);
    }

    return menuObject;
}

module.exports = function(window){
    return buildMenu(window);
};
