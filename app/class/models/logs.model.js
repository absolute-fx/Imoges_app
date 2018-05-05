module.exports = function (sequelize, DataTypes) {
    var Logs = sequelize.define('Logs', {
            log_message:{
                type: DataTypes.TEXT
            },
            log_action_type:{
                type: DataTypes.STRING(20)
            },
            log_error_message:{
                type: DataTypes.TEXT
            },
            log_status:{
                type: DataTypes.BOOLEAN,
                defaultValue: true
            },
            log_table_name:{
                type: DataTypes.STRING(20)
            },
            log_table_id:{
                type: DataTypes.INTEGER
            },
            log_user_name:{
                type: DataTypes.STRING(50)
            }
        },
        {
            timestamp: true,
            logging: console.log
        });

    Logs.associate = function (models) {
        //Libraries.belongsTo(models.Librarycategories);
        Logs.belongsTo(models.Users);
    };

    return Logs;
};