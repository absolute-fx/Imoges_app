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
    'Projects'
];

models.forEach(function(model) {
    module.exports[model] = sequelize.import(__dirname + '/' + model + '.js');
});
/*
(function(m) {
    m.PhoneNumber.belongsTo(m.User);
    m.Task.belongsTo(m.User);
    m.User.hasMany(m.Task);
    m.User.hasMany(m.PhoneNumber);
})(module.exports);
*/
module.exports.sequelize = sequelize;