var autosize = require('autosize');
var FormEdition = require('./view/js/widgets/FormEdition').FormEdition;
var realtyId;

$(document).ready(function () {
    /*
    projectId = $('#project_id').val();
    autosize($('#longDescription, #shortDescription'));

    $("#fileUploader").dropzone({ url: "/file/post" });
    $('input.bootstrap-switch').bootstrapSwitch();
    $('input.bootstrap-switch').on('switchChange.bootstrapSwitch', function(event, state) {
        let fields = [{name: 'project_active_online', val: state}];
        FormEdition.editByInputs('Projects', projectId, fields);
    });

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
    */
});
