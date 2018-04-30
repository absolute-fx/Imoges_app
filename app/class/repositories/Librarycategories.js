var Connection = require('sequelize-connect');
var orm = new Connection();
var Promise = require("bluebird");

class LibrarycategoriesRepository
{
    constructor() {
        this.librarycategories = orm.models.Librarycategories;
    }

    insert(data){
        return this.librarycategories.create(data);
    }

    find(id) {
        return this.librarycategories.findById(id);
    }

    findById(id) {
        const models = this.librarycategories;
        return new Promise(function(resolve, reject) {
            models.findById(id).then(category => {
                resolve(category);
            }).catch(err => {
                reject(err);
            });
        });
    }

    findAll(args) {
        return this.librarycategories.findAll(args);
    }
}

module.exports = new LibrarycategoriesRepository();