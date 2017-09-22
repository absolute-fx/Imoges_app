const Connection = require('sequelize-connect');
const discover = [__dirname + '/models'];
const dbConfig = require(__dirname + '/../db_login.json');

var db =  new Connection(
    dbConfig.db,
    dbConfig.login,
    dbConfig.pass,
    {
        host: dbConfig.host,
        dialect: "mysql",
        port:    3306,
        define: {
            charset: 'utf8',
            collate: 'utf8_general_ci',
        }
    },
    discover,
).then(
    (db) => {
        Object.keys(db.models).forEach(function(modelName) {
            db.models[modelName].options.classMethods.associate(db.models);
        })
    }
);

return db;