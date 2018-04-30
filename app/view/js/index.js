$(document).ready(function(){

    $('#parameters-btn').click(function(){
        deactivateSideMenu();
        $(this).parent('li').addClass('active')
        $('#page-heading').html('Paramètres').hide().fadeIn();
        $('#core-app').load('view/html/pages/parameters.html', ()=>{

        }).hide().fadeIn();
    });

    $('#logs-btn').click(function(){
        deactivateSideMenu();
        $(this).parent('li').addClass('active')
        $('#page-heading').html('Logs').hide().fadeIn();
        $('#core-app').load('view/html/pages/logs.html', ()=>{

        }).hide().fadeIn();
    });
});

function deactivateSideMenu()
{
    $('#sideMenuButtons li').removeClass('active');
}

function logThisEvent(data)
{
    data.UserId = sessionUser.id;
    data.log_user_name = sessionUser.firstname + " " + sessionUser.lastname[0] + '.'
    require(__dirname + '/class/repositories/Logs').insert(data).then(
        (log) =>{

        });
}