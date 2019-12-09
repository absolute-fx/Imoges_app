var autosize = require('autosize');
var FormEdition = require('./view/js/widgets/FormEdition').FormEdition;
var realtyId;
var appParams = require('electron').remote.getGlobal('appParams');
//var userData = require('electron').remote.getGlobal('user');
//var fs = require('fs');

$(document).ready(function () {
    realtyId = $('#realty_id').val();
    autosize($('#longDescription, #shortDescription'));

    $('input.bootstrap-switch').bootstrapSwitch();
    $('input.bootstrap-switch').on('switchChange.bootstrapSwitch', function(event, state) {
        let attrName = $(this).attr('name');
        let fields = [{name: attrName, val: state}];
        FormEdition.editByInputs('Realties', realtyId, fields);
    });

    FormEdition.setUpdateForm('form-tab-1', realtyId);
    FormEdition.setUpdateForm('form-tab-details', realtyId);

    $('#realty_surface').on( 'change keyup paste', (event) => {
        calculatePrice('surface', event);
    });

    $('#realtyNetPrice').on( 'change keyup paste blur', (event) => {
        calculatePrice('net', event);
    });
    $('#realtyPrice').on( 'change keyup paste blur', (event) => {
        calculatePrice('brut', event);
    });
    $('#realtyVat').on( 'change keyup paste', (event) => {
        calculatePrice('vat', event);
    });
    $('#realtyM').on( 'change keyup paste blur', (event) => {
        calculatePrice('m', event);
    });

    $('#availability').datepicker({language: 'fr'}).on('changeDate', (e)=>{
        let fieldDate = [{name: 'realty_availability', val: e.date}];
        FormEdition.editByInputs('Realties', realtyId, fieldDate);
    });

    $('#diffusionDate').datepicker({language: 'fr'}).on('changeDate', (e)=>{
        let fieldDate = [{name: 'realty_start_diffusion_date', val: e.date}];
        FormEdition.editByInputs('Realties', realtyId, fieldDate);
    });

    var price = parseFloat($('#realtyNetPrice').val());
    var vat = $('#realtyVat').val();

    if($('#realtyNetPrice').val() && $('#realty_surface').val() && $('#realtyVat').val())
    {
        var surface = parseFloat($('#realty_surface').val());
        var surfacePrice = (price + (price * (vat / 100))) / surface;
        $('#realtyM').val(surfacePrice.toFixed(2));
    }

    if($('#realtyNetPrice').val() && $('#realtyVat').val())
    {
        var fullPrice = Math.round(price + (price * (vat / 100)));
        $('#realtyPrice').val(fullPrice.toFixed(2));
    }

    setListFromString();
});

function calculatePrice(from, event) {

    let vat ;
    let net;
    let brut;
    let perM;
    let surface = parseFloat($('#realty_surface').val());
    switch (from)
    {
        case 'net':
            if($('#realtyVat').val() && $('#realtyNetPrice').val())
            {
                vat = parseFloat($('#realtyVat').val());
                net =  parseFloat($('#realtyNetPrice').val());
                brut = net + (net * (vat / 100));
                $('#realtyPrice').val(brut.toFixed(2));
                if($('#realty_surface').val())
                {
                    perM = (brut / surface);
                    $('#realtyM').val(perM.toFixed(2));
                }
            }
            if(event.type == 'blur' && $('#realtyNetPrice').val()) $('#realtyNetPrice').val(net.toFixed(2));
            break;
        case 'brut':
            if($('#realtyVat').val() && $('#realtyPrice').val()) {
                vat = parseFloat($('#realtyVat').val());
                brut = parseFloat($('#realtyPrice').val());
                net = brut / (1 + (vat / 100));
                $('#realtyNetPrice').val(net.toFixed(2));
                if ($('#realty_surface').val()) {
                    perM = (brut / surface);
                    $('#realtyM').val(perM.toFixed(2));
                }
            }
            if(event.type == 'blur' && $('#realtyPrice').val()) $('#realtyPrice').val(brut.toFixed(2));
            break;
        case 'vat':
            if($('#realtyVat').val() && $('#realtyNetPrice').val())
            {
                vat = parseFloat($('#realtyVat').val());
                net =  parseFloat($('#realtyNetPrice').val());
                brut = (net + (net * (vat / 100)));
                perM = (brut / surface);
                $('#realtyM').val(perM.toFixed(2));
                $('#realtyPrice').val(brut.toFixed(2));
            }

            break;
        case 'm':
            if($('#realty_surface').val() && $('#realtyM').val() && $('#realtyPrice').val())
            {
                vat = parseFloat($('#realtyVat').val());
                brut = parseFloat($('#realtyM').val()) * surface;
                net =  brut / (1 + (vat /100));

                $('#realtyPrice').val(brut.toFixed(2));
                $('#realtyNetPrice').val(net.toFixed(2));
                if(event.type == 'blur') $('#realtyM').val(parseFloat($('#realtyM').val()).toFixed(2));
            }
            break;
        case 'surface':
            if($('#realtyPrice').val() && $('#realty_surface').val())
            {
                brut = parseFloat($('#realtyPrice').val());
                perM = brut / surface;
                $('#realtyM').val(perM.toFixed(2));
            }

            break;
    }

    if(event.type == 'change') FormEdition.editByInputs('Realties', realtyId,[{name: 'realty_net_price', val: net}, {name: 'realty_vat', val: vat}]);
}

function setListFromString()
{
    $('.stringList').on('change keyup paste', (e) =>{
        var inputId = e.target.id;
        var label = $('#' + inputId).data('label');
        var inputField = $('#' + inputId).val();
        inputField = inputField.replace(/\s+/g, '');
        var itemsList = inputField.split(';');
        $('#' + inputId + 'List').html('');

        for (var i in itemsList)
        {
            if(itemsList[i] != '')
            {
                $('#' + inputId + 'List').append('<li class="list-group-item">' + label + ' ' + (Number(i)+1) + ': <strong>' + itemsList[i] + '</strong> m²</li>') ;
            }
        }
    });
}