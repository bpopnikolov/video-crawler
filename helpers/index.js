/* globals __dirname */
const fs = require('fs');
const path = require('path');

    fs
        .readdirSync(__dirname)
        .filter((file) => file.includes('helpers'))
        .forEach((file) => {
            const fileBaseName = path.basename(file, '.helpers.js')+ 'Helpers';
            const crawlerPath = path.join(__dirname, file);
            module.exports[fileBaseName] = require(crawlerPath);
        });

