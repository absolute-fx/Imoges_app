class Acl
{
    constructor()
    {
        this.AclMaster = require('acl');
        this.dbConfig =  require(__dirname + '/../db_login.json');
        this.Sequelize = require('sequelize');
        this.AclSeq = require('acl-sequelize');
        this.init();
    }

    init()
    {
        this.db = new this.Sequelize(
            this.dbConfig.db,
            this.dbConfig.login,
            this.dbConfig.pass,
            {
                host: this.dbConfig.host,
                dialect: "mysql",
                port:    3306,
                dialectOptions: {
                    charset: 'utf8',
                }
            }
        );
        this.acl = new this.AclMaster(new this.AclSeq(this.db, {prefix: 'acl_'}));
        this.setAcl();
    }

    setAcl()
    {
        this.acl.allow([
            {
                roles: ['guest'],
                allows:[
                    {resources: ['Projets', 'Realties'], permissions: 'get'}
                ]
            },
            {
                roles: ['admin'],
                allows: [
                    {resources: ['Projets', 'Realties', 'Parameters', 'Users'], permissions: ['get', 'set', 'delete']}
                ]
            },
            {
                roles: ['superadmin'],
                allows: [
                    {resources: ['Projets', 'Realties', 'Parameters', 'Users'], permissions: '*'}
                ]
            }
        ]);

        this.acl.addUserRoles('Chuck', 'admin');
    }
}

module.exports.Acl = Acl;