class ProjectsRepository
{
    constructor() {
        this.models = require(__dirname + '/../models/index.js').Projects;
    }

    insert(data){
        return this.models.create(data);
    }

    find(id) {
        return this.models.findById(id);
    }

    findAll(args) {
        return this.models.findAll(args);
    }
}

module.exports = new ProjectsRepository();