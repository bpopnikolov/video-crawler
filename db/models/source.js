'use strict';
module.exports = (sequelize, DataTypes) => {
    const Source = sequelize.define('Source', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    }, {});
    Source.associate = function(models) {
        // associations can be defined here
    };
    return Source;
};
