'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Videos", deps: []
 *
 **/

var info = {
    "revision": 1,
    "name": "video-init",
    "created": "2018-03-07T14:21:17.975Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "Videos",
        {
            "id": {
                "type": Sequelize.STRING,
                "allowNull": false,
                "primaryKey": true
            },
            "name": {
                "type": Sequelize.STRING,
                "allowNull": false
            },
            "url": {
                "type": Sequelize.STRING,
                "unique": true,
                "allowNull": false
            },
            "duration": {
                "type": Sequelize.TIME,
                "allowNull": false
            },
            "published": {
                "type": Sequelize.DATE,
                "validate": {
                    "isDate": true
                },
                "allowNull": false
            },
            "views": {
                "type": Sequelize.BIGINT,
                "validate": {
                    "isNumeric": true
                },
                "allowNull": false
            },
            "likes": {
                "type": Sequelize.INTEGER,
                "validate": {
                    "isNumeric": true
                },
                "allowNull": false
            },
            "dislikes": {
                "type": Sequelize.INTEGER,
                "validate": {
                    "isNumeric": true
                },
                "allowNull": false
            },
            "createdAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            },
            "updatedAt": {
                "type": Sequelize.DATE,
                "allowNull": false
            }
        },
        {}
    ]
}];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
