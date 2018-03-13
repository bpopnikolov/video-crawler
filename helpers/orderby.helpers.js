const cliHelpers = require('./cli.helpers');
const videoController = require('../db/controllers/video');

const orderVideosBy = async (columnName, orderType, limit) => {
    const videos = await videoController
        .findAllVideosOrderedBy(columnName, orderType, limit);

    cliHelpers.resultsTitleMsg('Video');
    videos.forEach((video, i) => {
        cliHelpers.printVideoInfo(video, i + 1);
    });
};

// orderVideosBy('dislikes', 'min');

module.exports = {
    orderVideosBy,
};
