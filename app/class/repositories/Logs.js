var Connection = require('sequelize-connect');
var orm = new Connection();

class LogsRepository
{
    constructor() {
        this.logs = orm.models.Logs;
    }

    insert(data){
        return this.logs.create(data);
    }

    find(id) {
        return this.logs.findById(id);
    }

    findAll(args) {
        return this.logs.findAll(args);
    }
}

module.exports = new LogsRepository();