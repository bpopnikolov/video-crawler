class Video {
    constructor(
        id, name, url,
        duration, published, user,
        views, likes, dislikes, source
    ) {
        this.id = id;
        this.name = name;
        this.url = url;
        this.duration = duration;
        this.published = published;
        this.user = user;
        this.views = views;
        this.likes = likes;
        this.dislikes = dislikes;
        this.source = source;
    }
}

module.exports = Video;
