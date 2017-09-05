const actualYear = new Date();
const electron = require('electron');
const ipc = electron.ipcRenderer;
let modalTriggered;
let sha1 = require('sha1');

$(document).ready(function() {
    $('#actual-year').html(actualYear.getFullYear());
});

$("form").submit(function(){

    $('#form-submit').fadeOut();
    let token = sha1('vietamine' + $('#title-a').val() + 'vietamine' + $('#title-b'). val() + 'vietamine' + $('#description'). val()  + 'vietamine' + $('#url'). val() + 'vietamine');
    $('#token').val(token);
    let data = $('form').serialize();
    console.log(data);
    $.ajax({
        type: "POST",
        url: 'http://www.vietamine.be/ajax.php',
        data: data,
        success: function(data)
        {
           console.log(data);
            $('form').find("input[type=text]").val("");
            $('form').append('<div class="alert alert-success" role="alert">Le site a bien été mis à jour.</div>').hide().fadeIn();
            $('#form-submit').fadeIn();
        },
        error: function(xhr, ajaxOptions, thrownError)
        {
            $('#form-submit').fadeIn();
            $('form').append('<div class="alert alert-danger" role="alert">Problème de connexion au serveur, veuillez réessayer plus tard.</div>').hide().fadeIn();

            console.log(thrownError);

        }
    })
})

function testServerResponse()
{
    let data = [];
    $.ajax({
        type: "POST",
        url: 'http://www.vietamine.be/ajax.php',
        data: data,
        success: function(data)
        {
            $('#menuModal .modal-body').html("Le seveur est accèssible. Tout va bien :)");
        },
        error: function(xhr, ajaxOptions, thrownError)
        {
            $('#menuModal .modal-body').html(thrownError);
            console.log(xhr);
            console.log(thrownError);

        }
    });
    modalTriggered = true;
}

function getSlideDataFromServer()
{
    let data = [];
    $.ajax({
        type: "POST",
        url: 'http://www.vietamine.be/ajax.php',
        data: data,
        success: function(data)
        {
            if(modalTriggered)
            {
                $('#menuModal').on('shown.bs.modal', function (e) {
                    $('#menuModal').modal('hide');
                    $(this).unbind('shown.bs.modal');
                })
            }
            else
            {
                $('#menuModal').modal('hide');
            }

            modalTriggered = true;
            console.log(data);
            //data = eval('(' + data + ')');

            $("#title-a").val(data['titre1']);
            $("#title-b").val(data['titre2']);
            $("#description").val(data['description']);
            $("#url").val(data['url']);

        },
        error: function(xhr, ajaxOptions, thrownError)
        {
            modalTriggered = true;
            console.log(xhr);
            console.log(thrownError);

        }
    });
}

ipc.on('isServerUp', function (event, args) {
    $('#menuModal .modal-body').html("Envoi d'une requête vers le serveur");
    $('#menuModalTitle').html("Test serveur");
    $('#menuModal').modal('show');
    testServerResponse();
});

ipc.on('getSlideData', function (event, args) {
    $('#menuModal .modal-body').html("Récupération des données sur le serveur");
    $('#menuModalTitle').html("Chargement");
    $('#menuModal').modal('show');
    getSlideDataFromServer();
});

ipc.on('resetForm', function (event, args) {
    $('form').find("input[type=text]").val("");
});
