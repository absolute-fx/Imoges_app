var appParams = require('electron').remote.getGlobal('appParameters');
//var userData = require('electron').remote.getGlobal('user');
var fs = require('fs');
var notify = require('bootstrap-notify');
var DesktopManagement = require('./view/js/widgets/DesktopManagement').DesktopManagement;
var Jstree = require('jstree');
var categoriesTable;
var uploader;
var parentElement;
var actualTable;
var actualLibraryCategories;
var actualMediaList;

$(document).ready(function(){
    $('.category-edit').hide();
    $(".uploader-zone").hide();
    switch($('#tableNameSelect').val())
    {
        case 'Projects':
            actualTable = 'Projects'
            init();
            break;

        case 'Realties':
            require(__dirname + '/class/repositories/Realties').findById($('#elementsSelect').val()).then(r => {
                r.getProject().then(pr =>{
                    actualTable = 'Realties';
                    parentElement = pr;
                    init();
                });
            });
            break;
    }
});


function init()
{
    uploader = $("#fileUploader").dropzone({
        url: "http://imoges.afxlab.be/upload.php",
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
                        var localDirPath;

                        var logMessage = '';
                        logMessage += 'Upload <strong data-id="' + library.id + '" data-table="Libraries"> ' + file.name;
                        logMessage += '</strong> dans catégorie <strong data-id="' + $('#catSelect').val() + '" data-table="Librarycategories">';
                        logMessage += $('#catSelect :selected').text() + '</strong>';


                        switch(actualTable)
                        {
                            case 'Projects':
                                logMessage += ' du projet ';
                                localDirPath = $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + $('#catSelect :selected').text();
                                break;

                            case 'Realties':
                                logMessage += ' du bien ';
                                localDirPath = parentElement.project_title + '/' + appParams.system.projects_dirs.default.realties + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + $('#catSelect :selected').text();
                                break;
                        }

                        logMessage += '<strong data-id="' + $('#elementsSelect').val() + '" data-table="' + $('#tableNameSelect').val() + '">' + $('#elementsSelect :selected').text() + '</strong>';

                        logThisEvent({
                            log_message: logMessage,
                            log_action_type: 'upload',
                            log_status: true,
                            log_table_name: 'Librarycategories',
                            log_table_id: library.id
                        });

                        // placement du fichier en local
                        fs.createReadStream(file.path).pipe(fs.createWriteStream(appParams.system.root_path + '/' + localDirPath + '/' + file.name));
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

    loadLibraries();
    setDocumentTree();
}


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
                    var elemTitle = $('#elementsSelect').find(':selected').text();
                    var elemId = $('#elementsSelect').val();
                    var logMessage;
                    var isProject = false;

                    switch($('#tableNameSelect').val())
                    {
                        case 'Realties':
                            logMessage = 'Ajout de la catégorie <strong data-id="' + category.id + '" data-table="Librarycategories">' + category.Library_category_label + '</strong> au bien <strong data-id="' + elemId + '" data-table="Realties">' + elemTitle + '</strong>';
                            break;

                        case 'Projects':
                            logMessage = 'Ajout de la catégorie <strong data-id="' + category.id + '" data-table="Librarycategories">' + category.Library_category_label + '</strong> au projet <strong data-id="' + elemId + '" data-table="Projects">' + elemTitle + '</strong>';
                            isProject = true;
                            break;
                    }

                    logThisEvent({
                        log_message: logMessage ,
                        log_action_type: 'add',
                        log_status: true,
                        log_table_name: 'Librarycategories',
                        log_table_id: category.id
                    });

                    // >>> A prooprifier maintenant que le parent est connu avant l'init
                    if(isProject)
                    {
                        DesktopManagement.addDirectory(category.Library_category_label, elemTitle + '/' + appParams.system.projects_dirs.default.libraries);
                    }
                    else
                    {
                        require(__dirname + '/class/repositories/Realties').findById(elemId).then(r => {
                            r.getProject().then(pr =>{
                                DesktopManagement.addDirectory(category.Library_category_label, pr.project_title + '/' + appParams.system.projects_dirs.default.realties + '/' + elemTitle + '/' + appParams.system.projects_dirs.default.libraries);
                            });
                        });
                    }
                    // <<<
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

            var filePathFrom;
            var filePathTo;
            switch (actualTable)
            {
                case 'Projects':
                    filePathFrom = appParams.system.root_path + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + row[field];
                    filePathTo = appParams.system.root_path + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + data;
                    break;

                case 'Realties':
                    filePathFrom = appParams.system.root_path + '/' + parentElement.project_title + '/' + appParams.system.projects_dirs.default.realties + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + row[field];
                    filePathTo = appParams.system.root_path + '/' + parentElement.project_title + '/' + appParams.system.projects_dirs.default.realties + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + '/' + data;
                    break;
            }

            fs.rename(filePathFrom, filePathTo, function (err) {
                if (err)
                {
                    throw err;
                }
                else {
                    fs.stat(filePathTo, function (err, stats) {
                        if (err)
                        {
                            throw err;
                        }
                        else {
                            var storeField = row[field];
                            row[field] = data;
                            row.save().then(cat=>{
                                var logMessage;
                                switch (actualTable)
                                {
                                    case 'Projects':
                                        logMessage = 'La catégorie et le répertoire local <strong>' + storeField + '</strong> du projet <strong>' + $('#elementsSelect :selected').text() + '</strong> a été modifiée en <strong> ' + data + '</strong>';
                                        break;

                                    case 'Realties':
                                        logMessage = 'La catégorie et le répertoire local <strong>' + storeField + '</strong> du bien <strong>' + $('#elementsSelect :selected').text() + '</strong> a été modifiée en <strong> ' + data + '</strong>';
                                        break;
                                }
                                logThisEvent({
                                    log_message: logMessage,
                                    log_action_type: 'update',
                                    log_status: true,
                                    log_table_name: 'Librarycategories',
                                    log_table_id: cat.id
                                });
                            });
                        }
                        console.log('stats: ' + JSON.stringify(stats));
                    });
                }
            });

        }
    );
}

