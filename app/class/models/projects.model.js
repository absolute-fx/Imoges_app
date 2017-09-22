module.exports = function (sequelize, DataTypes) {
var Projects = sequelize.define('Projects', {
        libelle_projet: {
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
        date_creation_projet: {
            type: DataTypes.DATE
        },
        description_courte_projet: {
            type: DataTypes.TEXT
        },
        description_longue_projet: {
            type: DataTypes.TEXT
        },
        lat_projet: {
            type: DataTypes.FLOAT
        },
        long_projet: {
            type: DataTypes.FLOAT
        }
    },
    {
        timestamp: true,
        logging: console.log,
        classMethods: {
            associate: function(models) {
                Projects.belongsToMany (models.Phases, {through: 'projets_phases', foreignKey: 'phase_id'});
            }
        }
    });
    return Projects;
};