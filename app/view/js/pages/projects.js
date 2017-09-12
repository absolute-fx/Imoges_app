var projects = [
    {id: 1, libelle_projet: 'Résidence Alexandre II', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/project-main-image-web.jpg'},
    {id: 2, libelle_projet: 'Les Demoiselles', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/demoiselles.jpg'},
    {id: 0, libelle_projet: 'Résidence Ines', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/ines.jpg'},
    {id: 3, libelle_projet: 'Résidence O. Strebelle', main_image: 'http://imoges.afxlab.be/mockup/assets/images/temp_projects/strebelle.jpg'}
];
var itemsByline = 3;
var projectsNavigation = [
    {navLabel: 'Projet'},
    {navLabel: 'Biens'},
    {navLabel: 'Clients'},
    {navLabel: 'Partenaires'},
    {navLabel: 'Bibliothèque'},
    {navLabel: 'Factures'},
    {navLabel: 'Support'}
];


$(document).ready(()=>{
    setProjectsBoxes();
});

function setProjectsBoxes() {

    let projectListTemplate = $('#projectListTpl').html();
    let tpl = handlebars.compile(projectListTemplate);
    let projectList = {projectRow: []};
    let row = -1;

    for (let i in projects)
    {
        if( i % itemsByline === 0)
        {
            projectList.projectRow.push({projects: []});
            row ++;
        }
        projectList.projectRow[row].projects.push({
            colSize: (12 / itemsByline),
            projectLabel: projects[i].libelle_projet,
            projectImage: projects[i].main_image,
            id: projects[i].id,
            navigation: projectsNavigation,
        });

        /*
        $(projId).append(setProjectBox(allProjects[i]));
        $('#btn-' + allProjects[i].id).click(function(){
            alert(allProjects[i].libelle_projet);
        });
        */
    }
    console.log(projectList);
    $('#projects-wrapper').html(tpl(projectList));
}