var Connection = require('sequelize-connect');
var orm = new Connection();

class LibrariesRepository
{
    constructor() {
        this.libraries = orm.models.Libraries;
    }

    insert(data){
        return this.libraries.create(data);
    }

    find(id) {
        return this.libraries.findById(id);
    }

    findAll(args) {
        return this.libraries.findAll(args);
    }
}

module.exports = new LibrariesRepository();