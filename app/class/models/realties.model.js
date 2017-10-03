module.exports = function (sequelize, DataTypes) {
    var Realty = sequelize.define('Realty', {
            realty_title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 255],
                        msg: 'tooshort_or_toobig'
                    }
                }
            },
            realty_project_id: {
                type: DataTypes.INTEGER
            },
            realty_contract_type: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            realty_net_price: {
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [1, 6],
                        msg: 'tooshort_or_toobig'
                    }
                }
            },
            realty_vat: {
                type: DataTypes.INTEGER,
                defaultValue: 21
            },
            realty_short_description: {
                type: DataTypes.STRING,
                validate: {
                    len: {
                        args: [3, 255],
                        msg: 'tooshort_or_toobig'
                    }
                }
            },
            realty_long_description: {
                type: DataTypes.TEXT
            },
            realty_surface: {
                type: DataTypes.FLOAT
            },
            realty_active_online: {
                type: DataTypes.BOOLEAN,
                defaultValue: 1
            },
            realty_status: {
                type: DataTypes.INTEGER,
                defaultValue: 1
            }
        },
        {
            timestamp: true,
            logging: console.log
        });
    return Realty;
};