module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Projects', {
        libelle_projet: DataTypes.STRING,
        date_creation_projet: DataTypes.DATE,
        description_courte_projet: DataTypes.TEXT,
        description_longue_projet: DataTypes.TEXT,
        lat_projet: DataTypes.FLOAT,
        long_projet: DataTypes.FLOAT
    });
};