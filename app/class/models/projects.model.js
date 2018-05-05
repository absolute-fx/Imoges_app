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
        project_type: {
            type: DataTypes.INTEGER
        },
        project_facade_number: {
            type: DataTypes.INTEGER
        },
        project_cadastral_income: {
            type: DataTypes.DECIMAL(5,2)
        },
        project_charges: {
            type: DataTypes.DECIMAL(5,2)
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
            defaultValue: 0
        },
        project_actual_phase: {
            type: DataTypes.INTEGER,
            defaultValue: 0
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
        },
        project_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        project_environment_type: {
            type: DataTypes.STRING(2)
        },
        project_terrain_size: {
            type: DataTypes.INTEGER
        },
        project_parking_in_number: {
            type: DataTypes.INTEGER
        },
        project_parking_out_number: {
            type: DataTypes.INTEGER
        },
        project_floor_number: {
            type: DataTypes.INTEGER
        },
        project_handicapped_access: {
            type: DataTypes.BOOLEAN
        },
        project_lift: {
            type: DataTypes.BOOLEAN
        },
        project_concierge: {
            type: DataTypes.BOOLEAN
        },
        project_peb: {
            type: DataTypes.INTEGER
        },
        project_heating_type: {
            type: DataTypes.STRING(1)
        },
        project_energy_consumption: {
            type: DataTypes.DECIMAL(4,2)
        },
        project_CO2_emission: {
            type: DataTypes.DECIMAL(4,2)
        },
        project_air_conditioning: {
            type: DataTypes.BOOLEAN
        },
        project_heat_pump: {
            type: DataTypes.BOOLEAN
        },
        project_double_glazing: {
            type: DataTypes.BOOLEAN
        },
        project_PV: {
            type: DataTypes.BOOLEAN
        },
        project_distance_schools: {
            type: DataTypes.INTEGER
        },
        project_distance_shops: {
            type: DataTypes.INTEGER
        },
        project_distance_transports: {
            type: DataTypes.INTEGER
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
    });
    
    Projects.associate = function (models) {
        Projects.belongsToMany (models.Phases, {through: 'project_phases', foreignKey: 'project_id'});
        Projects.hasMany(models.Realties);
    };
    
    return Projects;
};