/* globals process */
const program = require('commander');


const videoController = require('./db/controllers/video');
const dbController = require('./db/controllers/database');
const {
    cliHelpers,
    statisticsHelpers,
    filterHelpers,
    orderbyHelpers,
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
    await Promise.all(videos.map((video) => {
        cliHelpers.processingVideoMsg(video);
        return videoController.saveVideoOrUpdate(video);
    })).catch((err) => {
        console.log(err);
    });

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
            case 'all':
                runAllCrawlers(cmd.keyword, cmd.pages);
                break;

            default:
                cliHelpers.commandNotSupportedMsg();
                break;
        }
    });

program
    .command('statistics <action> [otherParams...]')
    .description('Get statistics for the crawled videos.')
    .action((action, otherParams, cmd) => {
        switch (action) {
            case 'search':
                statisticsHelpers.searchByWord(otherParams);
                break;
            case 'showUserVideos':
                statisticsHelpers.showUserVideos(otherParams);
                break;
            case 'filter':
                const column = otherParams[0];
                const operator = otherParams[1];
                const value = otherParams[2];
                const filterLimit = +otherParams[3] ||
                    Number.MAX_SAFE_INTEGER;
                filterHelpers
                    .filterVideos(column, operator, value, filterLimit);
                break;
            case 'orderBy':
                const columnName = otherParams[0];
                const orderType = otherParams[1];
                const orderLimit = +otherParams[2] ||
                    Number.MAX_SAFE_INTEGER;
                orderbyHelpers.orderVideosBy(columnName, orderType, orderLimit);
                break;
            default:
                cliHelpers.commandNotSupportedMsg();
                break;
        }
    });

program
    .command('dropdata')
    .description('Search for data with specific fiter')
    .action(() => {
        dbController.dropdb();
    });

program.parse(process.argv);
