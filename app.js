/* globals process */
const program = require('commander');
const chalk = require('chalk');

const videoController = require('./db/controllers/video');
const {
    cliHelpers,
    statisticsHelpers,
} = require('./helpers');

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
        return videoController.saveVideoOrUpdate(video);
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
        return await videoController.saveVideoOrUpdate(video);
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
        return await videoController.saveVideoOrUpdate(video);
    }));

    cliHelpers.videosWereSavedMsg();
};

program
    .version('0.1.0');

program
    .command('update [crawler]')
    .option('-k, --keyword <keyword>', 'keyword to search for')
    .option('-p, --pages <pages>', 'pages to crawl')
    .description('start all or specific crawler/s')
    .action((crawler, cmd) => {
        crawler = crawler || 'all';

        if (!cmd.keyword || !cmd.pages) {
            cliHelpers.requiredParamsToStarError('keyword', 'pages');
            process.exit(1);
        }

        switch (crawler) {
            case 'youtube':
                runYoutubeCrawler(cmd.keyword, cmd.pages);
                break;

            case 'vbox':
                runVboxCrawler(cmd.keyword, cmd.pages);
                break;

            default:
                runAllCrawlers(cmd.keyword, cmd.pages);
                break;
        }
    });

program
    .command('statistics <action> [searchWords...]')
    .description('Get statistics for the crawled videos.')
    .action((action, searchWords, cmd) => {
        switch (action) {
            case 'search':
                statisticsHelpers.searchByWord(searchWords);
                break;

            default:
                break;
        }
    });

program.parse(process.argv);
