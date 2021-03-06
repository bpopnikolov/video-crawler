const {
    User,
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
        order: [
            ['name', 'ASC'],
        ],
    });

    return users;
};


module.exports = {
    findUsers,
};
