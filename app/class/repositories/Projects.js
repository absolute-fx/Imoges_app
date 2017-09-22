var Connection = require('sequelize-connect');
var orm = new Connection();

class ProjectsRepository
{
    constructor() {
        this.models = orm.models.Projects;
    }

    insert(data){
        return this.models.build(data);
    }

    find(id) {
        return this.models.findById(id);
    }

    findAll() {
        return this.models.findAll({
            include: [{
                model: orm.models.Phases
            }]
        });
    }

    addPhases(phase) {
        return this.models.addPhases(phase);
    }
}

module.exports = new ProjectsRepository();