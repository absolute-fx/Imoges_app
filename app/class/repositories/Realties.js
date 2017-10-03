var Connection = require('sequelize-connect');
var orm = new Connection();

class RealtiesRepository
{
    constructor() {
        this.realties = orm.models.Realties;
    }

    insert(data){
        return this.realties.create(data);
    }

    find(id) {
        return this.realties.findById(id);
    }

    findAll(args) {
        return this.realties.findAll(args);
    }
}

module.exports = new RealtiesRepository();