class ProjectsRepository
{
    constructor() {
        this.models = require(__dirname + '/../models/index.js').Projects;
    }

    insert(projectName){
        this.models.sync().then(() => {
            return this.models.create({
                'libelle_projet': projectName
            });
        }).then(() => {return true;});
    }
}

module.exports.ProjectsRepository = new ProjectsRepository();