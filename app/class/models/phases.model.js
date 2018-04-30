module.exports = function (sequelize, DataTypes) {
    var Phases = sequelize.define('Phases', {
            title: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate: {
                    len: {
                        args: [3, 255],
                        msg: 'tooshort_or_toobig'
                    }
                }
            },
        },
        {
            timestamp: true,
            logging: console.log
        });
    Phases.associate = function (models) {
        Phases.belongsToMany (models.Projects, {through: 'project_phases', foreignKey: 'phase_id'});
    };
    return Phases;
};