var Connection = require('sequelize-connect');
var orm = new Connection();
var Promise = require("bluebird");


class UsersRepository
{
    constructor() {
        this.models = orm.models.Users;
    }

    insert(data){
        return this.models.build(data);
    }

    find(id) {
        return this.models.findById(id);
    }

    findAll() {
        return this.models.findAll();
    }
}

module.exports = new UsersRepository();