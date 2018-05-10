
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
}


