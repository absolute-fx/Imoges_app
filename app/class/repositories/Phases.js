class PhasesRepository
{
    constructor() {
        this.phases = require(__dirname + '/../models/index.js').Phases;
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