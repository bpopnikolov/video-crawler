/* globals Set */
const {
    Video,
    User,
    Source,
} = require('../models');


const saveVideoOrUpdate = async (video) => {
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

    // const foundVideo = await Video.findById(videoToSave.id);

    // // Create the video if not found
    // console.log(foundVideo);
    // if (typeof foundVideo.name === 'undefined' || !foundVideo) {

    //     const savedVideo = Video.create(videoToSave);
    //     return savedVideo;
    // }

    await Video.findCreateFind({
        where: videoToSave,
    }).spread((status, created) => {
        if (!created) {
            Video.update(videoToSave, {
                where: {
                    id: videoToSave.id,
                },
            });
        }
    });

    return videoToSave;
};

const findVideos = async (searchWords) => {
    searchWords = searchWords.map((word) => {
        return {
            $like: `%${word}%`,
        };
    });

    const videos = await Video.findAll({
        where: {
            name: {
                $or: searchWords,
            },
        },
        include: [{
            model: User,
            // where: {
            //     name: {
            //         $or: searchWords,
            //     },
            // },
        }, {
            model: Source,
            // where: {
            //     name: {
            //         $or: searchWords,
            //     },
            // },
        }],
        order: [
            ['views', 'DESC'],
        ],
    });

    return videos;
};

const findAllVideosByUser = async (user) => {
    const userId = {
        $like: `%${user.id}%`,
    };

    const videos = await Video.findAll({
        where: {
            UserId: userId,
        },
        include: [{
            model: Source,
        }],
        order: [
            ['views', 'DESC'],
        ],
    });

    return videos;
};


const getOperator = (operator, value) => {
    switch (operator) {
        case 'gt':
            operator = {
                $gt: value,
            };
            break;
        case 'gte':
            operator = {
                $gte: value,
            };
            break;
        case 'lt':
            operator = {
                $lt: value,
            };
            break;
        case 'lte':
            operator = {
                $lte: value,
            };
            break;
        case 'eq':
            operator = {
                $eq: value,
            };
            break;
        case 'ne':
            operator = {
                $ne: value,
            };
            break;
        case 'like':
            operator = {
                $like: `%${value}%`,
            };
            break;
        default:
            break;
    }

    return operator;
};

const findAllVideoByFilter = async (column, operator, value, limit) => {
    operator = getOperator(operator, value);

    switch (column) {
        case 'name':
            column = {
                name: operator,
            };
            break;

        case 'views':
            column = {
                views: operator,
            };
            break;
        case 'likes':
            column = {
                likes: operator,
            };
            break;
        case 'dislikes':
            column = {
                dislikes: operator,
            };
            break;
        case 'url':
            column = {
                url: operator,
            };
            break;
        case 'published':
            column = {
                published: operator,
            };
            break;
        default:
            column = null;
            break;
    }

    let videos = [];

    if (column) {
        videos = await Video.findAll({
            where: column,
            limit: limit,
        });
        return videos;
    }
    return videos;
};

const genereColumnNameObject = (name, value) => {
    let obj = {};

    switch (name) {
        case 'likes':
            obj = {
                likes: value,
            };
            break;
        case 'dislikes':
            obj = {
                dislikes: value,
            };
            break;
        case 'views':
            obj = {
                views: value,
            };
            break;

        default:
            obj = {};
            break;
    }

    return obj;
};

const findAllVideosOrderedBy = async (columnName, orderType, limit) => {
    // orderType = orderType.toUpperCase();
    const validColumns = new Set([
        'name', 'views', 'likes', 'dislikes', 'published',
    ]);
    const orderTypes = new Set([
        'ASC', 'DESC',
    ]);
    let order = [];

    if (validColumns.has(columnName) && orderTypes.has(orderType)) {
        order = [columnName, orderType];
    }

    let videos = [];
    if (orderType === 'max') {
        const maxValue = await Video.max(columnName);
        const column = genereColumnNameObject(columnName, maxValue);

        if (Object.keys(column).length > 0) {
            const video = await Video.findOne({
                where: column,
                limit: limit,
            });

            videos.push(video);
            return videos;
        }
        return videos;
    }

    if (orderType === 'min') {
        const minValue = await Video.min(columnName);
        const column = genereColumnNameObject(columnName, minValue);
        if (Object.keys(column).length > 0) {
            const video = await Video.findOne({
                where: column,
                limit: limit,
            });

            videos.push(video);
            return videos;
        }
        return videos;
    }

    if (order.length > 1) {
        videos = await Video.findAll({
            order: [
                order,
            ],
            limit: limit,
        });

        return videos;
    }

    return videos;
};

module.exports = {
    saveVideoOrUpdate,
    findVideos,
    findAllVideosByUser,
    findAllVideoByFilter,
    findAllVideosOrderedBy,
};
