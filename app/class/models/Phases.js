module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Phases', {
            title: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    len: {
                        args: [10, 255],
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
                    Phases.belongsToMany (models.Projects, {as: 'Projects', through: 'projets_phases', foreignKey: 'project_id'});
                }
            }
        });
};