module.exports = function (sequelize, DataTypes) {
var Projects = sequelize.define('Projects', {
        project_title: {
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
        project_creation_date: {
            type: DataTypes.DATE
        },
        project_start_build_date: {
            type: DataTypes.DATE
        },
        project_end_build_date: {
            type: DataTypes.DATE
        },
        project_start_diffusion_date: {
            type: DataTypes.DATE
        },
        project_short_description: {
            type: DataTypes.TEXT
        },
        project_long_description: {
            type: DataTypes.TEXT
        },
        project_address: {
            type: DataTypes.TEXT
        },
        project_city: {
            type: DataTypes.TEXT
        },
        project_pc: {
            type: DataTypes.TEXT
        },
        project_country: {
            type: DataTypes.TEXT
        },
        project_active_online: {
            type: DataTypes.BOOLEAN,
            defaultValue: 0,
        },
        project_actual_phase: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        project_lat: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        },
        project_long: {
            type: DataTypes.STRING,
            allowNull: true,
            defaultValue: null
        }
    },
    {
        validate: {
            bothCoordsOrNone() {
                if ((this.latitude === null) !== (this.longitude === null)) {
                    throw new Error('Require either both latitude and longitude or neither')
                }
            }
        },
        timestamp: true,
        logging: console.log,
        classMethods: {
            associate: function(models) {
                Projects.belongsToMany (models.Phases, {through: 'project_phases', foreignKey: 'project_id'});
            }
        }
    });
    return Projects;
};