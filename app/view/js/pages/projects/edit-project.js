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
    var input = /** @type {!HTMLInputElement} */(
        document.getElementById('googleMapsSearch'));

    var map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50.556996, lng: 4.177536},
        zoom: 12
    });

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        console.log(place);
        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setIcon(/** @type {google.maps.Icon} */({
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
        infowindow.open(map, marker);
    });


}