module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Phases', {
            title: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    len: {
                        args: [10, 255],
                        msg: 'toolong_or_toobig'
                    }
                }
            },
        },
        {
            timestamp: true,
            logging: console.log
        });
};