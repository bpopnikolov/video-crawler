const {
    Video,
    User,
    Source,
} = require('../models');

module.exports.saveVideoOrUpdate = async (video) => {
    const user = await User.findCreateFind({
        where: {
            name: video.user,
        },
    });

    const source = await Source.findCreateFind({
        where: {
            name: video.source,
        },
    });


    video.user = user[0].id;
    video.source = source[0].id;

    const videoToSave = {
        id: video.id,
        name: video.name,
        url: video.url,
        duration: video.duration,
        published: new Date(video.published),
        views: video.views,
        likes: video.likes,
        dislikes: video.dislikes,
        UserId: video.user,
        SourceId: video.source,
    };

    const foundVideo = await Video.findById(videoToSave.id);

    // Create the video if not found
    if (!foundVideo) {
        const savedVideo = Video.create(videoToSave);
        return savedVideo;
    }

    // if Found Update it
    Video.update(videoToSave, {
        where: {
            id: foundVideo.id,
        },
    });

    return videoToSave;
};
