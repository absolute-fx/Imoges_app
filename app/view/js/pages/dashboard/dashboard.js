const appParamsB = require('electron').remote.getGlobal('appParameters');
const fs = require('fs');

$(document).ready(()=>{
    getProjectsList()
});

// CALL TO SERVICES
function getProjectsList()
{
    require(__dirname + '/class/repositories/Projects').findAll({where: {project_status: 1}}).then((projects) => {
        //console.log(projects);
        //setProjectsBoxes(projects);
    }).catch((error) => {
        alert(error.toString());
    });
    createLibDir();
}


function createLibDir(){
    const rootPath = appParamsB.system.root_path;
    if(!fs.existsSync(rootPath)){
        fs.mkdirSync('C:/Immowaze');
        fs.mkdirSync('C:/Immowaze/demo');
        $('.sync-board').html('Dossier des librairies créé dans: ' + rootPath);
    }
    else{
        $('.sync-board').html('Dossier des librairies existant');
    }
}