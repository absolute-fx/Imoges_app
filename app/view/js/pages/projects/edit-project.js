var autosize = require('autosize');
var FormEdition = require('./view/js/widgets/FormEdition').FormEdition;
var projectId;

$(document).ready(function () {
    projectId = $('#project_id').val();
    autosize($('#longDescription, #shortDescription'));

    $("#fileUploader").dropzone({ url: "/file/post" });

    $('input.bootstrap-switch').bootstrapSwitch();
    $('input.bootstrap-switch').on('switchChange.bootstrapSwitch', function(event, state) {
        let attrName = $(this).attr('name');
        let fields = [{name: attrName, val: state}];
        console.log(fields);
        FormEdition.editByInputs('Projects', projectId, fields);
    });
    /*
    $('input.bootstrap-switch').on('switchChange.bootstrapSwitch', function(event, state) {
        let fields = [{name: 'project_active_online', val: state}];
        FormEdition.editByInputs('Projects', projectId, fields);
    });
    */
    $("#projectPhase").select2({width: "100%", tags: phases, val: phases, maximumSelectionSize: 6 }).on('change', function (e) {
        setStepsList(e);
    });

    $('#projectDiffusionDate').datepicker({language: 'fr'}).on('changeDate', (e)=>{
        let fieldDateA = [{name: 'project_start_diffusion_date', val: e.date}];
        FormEdition.editByInputs('Projects', projectId, fieldDateA);
    });
    $('#projectStartDate').datepicker({language: 'fr'}).on('changeDate', (e)=>{
        let fieldDateB = [{name: 'project_start_build_date', val: e.date}];
        FormEdition.editByInputs('Projects', projectId, fieldDateB);
    });
    $('#projectEndDate').datepicker({language: 'fr'}).on('changeDate', (e)=>{
        let fieldDateC = [{name: 'project_end_build_date', val: e.date}];
        FormEdition.editByInputs('Projects', projectId, fieldDateC);
    });

    $('#project_title').on( 'change keyup paste', () => {
        $('*[data-projectId="' + projectId + '"] h2').html($('#project_title').val());
        $('.modal-header h4').html($('#project_title').val());
    });

    FormEdition.setUpdateForm('form-tab-1', projectId);
    FormEdition.setUpdateForm('form-tab-2', projectId);
    FormEdition.setUpdateForm('form-tab-3', projectId);
    FormEdition.setUpdateForm('form-details', projectId);
});

function setStepsList(event)
{
    if(event.added)
    {
        // Si ajout nouvelle phase
        if(event.added.id == event.added.text){
           // insert de la nouvelle phase
            require(__dirname + '/class/repositories/Phases').insert({
                'title': event.added.text
            }).then((phase) => {
                console.log("Phase added : " + phase.id);
                // ajout de la phase au projet
                require(__dirname + '/class/repositories/Projects').findById(projectId).then(
                    (p) => {
                        p.addPhases(phase.id);
                        phases.push({id: phase.id, text: phase.title});
                        project.Phases.push({id: phase.id, title:phase.title});
                        setStepLine();
                    });

            }).catch((error) => {
                alert(error.toString());
            });

            //return false;
        }
        else {

            require(__dirname + '/class/repositories/Projects').findById(projectId).then(
                (p) => {
                    p.addPhases(event.added.id);
                    project.Phases.push({id: event.added.id, title:event.added.text});
                    setStepLine();
                });
        }
    }
    else
    {
        setStepLine();
    }
}

function setStepLine()
{
    console.log($("#projectPhase").val());
    let steps = [];
    for(let p in project.Phases)
    {
        steps.push(project.Phases[p].id);
    }

    let stepId;
    let state;
    let count = 0;
    //let steps = $("#projectPhase").val().split(",");
    let colSize = Math.floor(12 / steps.length);
    let htmlData = '';

    for(var i in steps)
    {
        stepId = steps[i];
        for(var u in phases)
        {
            if(stepId == phases[u].id)
            {
                if($("#phase_actuelle_projet").val() == phases[u].id){
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
                htmlData += '                    <div class="text-center process-wizard-stepnum">' + phases[u].text + '</div>\n' +
                    '                    <div class="progress">\n' +
                    '                        <div class="progress-bar"></div>\n' +
                    '                    </div>\n' +
                    '                    <a href="#" onclick="javascript: setActiveStep(' + phases[u].id + '); return false;" class="process-wizard-dot"></a>\n' +
                    '                </div>';
            }
        }
    }
    $('#stepsListContainer').html(htmlData);
}

function setActiveStep(id) {
    $("#phase_actuelle_projet").val(id);
    let fields = [
        {name: 'project_actual_phase', val: id}
    ];
    FormEdition.editByInputs('Projects', projectId, fields);
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
        zoom: 17
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

        //$('#long_projet').val(place.geometry.viewport.b.b);
        //$('#lat_projet').val(place.geometry.viewport.f.b);

        //console.log(place.geometry.location);

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
        setFormFromGmaps(place);
    });

    function setFormFromGmaps(d){
        let address, street_number, route, locality, postal_code = '';
        let data = d.address_components;
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

        $('#lat_projet').val(d.geometry.location.lat());
        $('#long_projet').val(d.geometry.location.lng());
        $('#projectAdress').val(address);
        $('#projectCity').val(locality);
        $('#projectPc').val(postal_code);

        let fields = [
            {name: 'project_address', val: address},
            {name: 'project_city', val: locality},
            {name: 'project_pc', val: postal_code},
            {name: 'project_lat', val: d.geometry.location.lat()},
            {name: 'project_long', val: d.geometry.location.lng()}
        ];
        FormEdition.editByInputs('Projects', projectId, fields);
    }
}