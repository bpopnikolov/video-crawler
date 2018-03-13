const cliHelpers = require('./cli.helpers');
const userController = require('../db/controllers/user');
const videoController = require('../db/controllers/video');
const sourceController = require('../db/controllers/source');


const searchByWord = async (searchWords) => {
    const users = await userController
        .findUsers(searchWords);
    cliHelpers.resultsTitleMsg('User');
    users.forEach((user, i) => {
        cliHelpers.printName(user, i + 1);
    });

    cliHelpers.resultsTitleMsg('Video');

    const videos = await
    videoController.findVideos(searchWords);
    videos.forEach((video, i) => {
        cliHelpers.printVideoInfo(video, i + 1);
    });

    const sources = await sourceController.findSources(searchWords);
    sources.forEach((source, i) => {
        cliHelpers.resultsTitleMsg('Source');
        cliHelpers.printName(source, i + 1);
    });
};

const showUserVideos = async (searchWords) => {
    const users = await userController
        .findUsers(searchWords);
    // cliHelpers.resultsTitleMsg('Video');

    users.forEach(async (user, i) => {
        const videos = await
        videoController.findAllVideosByUser(user);
        // console.log();
        cliHelpers.printName(user, null, true);

        videos.forEach((video, j) => {
            cliHelpers.printVideoInfo(video, j + 1);
        });
    });

    // users.forEach((user, i) => {
    //     videoController.findAllVideosByUser(user)
    //         .then((videos) => {
    //             cliHelpers.printName(user, i + 1);
    //             videos.forEach((video, j) => {
    //                 cliHelpers.printVideoInfo(video);
    //             });
    //         });
    // });
};

module.exports = {
    searchByWord,
    showUserVideos,
};
