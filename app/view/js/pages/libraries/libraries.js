var appParams = require('electron').remote.getGlobal('appParameters');
var Op = require('sequelize').Op;
var Shuffle = require('shufflejs');
var preloader = require('preloader');
var {shell} = require('electron');
var fs = require('fs');
//var ImageResize = require('node-image-resize');
//var iM = require('imagemagick');
//var sharp = require('sharp');
var electronImageResize = require('electron-image-resize');


var notify = require('bootstrap-notify');
var DesktopManagement = require('./view/js/widgets/DesktopManagement').DesktopManagement;
var Jstree = require('jstree');
var categoriesTable;
var uploader;
var parentElement;
var actualTable;
var actualLibraryCategories;
var projectFullLibrary = [];
var jst_instance;

$(document).ready(function(){
    $('.category-edit').hide();
    $(".uploader-zone").hide();

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        switch(e.target.hash)
        {
            case '#library-documents':
                initDocumentList();
                break;

            case '#library-images':

                if(jst_instance)
                {
                    jst_instance.jstree('destroy').empty();
                }
                initImageList();
                break;

        }
    });

    $('a[data-toggle="tab"]').on('hidden.bs.tab', function (e) {
        switch(e.target.hash)
        {
            case '#library-documents':
                break;

            case '#library-images':
                $('#gallery-wrapper').html('');
                break;

        }
    });

    switch($('#tableNameSelect').val())
    {
        case 'Projects':
            actualTable = 'Projects';
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
        url: appParams.system.upload_path,
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

                        let destFullPath = appParams.system.root_path + '/' + localDirPath;
                        saveFileToDisk(file, destFullPath).then((f)=>{
                            if(f.type === 'image/jpeg') resizeImage(file, destFullPath);
                        }).catch((err)=>{
                            // prob à l'écriture du fichier
                        });
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

    loadCategories();
    //setDocumentTree();
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

function loadCategories()
{
    var request = {where: {library_category_table_name: actualTable, library_category_table_id: $('#elementsSelect').val()}};
    require(__dirname + '/class/repositories/Librarycategories').findAll(request).then(lC => {
        actualLibraryCategories = lC;
        console.log(projectFullLibrary);
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
                //console.log(pathToDir);
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

// Liste des documents
function initDocumentList()
{
    //console.log(require(__dirname + '/class/repositories/Libraries'));

    var request = {
        where: {
            library_category_table_name: actualTable,
            library_category_table_id: $('#elementsSelect').val()},
        include:[
            {
                model: require(__dirname + '/class/repositories/Libraries').libraries,
                where: {library_media_type: {[Op.ne]: "image/jpeg"}}
            }
        ]
    };
    require(__dirname + '/class/repositories/Librarycategories').findAll(request).then(lC => {
        console.log(lC);
        setDocumentTree(lC)
    });
}

function setDocumentTree(lC)
{
    var categories = [];
    for(var i in lC)
    {
        categories.push({id: 'cat_' + lC[i].id, text: lC[i].Library_category_label, type: 'category', data:{id: lC[i].id}, children: []});
        console.log(lC[i]);
        for(var u in lC[i].Libraries)
        {
            categories[i].children.push({text: lC[i].Libraries[u].library_media_name, type: 'file', id: lC[i].Libraries[u].id, data: {category_name: lC[i].Library_category_label}});
        }
    }

    console.log(categories);

    jst_instance = $("#documents-tree").jstree({
        "core": {
            "themes":{
                "responsive": false
            },
            "check_callback" : function(operation, node, node_parent, node_position, more)
            {
                if (operation === 'move_node') {
                    if (node_parent.type === 'category')
                    {
                        return true;
                    } else return false;
                }

            },
            "data":[{
                "text": $('#elementsSelect :selected').text(),
                "sort": true,
                "type":"root",
                "state": {opened: true},
                "children": categories
            }]
        },
        "types":{
            "category": {"icon": 'fa fa-folder icon-state-warning icon-lg', valid_children: ["file"]},
            "file": {"icon": 'fa fa-file-o icon-state-warning icon-lg', valid_children: []},
            "root": {"icon":'fa fa-archive icon-lg', valid_children: []},
            "realty": {"icon": 'fa fa-home'}
        },
        "state":{},
        "dnd": {
            "is_draggable": (node)=>{
                if (node[0].type != 'file')
                {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
        "contextmenu": {
            "items" : customMenu
        },
        "plugins":['types', 'dnd', 'contextmenu'],
        "sort": (a, b)=>{
           //return -1;
        }
    }).bind("move_node.jstree", function(e, data)
    {
        console.log(data);
        var oldCatName = data.new_instance._model.data[data.old_parent].text;
        var newCatName = data.new_instance._model.data[data.parent].text;
        var newCatId = data.new_instance._model.data[data.parent].data.id;
        var fileName = data.node.text;
        var fileId = data.node.id;
        changeFileCategory(fileName, fileId, newCatName, newCatId, oldCatName);
        //console.log("fichier " + fileName +  "- id: " + fileId + " dans la catégorie " + newCatName + " id: " + newCatId);
    });
}

function changeFileCategory(f_n, f_i, c_n, c_i, oc_n)
{
    require(__dirname + '/class/repositories/Libraries').findById(f_i).then(
        (library) => {
            library.LibrarycategoryId = c_i;
            library.save().then((library)=>{

                var originPath;
                var destinationPath;
                switch(actualTable)
                {
                    case 'Projects':
                        originPath = appParams.system.root_path + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + oc_n + '/' + f_n;
                        destinationPath = appParams.system.root_path + '/' + $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + c_n + '/' + f_n;
                        break;

                    case 'Realties':
                        originPath = appParams.system.root_path + '/' + parentElement.project_title + '/' + appParams.system.projects_dirs.default.realties + '/'+ $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + oc_n + '/' + f_n;
                        destinationPath = appParams.system.root_path + '/' + parentElement.project_title + '/' + appParams.system.projects_dirs.default.realties + '/'+ $('#elementsSelect :selected').text() + '/' + appParams.system.projects_dirs.default.libraries + '/' + c_n + '/' + f_n;
                        break;
                }

                fs.rename(originPath, destinationPath, (err) => {
                    if (err)
                    {
                        // log erreur
                    }
                    else {
                        console.log('Rename complete!');
                        logThisEvent({
                            log_message: 'Le fichier <strong data-id="' + f_i + '" data-table="Libraries" >' + f_n + '</strong> a été déplacé vers <strong data-id="' + c_i + '" data-table="Librarycategories">' + c_n + '</strong>',
                            log_action_type: 'update',
                            log_status: true,
                            log_table_name: 'Libraries',
                            log_table_id: library.id
                        });
                    }
                });
            });
        });
}

function customMenu(node)
{
    var items;

    if (node.type === 'file') {
        items = {
            'item1' : {
                'label' : 'Ouvrir le fichier',
                icon: 'fa fa-folder-open-o',
                'action' : function (obj) {
                    var inst = $.jstree.reference(obj.reference);
                    var object = inst.get_node(obj.reference);
                    console.log(object);

                    shell.openExternal(getPathToLibrary(object.text, object.data.category_name));
                }
            },
            'item8' : {
                'label' : 'Ouvrir l\'emplacement du fichier',
                icon: 'fa fa-folder-o',
                'action' : function (obj) {
                    var inst = $.jstree.reference(obj.reference);
                    var object = inst.get_node(obj.reference);
                    console.log(object);
                    shell.showItemInFolder(getPathToLibrary(object.text, object.data.category_name));
                }
            },
            'item3' : {
                'label' : 'Visible par',
                icon: 'fa fa-eye',
                submenu:{
                    'item4':{
                        label: 'Tout le monde',
                        icon: 'fa fa-check',
                        'action' : function () { /* action */ }
                    },
                    'item5':{
                        label: 'Les clients',
                        'action' : function () { /* action */ }
                    },
                    'item7':{
                        label: 'Les partenaires',
                        'action' : function () { /* action */ }
                    },
                    'item6':{
                        label: 'Les administrateurs',
                        'action' : function () { /* action */ }
                    }
                }
            },
            'item2' : {
                'label' : 'Supprimer le fichier',
                icon: 'fa fa-trash-o',
                'action' : function (obj){

                }
            }
        };
    }
    else if(node.type === 'category')
    {
        items = {
            'item1' : {
                'label' : 'Ouvrir l\'emplacement du dossier',
                icon: 'fa fa-folder-o',
                'action' : function () { /* action */ }
            },
            'item3' : {
                'label' : 'Visible par',
                icon: 'fa fa-eye',
                submenu:{
                    'item4':{
                        label: 'Tout le monde',
                        icon: 'fa fa-check',
                        'action' : function () { /* action */ }
                    },
                    'item5':{
                        label: 'Les clients',
                        'action' : function () { /* action */ }
                    },
                    'item6':{
                        label: 'Les administrateurs',
                        'action' : function () { /* action */ }
                    }
                }
            },
            'item2' : {
                'label' : 'Supprimer le dossier',
                icon: 'fa fa-trash-o',
                'action' : function () { /* action */ }
            }
        };
    }

    return items;
}

// Liste des images
function initImageList()
{
    var request = {
        where: {
            library_category_table_name: actualTable,
            library_category_table_id: $('#elementsSelect').val()},
        include:[
            {
                model: require(__dirname + '/class/repositories/Libraries').libraries,
                where: {library_media_type: "image/jpeg"}
            }
        ]
    };
    require(__dirname + '/class/repositories/Librarycategories').findAll(request).then(lC => {
        //setImageGallery(lC);
        preloadImages(lC);
    });
}

function preloadImages(library)
{
    var loadingBar = '<span class="fa fa-cog fa-spin"></span>';


    var loader = preloader({xhrImages: false});
    let libraryList = {cat_galleries: library};
    let count = 0;
    //let r = /.jpg/i;

    for(var i in libraryList.cat_galleries)
    {
        for(var u in libraryList.cat_galleries[i].Libraries)
        {
            libraryList.cat_galleries[i].Libraries[u]['path'] = getPathToLibrary(libraryList.cat_galleries[i].Libraries[u].library_media_name, libraryList.cat_galleries[i].Library_category_label);
            let r = /.jpg/i;
            libraryList.cat_galleries[i].Libraries[u]['thumb_path'] = libraryList.cat_galleries[i].Libraries[u]['path'].replace(r, appParams.libraries.images.thumb.suffix + '.jpg');
            loader.addImage(libraryList.cat_galleries[i].Libraries[u]['thumb_path']);
            //console.log(libraryList.cat_galleries[i].Libraries[u]['path'].replace(r, '_thumb.jpg'));
            count++;
        }
    }

    if(count > 0)
    {
        $('#gallery-wrapper').html(loadingBar);
        loader.on('complete',function() {
            console.log('all content loaded!');
            setImageGallery(libraryList);
        });

        loader.on('progress',function(progress) {
            console.log(progress);
            //$('#progress-pc-txt').html(precisionRound(progress*100, 1) + '%');
            //$('#progress-pc-bar').css("width", precisionRound((progress*100), 1) + '%').attr("aria-valuenow", (progress*100));
        });

        loader.load();
    }
    else {
        $('#gallery-wrapper').html("Aucune image actuellement");
    }
}

function setImageGallery(libraryList)
{
    let imagestListTemplate = $('#imagesGallery').html();
    let tpl = handlebars.compile(imagestListTemplate);
    $('#gallery-wrapper').html(tpl(libraryList));

    var grid = $('.gallery');

    var shuffleInstance = new Shuffle(grid, {
        itemSelector: '.item-wrapper' // the selector for the items in the grid
    });

    $('#galleryfilter button').click(function (e) {
        e.preventDefault();
        // set active class
        $('#galleryfilter button').removeClass('active');
        $(this).addClass('active');
        // get group name from clicked item
        var groupName = $(this).attr('data-group');
        // reshuffle grid
        shuffleInstance.filter(groupName );
    });

    console.log(libraryList);
}

// tools

function getPathToLibrary(file, catName)
{
    let root = appParams.system.root_path;
    let type = $('#tableNameSelect').val();
    let elementsSelect = $('#elementsSelect :selected').text();
    let path;

    switch (type)
    {
        case 'Projects':
            path = root + '/' + elementsSelect + '/' + appParams.system.projects_dirs.default.libraries + '/' + catName + '/' + file;
            break;

        case 'Realties':
            path = root + '/' + parentElement.project_title + '/' + appParams.system.projects_dirs.default.realties + '/' + elementsSelect + '/' + appParams.system.projects_dirs.default.libraries + '/' +  catName + '/' +  file;
            break;
    }
    console.log(path);
    return path;
}

function saveFileToDisk(f, destination)
{
    let file;
    return new Promise((resolve, reject)=>{
        file = fs.createReadStream(f.path).pipe(fs.createWriteStream(destination + '/' + f.name));
        file.on("finish", ()=>{
            resolve(f);
        });
        file.on("error", ()=>{
            reject();
        });
    });
}

function resizeImage(f, destination)
{
    let isLandscape = (f.width > f.height);
    let delay = precisionRound((f.size /1000) * appParams.system.resize_img_delay_ratio, -1);
    let imageDataThumb = {url: 'file://' + f.path, delay: delay};
    let imageDataWeb = imageDataThumb;
    console.log(f);
    if(isLandscape)
    {
        imageDataThumb.width = appParams.libraries.images.thumb.width;
        imageDataWeb.width = appParams.libraries.images.web_default.width;
    }
    else{
        imageDataThumb.height = appParams.libraries.images.thumb.height;
        imageDataWeb.height = appParams.libraries.images.web_default.height;
    }

    let r = /.jpg/i;
    let thumbImageName = f.name.replace(r, appParams.libraries.images.thumb.suffix + '.jpg');
    let webImageName = f.name.replace(r, appParams.libraries.images.web_default.suffix + '.jpg');

    // THUMB
    electronImageResize(imageDataThumb).then(img => {
        fs.writeFileSync(destination + '/' + thumbImageName, img.toPng());
    });
    // WEB
    electronImageResize(imageDataWeb).then(img => {
        fs.writeFileSync(destination + '/' + webImageName, img.toPng());
    });
}

function precisionRound(number, precision) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}
