const actualYear = new Date();
const electron = require('electron');
const ipc = electron.ipcRenderer;
const menuItems = require('./view/js/menuData').menuItems;
const handlebars = require('handlebars');

$(document).ready(function() {
    $('#actual-year').html(actualYear.getFullYear());
    getPageData();

    $('#core-app').load('view/html/' + menuItems[0].page + '.html', ()=>{

    }).hide().fadeIn();
});


function getPageData() {
    let pItem;
    for (let i in menuItems)
    {
        pItem = {};
        pItem = setPageElement(menuItems[i], pItem);
    }
}

function setPageElement(menuItems, pItem)
{
    if(menuItems.page != null)
    {
        ipc.on(menuItems.page, function (event, args) {
            $('#core-app').load('view/html/' + menuItems.page + '.html', ()=>{
                $('#page-heading').html(menuItems.label).hide().fadeIn()
            }).hide().fadeIn()
        });
    }

    if(menuItems.children != null)
    {
        for (let i in menuItems.children)
        {
            setPageElement(menuItems.children[i], pItem)
        }
    }
    return pItem;
}