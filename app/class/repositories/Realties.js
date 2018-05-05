var Connection = require('sequelize-connect');
var orm = new Connection();
var Promise = require("bluebird");

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

    findById(id) {
        const models = this.realties;
        return new Promise(function(resolve, reject) {
            models.findById(id).then(realty => {
                resolve(realty);
            }).catch(err => {
                reject(err);
            });
        });
    }

    findAll(args) {
        return this.realties.findAll(args);
    }
}

module.exports = new RealtiesRepository();