var autosize = require('autosize');

$(document).ready(function () {
    autosize($('#longDescription, #shortDescription'));

    $("#fileUploader").dropzone({ url: "/file/post" });
    $('input.bootstrap-switch').bootstrapSwitch();

    $("#projectPhase").select2({width: "100%", tags: allStepsList, val: allStepsList, maximumSelectionSize: 6 }).on('change', function (e) {
        setStepsList(e);
    });

    $('#projectDiffusionDate').datepicker({language: 'fr'});
    $('#projectStartDate').datepicker({language: 'fr'});
    $('#projectEndDate').datepicker({language: 'fr'});
});

function setStepsList(event)
{
    if(event.added)
    {
        if(event.added.id == event.added.text)
        {
            console.log("Nouvelle phase...");
            return false;
        }
    }
    console.log($("#projectPhase").val());

    let stepId;
    let state;
    let count = 0;
    let steps = $("#projectPhase").val().split(",");
    let colSize = Math.floor(12 / steps.length);
    let htmlData = '';

    for(var i in steps)
    {
        stepId = steps[i];
        for(var u in allStepsList)
        {
            if(stepId == allStepsList[u].id)
            {
                if($("#phase_actuelle_projet").val() == allStepsList[u].id){
                    count = 1;
                }else if(count > 0){
                    count = 2;
                }

                switch(count)
                {
                    case 0:
                        state = 'complete';
                        break;

                    case 1:
                        state = 'active';
                        break;

                    case 2:
                        state = 'disabled';
                        break;
                }
                if(i == 0 && steps.length == 5){
                    htmlData += '<div class="col-xs-' + (colSize + 1) + ' process-wizard-step ' + state + '">\n';
                }
                else
                {
                    htmlData += '<div class="col-xs-' + colSize + ' process-wizard-step ' + state + '">\n';
                }
                htmlData += '                    <div class="text-center process-wizard-stepnum">' + allStepsList[u].text + '</div>\n' +
                '                    <div class="progress">\n' +
                '                        <div class="progress-bar"></div>\n' +
                '                    </div>\n' +
                '                    <a href="#" onclick="javascript: setActiveStep(' + allStepsList[u].id + '); return false;" class="process-wizard-dot"></a>\n' +
                '                </div>';
            }
        }
    }
    $('#stepsListContainer').html(htmlData);
}

function setActiveStep(id) {
    $("#phase_actuelle_projet").val(id);
    var obj = {};
    setStepsList(obj);
}

function initMap()
{
    var lat = ($('#lat_projet').val()) ? parseFloat($('#lat_projet').val()) : 50.556996;
    var long = ($('#long_projet').val()) ? parseFloat($('#long_projet').val()) : 4.177536;
    var input = /** @type {!HTMLInputElement} */(
        document.getElementById('googleMapsSearch'));

    var map;
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: lat, lng: long},
        zoom: 16
    });

    var autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.bindTo('bounds', map);

    var infowindow = new google.maps.InfoWindow();
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    if($('#lat_projet').val() && $('#long_projet').val())
    {
        var latLong = new google.maps.LatLng($('#lat_projet').val(), $('#long_projet').val());
        marker.setPosition(latLong);
    }

    autocomplete.addListener('place_changed', function() {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();

        if (!place.geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("Google n'a rien trouvé avec: '" + place.name + "'");
            return;
        }

        $('#long_projet').val(place.geometry.viewport.b.b);
        $('#lat_projet').val(place.geometry.viewport.f.b);

        setFormFromGmaps(place.address_components);

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

    function setFormFromGmaps(data){
        let address, street_number, route, locality, postal_code = '';
        for (let i in data)
        {
            switch (data[i].types[0])
            {
                case 'route':
                    route = data[i].long_name;
                    break;

                case 'street_number':
                    street_number = data[i].long_name;
                    break;

                case 'locality':
                    locality = data[i].long_name;
                    break;

                case 'postal_code':
                    postal_code = data[i].long_name;
                    break;
            }
        }
        if(street_number)
        {
            address = route + " " + street_number;
        }
        else {
            address = route;
        }

        $('#projectAdress').val(address);
        $('#projectCity').val(locality);
        $('#projectPc').val(postal_code);
    }
}