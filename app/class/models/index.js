const Sequelize = require('sequelize');
const dbConfig = require(__dirname + '/../../db_login.json');
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

const models = [
    'Projects',
    'Phases'
];

models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model + '.js');
});

(function(m) {
    m.Projects.belongsToMany (m.Phases, {as: 'Phases', through: 'projets_phases', foreignKey: 'phase_id'});
    m.Phases.belongsToMany (m.Projects, {as: 'Projects', through: 'projets_phases', foreignKey: 'project_id'});
})(module.exports);

module.exports.sequelize = sequelize.sync();