'use strict';
module.exports = (sequelize, DataTypes) => {
    const Video = sequelize.define('Video', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        duration: {
            type: DataTypes.TIME,
            allowNull: false,
        },
        published: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
            },
        },
        views: {
            type: DataTypes.BIGINT,
            allowNull: false,
            validate: {
                isNumeric: true,
            },
        },
        likes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
            },
        },
        dislikes: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isNumeric: true,
            },
        },
    }, {});
    Video.associate = function(models) {
        // associations can be defined here
        const {
            User,
            Source,
        } = models;

        Video.belongsTo(User, {
            foreignKey: {
                allowNull: false,
            },
            onDelete: 'CASCADE',
        });

        Video.belongsTo(Source, {
            foreignKey: {
                allowNull: false,
            },
            onDelete: 'CASCADE',
        });
    };
    return Video;
};
