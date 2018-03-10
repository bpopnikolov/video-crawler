/* globals process */
const program = require('commander');
const chalk = require('chalk');

const dbController = require('./db/controllers/video');
const cliHelpers = require('./helpers/cli-helpers');
const {
    youtubeCrawler,
    vboxCrawler,
} = require('./crawlers');

const runAllCrawlers = async (searchWord, pages) => {
    cliHelpers.startingCrawlerMsg(searchWord, pages, 'youtube', 'vbox');

    let videos = await Promise.all([
        youtubeCrawler
        .getVideosBySearchWord(searchWord, pages),
        vboxCrawler.
        getVideosBySearchWord(searchWord, pages),
    ]);
    // console.log(videos);
    videos = videos.reduce((a, b) => a.concat(b), []);

    cliHelpers.addingDataMsg();

    // console.log(videos);
    const result = await Promise.all(videos.map((video) => {
        cliHelpers.processingVideoMsg(video);
        return dbController.saveVideoOrUpdate(video);
    }));

    cliHelpers.videosWereSavedMsg();
};

const runVboxCrawler = async (searchWord, pages) => {
    cliHelpers.startingCrawlerMsg(searchWord, pages, 'vbox');

    const videos = await vboxCrawler
        .getVideosBySearchWord(searchWord, pages);

    cliHelpers.addingDataMsg();

    await Promise.all(videos.map(async (video) => {
        cliHelpers.processingVideoMsg(video);
        return await dbController.saveVideoOrUpdate(video);
    }));
    cliHelpers.videosWereSavedMsg();
};

const runYoutubeCrawler = async (searchWord, pages) => {
    cliHelpers.startingCrawlerMsg(searchWord, pages, 'youtube');

    const videos = await youtubeCrawler
        .getVideosBySearchWord(searchWord, pages);

    cliHelpers.addingDataMsg();

    await Promise.all(videos.map(async (video) => {
        cliHelpers.processingVideoMsg(video);
        return await dbController.saveVideoOrUpdate(video);
    }));

    cliHelpers.videosWereSavedMsg();
};

program
    .version('0.1.0')
    .option('-k, --keyword <keyword>', 'keyword to search for')
    .option('-p, --pages <pages>', 'pages to crawl');

program
    .command('start [crawler]')
    .description('start all or specific crawler/s')
    .action((crawler, otherCrawlers) => {
        crawler = crawler || 'all';

        if (!program.keyword || !program.pages) {
            cliHelpers.requiredParamsToStarError('keyword', 'pages');
            process.exit(1);
        }

        switch (crawler) {
            case 'all':
                runAllCrawlers(program.keyword, program.pages);
                break;

            case 'youtube':
                runYoutubeCrawler(program.keyword, program.pages);
                break;

            case 'vbox':
                runVboxCrawler(program.keyword, program.pages);
                break;

            default:
                runAllCrawlers(program.keyword, program.pages);
                break;
        }
    });

program.parse(process.argv);
// console.log(program);
// runAllCrawlers();
