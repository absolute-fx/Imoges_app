var Connection = require('sequelize-connect');
var orm = new Connection();

class ProjectsRepository
{
    constructor() {
        this.models = orm.models.Projects;
    }

    insert(data){
        return this.models.create(data);
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
}

module.exports = new ProjectsRepository();