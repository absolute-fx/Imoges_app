const actualYear = new Date();
const electron = require('electron');
const ipc = electron.ipcRenderer;
const menuItems = require('./view/js/menuData').menuItems;
const handlebars = require('handlebars');
const sideMenu = require('./view/js/widgets/SideMenu').SideMenu;
//const pjson = require('../package.json');
const notifier = require('electron-notification-desktop');

$(document).ready(function() {
    getPageData();
    initPage();
});

function initPage()
{
    $('body').append('<div id="sideMenuTpl"></div>');
    $('#sideMenuTpl').load('view/html/widgets/SideMenu.html');
    $('#actualYear').html(actualYear.getFullYear());

    $('#core-app').load('view/html/pages/' + menuItems[0].page + '.html', ()=>{

    }).hide().fadeIn();
}

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
            $('#core-app').load('view/html/pages/' + menuItems.page + '.html', ()=>{
                $('#page-heading').html(menuItems.label).hide().fadeIn();
            }).hide().fadeIn();
        });
    }

    if(menuItems.children != null)
    {
        for (let i in menuItems.children)
        {
            setPageElement(menuItems.children[i], pItem);
        }
    }
    return pItem;
}

function notifyUser(title, message, duration)
{
    notifier.notify(title, {
        message: message,
        duration: duration,
        icon: 'file://' + __dirname + '/view/images/notification-icon.png'
    });
}

ipc.on('message', function(event, text) {
    /*
    var container = document.getElementById('messages');
    var message = document.createElement('div');
    message.innerHTML = text;
    container.appendChild(message);
    */
    notifyUser('ImmoEngine Updater', text, 10);
});

ipc.on('update-available', function (event, args) {
    window.location.replace("update.html#"+window.location.hash.substring(1));
});

var Sequelize = require('sequelize');
var dbConfig = require(__dirname + '/db_login.json');
var sequelize_paid = new Sequelize(dbConfig.db, dbConfig.login, dbConfig.pass, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
});


$('#logsSideBtn').click(function () {
    const User = sequelize_paid.define('user', {
        firstName: {
            type: Sequelize.STRING
        },
        lastName: {
            type: Sequelize.STRING
        }
    });



    User.findAll().then(users => {

        users.forEach(function (user) {
            console.log(user.lastName);
        });
    });

});

