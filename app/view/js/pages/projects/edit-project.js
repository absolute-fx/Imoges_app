var autosize = require('autosize');

var tagsObj = [
    {id: 0, text: "Défrichage terrain"},
    {id: 1, text: "Fondations"},
    {id: 2, text: "Gros oeuvre"},
    {id: 3, text: "Toiture"},
    {id: 4, text: "Pose chassis"},
    {id: 5, text: "Finitions"},
    {id: 6, text: "Terminé"},
    {id: 7, text: "Phase 1"},
    {id: 8, text: "Phase 2"}
];

$(document).ready(function () {
    autosize($('#longDescription, #shortDescription'));

    $("#imageUploader").dropzone({ url: "/file/post" });
    $("#fileUploader").dropzone({ url: "/file/post" });

    $("#e12").select2({width: "100%", tags: tagsObj, val: tagsObj }).on('change', function (e) {

    });

});

function initMap()
{
    var map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50.556996, lng: 4.177536},
        zoom: 12
    });
}