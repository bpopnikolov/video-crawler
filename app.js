/* globals process */
const program = require('commander');
const chalk = require('chalk');

const dbController = require('./db/controllers/video');
const {
    youtubeCrawler,
    vboxCrawler,
} = require('./crawlers');
const {
    Video,
    User,
    Source,
} = require('./db/models');


const runAllCrawlers = async (searchWord, pages) => {
    console.log(
        chalk.blue.bold('Runing all crawlers...',
            chalk.red.bold('Searchword:'),
            chalk.yellow.bold(searchWord),
            chalk.red.bold('Pages:'),
            chalk.yellow.bold(pages)),
    );
    console.log();

    let videos = await Promise.all([
        youtubeCrawler
        .getVideosBySearchWord(searchWord, pages),
        vboxCrawler.
        getVideosBySearchWord(searchWord, pages),
    ]);
    // console.log(videos);
    videos = videos.reduce((a, b) => a.concat(b), []);

    console.log(chalk.blue.bold('Adding data to Database...'));

    // console.log(videos);
    const result = await Promise.all(videos.map((video) => {
        console.log(chalk.blue.bold('Adding: '), chalk.yellow.bold(video.name));
        return dbController.saveVideoOrUpdate(video);
    }));

    console.log();
    console.log(chalk.blue.bold('Videos were saved!'));
};

const runVboxCrawler = async (searchWord, pages) => {
    const videos = await vboxCrawler
        .getVideosBySearchWord(searchWord, pages);

    await Promise.all(videos.map(async (video) => {
        return await dbController.saveVideoOrUpdate(video);
    }));
};

const runYoutubeCrawler = async (searchWord, pages) => {
    const videos = await youtubeCrawler
        .getVideosBySearchWord(searchWord, pages);

    await Promise.all(videos.map(async (video) => {
        return await dbController.saveVideoOrUpdate(video);
    }));
};

program
    .version('0.1.0')
    .option('-a, --action <action>', 'the action the be executed')
    .option('-k, --keyword <keyword>', 'keyword to search for')
    .option('-p, --pages <pages>', 'pages to crawl');

program
    .command('start [crawler]')
    .description('starting crawler')
    .action((crawler, otherCrawlers) => {
        crawler = crawler || 'all';

        switch (crawler) {
            case 'all':
                runAllCrawlers(program.keyword, program.pages);
                break;

            case 'youtube':
                runYoutubeCrawler();
                break;

            case 'vbox':
                runVboxCrawler();
                break;

            default:
                runAllCrawlers();
                break;
        }
    });

program.parse(process.argv);
// console.log(program);
// runAllCrawlers();
