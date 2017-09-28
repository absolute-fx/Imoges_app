var Connection = require('sequelize-connect');
var orm = new Connection();
var Promise = require("bluebird");


class ProjectsRepository
{
    constructor() {
        this.models = orm.models.Projects;
    }

    insert(data){
        return this.models.build(data);
    }

    find(id) {
        const models = this.models;
        return new Promise(function(resolve, reject) {
            var projectArray = {};
            models.findById(id).then(project => {
                projectArray = project.dataValues;
                project.getPhases().then(phases => {
                    projectArray.Phases = phases;
                    resolve(projectArray);
                }).catch(err => {
                    reject(err);
                });
            }).catch(err => {
                reject(err);
            });
        });
    }

    findById(id) {
        const models = this.models;
        return new Promise(function(resolve, reject) {
            models.findById(id).then(project => {
                resolve(project);
            }).catch(err => {
                reject(err);
            });
        });
    }

    findAll() {
        return this.models.findAll({
            include: [{
                model: orm.models.Phases
            }]
        });
    }

    addPhases(phase) {
        return this.models.addPhases(phase);
    }
}

module.exports = new ProjectsRepository();