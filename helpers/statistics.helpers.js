const cliHelpers = require('./cli.helpers');
const userController = require('../db/controllers/user');
const videoController = require('../db/controllers/video');


const searchByWord = async (searchWords) => {
    const users = await userController
        .findUsers(searchWords);
    cliHelpers.resultsTitleMsg('User');
    users.forEach((user) => {
        console.log(user.name);
    });
    cliHelpers.resultsTitleMsg('Video');
    const videos = await
    videoController.findVideos(searchWords);
    videos.forEach((video) => {
        cliHelpers.printVideoInfo(video);
    });
};

searchByWord(['azis', 'diapason records']);
module.exports = {
    searchByWord,
};
