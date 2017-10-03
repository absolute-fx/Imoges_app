var Connection = require('sequelize-connect');
var orm = new Connection();

class RealtyRepository
{
    constructor() {
        this.realty = orm.models.Realty;
    }

    insert(data){
        return this.realty.create(data);
    }

    find(id) {
        return this.realty.findById(id);
    }

    findAll(args) {
        return this.realty.findAll(args);
    }
}

module.exports = new RealtyRepository();