function setThisCategory(id)
{
    $('#catSelect').val(id);
    $('.select-cat-icon span').removeClass('text-success').addClass('text-muted');
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

function loadLibraries()
{
    var request = {where: {library_category_table_name: actualTable, library_category_table_id: $('#elementsSelect').val()}};
    require(__dirname + '/class/repositories/Librarycategories').findAll(request).then(lC => {
        actualLibraryCategories = lC;
        for(var i in lC)
        {
            lC[i].getLibraries().then(media =>{
                actualMediaList = media;
            });
        }
        scanDirs();
    });
}

function scanDirs()
{
    var allExist = true;
    var notExistingDirs = [];
    var pathToDir;
    for(var i in actualLibraryCategories)
    {
        //exist = DesktopManagement.checkIfDirectory(actualTable, actualLibraryCategories[i].Library_category_label, $('#elementsSelect :selected').text());
        switch (actualTable)
        {
            case 'Projects':
                pathToDir = appParams.system.root_path + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + actualLibraryCategories[i].Library_category_label;
                console.log(pathToDir);
                if(!fs.existsSync(pathToDir)){
                    notExistingDirs.push(actualLibraryCategories[i]);
                    allExist = false;
                }
                break;

            case 'Realties':
                pathToDir = appParams.system.root_path + '/' + parentElement.project_title + '/' + appParams.system.projects_dirs.default.realties + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + actualLibraryCategories[i].Library_category_label;
                if(!fs.existsSync(pathToDir)){
                    notExistingDirs.push(actualLibraryCategories[i]);
                    allExist = false;
                }
                break;
        }
    }
    var message = '';
    if(allExist)
    {
        message = '<p><span class="text-success fa fa-check"></span> Les répertoires sont synchronisés avec la base de données</p>';
    }
    else {
        for(var i in notExistingDirs)
        {
            message += '<p><span class="text-secondary fa fa-exclamation-circle"></span> Le répertoire <strong>' + notExistingDirs[i].Library_category_label + '</strong> n\'existait pas et a été créé.</p>';
            switch (actualTable)
            {
                case 'Projects':
                    DesktopManagement.addDirectory(notExistingDirs[i].Library_category_label, $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries);
                    break;

                case 'Realties':
                    DesktopManagement.addDirectory(notExistingDirs[i].Library_category_label, parentElement.project_title + '/' + appParams.system.projects_dirs.default.realties + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries);
                    break;
            }
            //DesktopManagement.addDirectory(notExistingDirs[i].Library_category_label, )
        }
        message += '<p><span class="text-success fa fa-check"></span> Les répertoires sont maintenant synchronisés avec la base de données</p>';
    }
    message += '<hr>';
    $('#dir-checker').html(message);
}

function setDocumentTree()
{
    $("#documents-tree").jstree({
        "core" : {
            "themes" : {
                "responsive": false
            },
            // so that create works
            "check_callback" : true,
            'data': [{
                "text": "Projet 06",
                "state": {"opened": true},
                "children": [{
                    "text": "Catégorie 1",
                    "state": {
                        "opened": false
                    },
                    "children": [
                        {"text": "doc 01", "icon" : "fa fa-file icon-state-warning"}
                    ]
                }, {
                    "text": "Catégorie 2",
                    "icon" : "fa fa-folder icon-state-success",
                    "state": {

                    },
                    "children": [
                        {"text": "doc 01", "icon" : "fa fa-file icon-state-warning"}
                    ]
                }, {
                    "text": "Catégorie 3",
                    "icon": "fa fa-folder icon-state-danger",
                    "children": [
                        {"text": "Item 1", "icon" : "fa fa-file icon-state-warning"},
                        {"text": "Item 2", "icon" : "fa fa-file icon-state-success"},
                        {"text": "Item 3", "icon" : "fa fa-file icon-state-default"},
                        {"text": "Item 4", "icon" : "fa fa-file icon-state-danger"},
                        {"text": "Item 5", "icon" : "fa fa-file icon-state-info"}
                    ]
                }]
            }
            ]
        },
        "types" : {
            "default" : {
                "icon" : "fa fa-folder icon-state-warning icon-lg"
            },
            "file" : {
                "icon" : "fa fa-file icon-state-warning icon-lg"
            }
        },
        "state" : { "key" : "demo2" },
        "plugins" : [ "contextmenu", "dnd", "state", "types" ]
    });
}