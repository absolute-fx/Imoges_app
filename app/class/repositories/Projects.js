const models = require('../models/index.js').database;

class ProjectsRepository
{
    constructor() {
        this.models = models.Projects;
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