module.exports = function (sequelize, DataTypes) {
    var Libraries = sequelize.define('Libraries', {
        library_media_name:{
            type: DataTypes.STRING(100)
        },
        library_media_type:{
            type: DataTypes.STRING(30)
        },
        library_media_extension: {
            type: DataTypes.STRING(5)
        },
        library_media_order: {
            type: DataTypes.INTEGER
        },
        library_media_size: {
            type: DataTypes.FLOAT
        },
        library_media_resource: {
            type: DataTypes.STRING(15)
        },
        library_media_url: {
            type: DataTypes.STRING(150)
        },
        library_media_hash: {
            type: DataTypes.STRING(12)
        }
    },
    {
        timestamp: true,
        logging: console.log
    });

    Libraries.associate = function (models) {
        Libraries.belongsTo(models.Librarycategories);
        Libraries.belongsTo(models.Users);
    };

    return Libraries;
};