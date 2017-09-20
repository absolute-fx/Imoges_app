class ProjectsRepository
{
    constructor() {
        this.models = require(__dirname + '/../models/index.js').Projects;
    }

    insert(data){
        return this.models.sync().then(() => {
            return this.models.create(data);
        });
    }
}

module.exports = new ProjectsRepository();