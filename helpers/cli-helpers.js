const chalk = require('chalk');


const requiredParamsToStarError = (...params) => {
    console.log();
    if (params.length === 1) {
        console.log(chalk.bgRed.bold(
            'ERROR: Option ' +
            chalk.yellow.bold(`${params[0]}`) +
            ' is required to start the crawler!'
        ));
        console.log();
        return;
    }
    if (params.length > 0) {
        console.log(chalk.bgRed.bold(
            'ERROR: Options ' +
            params.map((param, i) => {
                if (i === params.length - 1) {
                    return chalk.yellow.bold(`and --${param}`);
                } else if (i === params.length - 2) {
                    return chalk.yellow.bold(`--${param}`);
                }
                return chalk.yellow.bold(`--${param},`);
            })
            .join(' ') +
            ' are required to start the crawler!'
        ));
        console.log();
    }
};

const addingDataMsg = () => {
    console.log(chalk `{blue.bold Adding videos to database...}`);
};

const startingCrawlerMsg = (searchWord, pages, ...crawlers) => {
    console.log();
    if (crawlers.length === 1) {
        console.log(
            chalk.blue.bold('Starting ') +
            chalk.yellow.bold(`${crawlers[0]} `) +
            chalk.blue.bold('crawler... ') +
            chalk.red.bold('Searchword: ') +
            chalk.yellow.bold(searchWord) +
            chalk.red.bold(' Pages: ') +
            chalk.yellow.bold(pages));
        console.log();
        return;
    }

    if (crawlers.length > 0) {
        console.log(
            chalk.blue.bold('Starting ') +
            crawlers.map((crawler, i) => {
                if (i === crawlers.length - 1) {
                    return chalk.blue.bold('and ') +
                        chalk.yellow.bold(`${crawler} `) +
                        chalk.blue.bold('crawlers... ');
                } else if (i === crawlers.length - 2) {
                    return chalk.yellow.bold(`${crawler}`);
                }
                return chalk.yellow.bold(`${crawler},`);
            }).join(' ') + chalk.red.bold('Searchword: ') +
            chalk.yellow.bold(searchWord) +
            chalk.red.bold(' Pages: ') +
            chalk.yellow.bold(pages));
        console.log();
    }
};

const videosWereSavedMsg = () => {
    console.log(chalk.blue.bold(
        'Videos were saved ' +
        chalk.green.bold('successfully!')
    ));
};

const processingVideoMsg = (video) => {
    console.log(chalk.blue.bold(
        'Adding: ' +
        chalk.yellow.bold(`${video.name} `) +
        'source: ' +
        chalk.white.dim.bold
        .underline(`${video.source}`)
    ));
};

module.exports = {
    requiredParamsToStarError,
    addingDataMsg,
    startingCrawlerMsg,
    videosWereSavedMsg,
    processingVideoMsg,
};