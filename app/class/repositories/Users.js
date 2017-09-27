var Connection = require('sequelize-connect');
var orm = new Connection();
var Promise = require("bluebird");
var sha1 = require('sha1');


class UsersRepository
{
    constructor() {
        this.models = orm.models.Users;
    }

    insert(data){
        return this.models.build(data);
    }

    find(id) {
        return this.models.findById(id);
    }

    findAll() {
        return this.models.findAll();
    }

    auth(login, pass) {
        return this.models.findAll({
            where: {
                email: login,
                password: sha1(pass)
            }
        }).then((users) => {
            if (users.length == 1 && users[0].id !== undefined)
            {
                return users[0];
            }
            else
            {
                throw new Exception('Erreur de login/pass');
            }
        });


    }
}

module.exports = new UsersRepository();