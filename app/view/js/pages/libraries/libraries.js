var appParams = require('electron').remote.getGlobal('appParams');
var userData = require('electron').remote.getGlobal('user');
var fs = require('fs');
var notify = require('bootstrap-notify');
var categoriesTable;
var uploader;

$(document).ready(function(){
    $('.category-edit').hide();
    uploader = $("#fileUploader").dropzone({
        url: "http://imoges.afxlab.be/upload.php",
        autoProcessQueue: true,
        uploadMultiple: true,
        parallelUploads: 5,
        init: function()
        {
            this.on("complete", function(file) {
                console.log(file);
                var toInsert = {
                    library_media_name: file.name,
                    library_media_type: file.type,
                    library_media_size: file.size,
                    library_media_resource: 'guest',
                    LibrarycategoryId: $('#catSelect').val(),
                    UserId: userData.id
                };

                require(__dirname + '/class/repositories/Libraries').insert(toInsert).then(
                    (library) =>{
                        //realty.library = library;
                        fs.createReadStream(file.path).pipe(fs.createWriteStream(appParams.libraryPath + 'test.jpg'));
                        this.removeFile(file);
                    });

            });
            this.on("queuecomplete", function(file) {
                $.notify({
                    icon:'fa fa-warning',
                    message: "C'est dans la boite"
                },{
                    element: '.notify-here',
                    z_index: 5000,
                    delay: 3000,
                    placement: {
                        from: 'bottom',
                        align: 'center'
                    },
                    type: 'success',
                    animate: {
                        enter: 'animated flipInY',
                        exit: 'animated flipOutX'
                    }
                });
            });
        }
    });

    $(".uploader-zone").hide();

    $('#catSelect, #tableNameSelect, #elementsSelect').on('change', function(){
        if($('#catSelect').val() && $('#tableNameSelect').val() && $('#elementsSelect').val())
        {
            $(".uploader-zone").show();
        }
        else
        {
            $(".uploader-zone").hide();
        }
        setThisCategory($('#catSelect').val());
    });

    if($('#categoriesList .editableTr').length) {
        $('#categoriesList .editableTr').editable({
            closeOnEnter: true,
            event: "click",
            touch: true,
            callback: function (data) {
                if (data.content) {
                    var id = $(data.$el).data('id');
                    updateCategory(id, data.content, 'Library_category_label');
                    $("#catSelect option[value='" + id + "']").html(data.content);
                }
            }
        });
    }

    categoriesTable = $('#categoriesList').DataTable({
        searching: false,
        info: false,
        paging: false,
        "language": {
            "lengthMenu": "_MENU_"
        },
        columnDefs: [
            { orderable: false, "targets": 0 },
            { orderable: false, "targets": 2 }
        ],
        order: [[ 1, 'asc' ]]
    });

    $('#addNewCatForm').submit(function(){
        addNewCategory();
    });

    $('#show-categories').click(function(){
        $('.category-selection').hide();
        $('.category-edit').fadeIn();
    });

    $('#hide-categories').click(function(){
        $('.category-selection').fadeIn();
        $('.category-edit').hide();
    });

});

function addNewCategory()
{
    if($('#newCat').val() && $('#elementsSelect').val() && $('#tableNameSelect').val())
    {
        var toInsert = {
            Library_category_label: $('#newCat').val(),
            library_category_table_name: $('#tableNameSelect').val(),
            library_category_table_id: $('#elementsSelect').val()
        };
        require(__dirname + '/class/repositories/Librarycategories').insert(toInsert).then(
            (category) =>{
                    /*
                    logThisEvent({
                        log_message: "Ajout de la catégorie " + category.Library_category_label + " au bien " + realty.project_title ,
                        log_action_type: 'add',
                        log_status: true,
                        log_table_name: $('#tableNameSelect').val(),
                        log_table_id: category.id
                    });
                    */
                    let catLisTemplate = $('#catListTpl').html();
                    let tplCat = handlebars.compile(catLisTemplate);

                    let d = category.dataValues;
                    let message = tplCat(d);

                    resetCatDisplaySelection();
                    categoriesTable.row.add($(message)[0]).draw();


                    $('.newLine').editable({
                        closeOnEnter : true,
                        event:"click",
                        touch : true,
                        callback: function(data) {
                            if(data.content)
                            {
                                var id = $(data.$el).data('id');
                                updateCategory(id, data.content, 'Library_category_label');
                                $("#catSelect option[value='" + id+ "']").html(data.content);
                            }
                        }
                    });
                    $('.newLine').removeClass('newLine');
                    $('#catSelect').append('<option value="' + category.id + '">' + category.Library_category_label + '</option>');
                    $('#catSelect').val(category.id);
                    $('#newCat').val('');
                    $(".uploader-zone").show();
                });
    }
    else
    {
        $.notify({
            icon:'fa fa-warning',
            message: 'Il manque des informations'
        },{
            element: '.notify-here',
            z_index: 5000,
            delay: 5000,
            placement: {
                from: 'bottom',
                align: 'center'
            },
            type: 'danger',
            animate: {
                enter: 'animated flipInY',
                exit: 'animated flipOutX'
            }
        });
    }
}

function updateCategory(id, data, field)
{
    require(__dirname + '/class/repositories/Librarycategories').findById(id).then(
        (row) => {
            row[field] = data;
            row.save();
        }
    );
}

function setThisCategory(id)
{
    $('#catSelect').val(id);
    $('.select-cat-icon span').removeClass('text-success');
    $('.select-cat-icon span').removeClass('text-muted');
    $('.select-cat-icon span').addClass('text-muted');
    $('#select-cat-' + id).find('span').addClass('text-success');
    if($('#catSelect').val() && $('#tableNameSelect').val() && $('#elementsSelect').val())
    {
        $(".uploader-zone").show();
    }
}

function resetCatDisplaySelection()
{
    $('.select-cat-icon span').removeClass('text-success');
    $('.select-cat-icon span').removeClass('text-muted');
    $('.select-cat-icon span').addClass('text-muted');
}