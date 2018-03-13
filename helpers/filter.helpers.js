const cliHelpers = require('./cli.helpers');
const videoController = require('../db/controllers/video');


const filterVideos = async (column, operator, value, limit) => {
    const videos = await videoController.
    findAllVideoByFilter(column, operator, value, limit);

    cliHelpers.resultsTitleMsg('Video');
    videos.forEach((video, i) => {
        cliHelpers.printVideoInfo(video, i + 1);
    });
};


module.exports = {
    filterVideos,
};
