const {
    Video,
    User,
    Source,
} = require('../models');


const dropdb = async () => {
    await Promise.all([
        Video.destroy({
            truncate: {
                cascade: true,
            },
        }),
        User.destroy({
            truncate: {
                cascade: true,
            },
        }),
        Source.destroy({
            truncate: {
                cascade: true,
            },
        }),
    ]);
};

module.exports = {
    dropdb,
};
