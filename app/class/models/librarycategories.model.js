module.exports = function (sequelize, DataTypes) {
    var Librarycategories = sequelize.define('Librarycategories', {
        Library_category_label :{
            type: DataTypes.STRING(100)
        },
        library_category_table_name: {
            type: DataTypes.STRING(30)
        },
        library_category_table_id:{
            type: DataTypes.INTEGER
        },
        library_category_order:{
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    });

    Librarycategories.associate = function (models) {
        Librarycategories.hasMany(models.Libraries);
    };

    return Librarycategories;
};