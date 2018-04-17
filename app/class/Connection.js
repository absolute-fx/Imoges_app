const Connection = require('sequelize-connect');
const discover = [__dirname + '/models'];
const dbConfig = require(__dirname + '/../db_login.json');
//require('sqlite3');

module.exports =  new Connection(
    dbConfig.db,
    dbConfig.login,
    dbConfig.pass,
    {
        host: dbConfig.host,
        dialect: "mysql",
        //port:    3306,
        dialectOptions: {
            charset: 'utf8',
        },
    },
    discover
).then(
    (db) => {
        Object.keys(db.models).forEach(function(modelName) {
            db.models[modelName].options.classMethods.associate(db.models);
        });
        db.sequelize.sync();
    });