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

    findById(id) {
        const models = this.libraries;
        return new Promise(function(resolve, reject) {
            models.findById(id).then(library => {
                resolve(library);
            }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = new LibrariesRepository();