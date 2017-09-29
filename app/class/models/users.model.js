module.exports = function (sequelize, DataTypes) {
    var Users = sequelize.define('Users', {
            firstname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [2, 255],
                        msg: 'tooshort_or_toobig'
                    }
                }
            },
            lastname: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [2, 255],
                        msg: 'tooshort_or_toobig'
                    }
                }
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [2, 255],
                        msg: 'tooshort_or_toobig'
                    },
                    isEmail: true
                }
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [2, 255],
                        msg: 'tooshort_or_toobig'
                    }
                }
            },
        },
        {
            timestamp: true,
            logging: console.log,
            classMethods: {
                associate: function(models) {

                }
            }
        });
    return Users;
};