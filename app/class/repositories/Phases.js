var Connection = require('sequelize-connect');
var orm = new Connection();

class PhasesRepository
{
    constructor() {
        this.phases = orm.models.Phases;
    }

    insert(data){
        return this.phases.create(data);
    }

    find(id) {
        return this.phases.findById(id);
    }

    findAll(args) {
        return this.phases.findAll(args);
    }
}

module.exports = new PhasesRepository();