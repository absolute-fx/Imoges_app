const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
const dbConfig = require(__dirname + '/../../db_login.json');
var fs = require('fs');
var path = require('path');
const sequelize = new Sequelize(dbConfig.db, dbConfig.login, dbConfig.pass, {
    host: dbConfig.host,
    dialect: dbConfig.dialect,

    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },

    // SQLite only
});

let db = {};

fs.readdirSync(__dirname).filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== 'index.js');
}).forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
});

/*
(function(m) {
    m.Projects.belongsToMany (m.Phases, {as: 'Phases', through: 'projets_phases', foreignKey: 'phase_id'});
    m.Phases.belongsToMany (m.Projects, {as: 'Projects', through: 'projets_phases', foreignKey: 'project_id'});
})(db);*/

Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
sequelize.authenticate();
module.exports.database = db;
