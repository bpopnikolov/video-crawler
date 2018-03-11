const {
    Video,
    User,
    Source,
} = require('../models');

const findUsers = async (searchWords) => {
    searchWords = searchWords.map((word) => {
        return {
            $like: `%${word}%`,
        };
    });

    const users = await User.findAll({
        where: {
            name: {
                $or: searchWords,
            },
        },
    });

    return users;
};

module.exports = {
    findUsers,
};
