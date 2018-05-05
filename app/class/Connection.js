const SqlizeConnection = require('sequelize-connect');
const Promise = require("bluebird");
const discover = [__dirname + '/models'];
const dbConfig = require(__dirname + '/../db_login.json');
//require('sqlite3');

class Connection{
    static setConnection()
    {
        return new Promise((resolve, reject) => {
            new SqlizeConnection(
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
            ).then(instance =>{
                resolve(true);
            });
        });
    }
}

module.exports = Connection;