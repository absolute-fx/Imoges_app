/**
 * actions sur le menu
 * ...
 */
const electron = require('electron');
const menuItems = require('../../../view/js/menuData').menuItems;
let searchResult;

class MenuActions{
    static searchInMenu(type, searchTerm, returnItem)
    {
        for (let i in menuItems)
        {
            searchItem(type, searchTerm, returnItem, menuItems[i]);
        }
        if(typeof searchResult != 'undefined')
        {
            return searchResult;
        }
        else
        {
            return 'Not found...';
        }
    }
}

module.exports.MenuActions = MenuActions;

function searchItem(type, searchTerm, returnItem, menuItems){
    //console.log(menuItems);
    if(menuItems[type] != null)
    {
        if(searchTerm == menuItems[type])
        {
            //console.log(menuItems[returnItem]);
            searchResult =  menuItems[returnItem];
        }
    }

    if(menuItems.children != null)
    {
        for (let i in menuItems.children)
        {
            searchItem(type, searchTerm, returnItem, menuItems.children[i]);
        }
    }
}
