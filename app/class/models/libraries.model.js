module.exports = function (sequelize, DataTypes) {
    var Libraries = sequelize.define('Libraries', {
        library_parent_id: {
            type: DataTypes.INTEGER
        },
        library_cat: {
            type: DataTypes.INTEGER
        },
        library_media_cat: {
            type: DataTypes.INTEGER
        },
        library_media_name:{
            type: DataTypes.STRING(50)
        },
        library_media_link:{
            type: DataTypes.TEXT
        },
        library_media_extension:{
            type: DataTypes.STRING(4)
        },
        library_media_order: {
            type: DataTypes.INTEGER
        },
        library_media_size: {
            type: DataTypes.FLOAT
        }
    },
    {
        timestamp: true,
        logging: console.log,
        classMethods: {
            associate: function(models) {

            }
        }
    });
    return Libraries;
};