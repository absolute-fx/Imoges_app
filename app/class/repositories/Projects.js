class ProjectsRepository
{
    constructor() {
        this.models = require(__dirname + '/../models/index.js').Projects;
    }

    insert(projectName){
        return this.models.sync().then(() => {
            return this.models.create({
                'libelle_projet': projectName
            });
        }).then((model) => {
            console.log(model)
            return model;
        });
    }
}

module.exports.ProjectsRepository = new ProjectsRepository();