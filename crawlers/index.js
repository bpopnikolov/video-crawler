/* globals __dirname */
const fs = require('fs');
const path = require('path');

    fs
        .readdirSync(__dirname)
        .filter((file) => file.includes('crawler'))
        .forEach((file) => {
            const fileBaseName = path.basename(file, '.crawler.js')+ 'Crawler';
            const crawlerPath = path.join(__dirname, file);
            module.exports[fileBaseName] = require(crawlerPath);
        });

