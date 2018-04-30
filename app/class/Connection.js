const Connection = require('sequelize-connect');
const discover = [__dirname + '/models'];
const dbConfig = require(__dirname + '/../db_login.json');

module.exports =  new Connection(
    dbConfig.db,
    dbConfig.login,
    dbConfig.pass,
    {
        host: dbConfig.host,
        dialect: "mysql",
        port:    3306,
        dialectOptions: {
            charset: 'utf8',
        }
    },
    discover
);