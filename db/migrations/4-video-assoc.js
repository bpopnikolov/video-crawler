'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "SourceId" to table "Videos"
 * addColumn "UserId" to table "Videos"
 *
 **/

var info = {
    "revision": 4,
    "name": "video-assoc",
    "created": "2018-03-07T14:23:24.237Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "Videos",
            "SourceId",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "Sources",
                    "key": "id"
                },
                "allowNull": false
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "Videos",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "onUpdate": "CASCADE",
                "onDelete": "CASCADE",
                "references": {
                    "model": "Users",
                    "key": "id"
                },
                "allowNull": false
            }
        ]
    }
];

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
