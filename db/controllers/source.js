const {
    Video,
    User,
    Source,
    sequelize,
} = require('../models');


const findSources = async (searchWords) => {
    searchWords = searchWords.map((word) => {
        return {
            $like: `%${word}%`,
        };
    });

    const sources = await Source.findAll({
        where: {
            name: {
                $or: searchWords,
            },
        },
    });

    return sources;
};

module.exports = {
    findSources,
};
