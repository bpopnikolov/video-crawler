const Video = require('./../models/Video');
const {
    VIDEOPAGE,
    SEARCHPAGE,
    URLS,
} = require('./../selectors').youtubeSelectors;
const {
    generateDom,
} = require('./../dom-parser');

const extractVideoDetails = async (video) => {
    const $ = await generateDom(video.url);

    const $likesArea = $(VIDEOPAGE.LIKESAREA);
    const $detailsArea = $(VIDEOPAGE.DETAILSAREA);

    const removeCommasRegExp = new RegExp(/[, ]+/, 'g');

    /* eslint-disable */
    const removeUtf8mb4Chars = /(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g;
    /* eslint-enable */

    const id = video.url.substring(video.url.indexOf('v=') + 2);
    const name = $(VIDEOPAGE.TITLE)
        .text()
        .toLowerCase()
        .replace(removeUtf8mb4Chars, '')
        .trim();

    const user = $(VIDEOPAGE.USER)
        .text()
        .toLowerCase()
        .trim();

    const published = $detailsArea
        .find(VIDEOPAGE.PUBLISHED)
        .text()
        .split('on')[1]
        .trim();

    const likes = $likesArea
        .find(VIDEOPAGE.LIKES)
        .text()
        .trim()
        .replace(removeCommasRegExp, '') || 0;

    const dislikes = $likesArea
        .find(VIDEOPAGE.DISLIKES)
        .text()
        .trim()
        .replace(removeCommasRegExp, '') || 0;

    const views = $(VIDEOPAGE.VIEWS)
        .text()
        .split('views')[0]
        .trim()
        .replace(removeCommasRegExp, '') || 0;

    // console.log(new Video(name, videoUrl,
    // published, user, +views, +likes, +dislikes));
    return new Video(id, name, video.url, video.duration, published,
        user, +views, +likes, +dislikes, URLS.BASEURL);
};

const extractVideosFromPage = async (pageUrl) => {
    const $ = await generateDom(pageUrl);

    const $videosList = $(SEARCHPAGE.CONTENTS);
    let videos = [];

    $videosList.find(SEARCHPAGE.VIDEO_CONTAINER).each((_, el) => {
        const $child = $(el);
        videos.push({
            url: $child.find(SEARCHPAGE.VIDEOURL).attr('href'),
            duration: $child.find(SEARCHPAGE.VIDEO_DURATION).text(),
        });
    });

    videos = videos.filter((video) => video.url.includes('/watch'))
        .map((video) => {
            // filter the duration string to get only
            const regex = new RegExp(/(?:(\d{1,2}):)?(\d{1,2}):(\d{2})/);
            const newDuration = video.duration.match(regex);

            const newVideo = {
                url: URLS.BASEURL + video.url,
                duration: newDuration ? newDuration[0] : '0',
            };

            return newVideo;
        });

    return videos;
};

const getVideosFromAllPages = async (url, videoUrls, currentPage,
    numOfPages) => {
    if (!url || currentPage === numOfPages) {
        // console.log(allPages);
        return null;
    }
    const $ = await generateDom(url);
    let nextPage = '';

    const $lastChild = $(SEARCHPAGE.PAGINGAREA)
        .children(':last');

    if ($lastChild.text().includes(`Next`)) {
        nextPage = URLS.BASEURL + $lastChild.attr('href');
    }

    const videos = await extractVideosFromPage(nextPage);

    videoUrls.push(videos);
    currentPage++;

    await getVideosFromAllPages(nextPage, videoUrls, currentPage,
        numOfPages);

    return videoUrls;
};

const extractDetailsOnChunks = async (videos) => {
    const dataArr = videos.reduce(async (acc, data) => {
        const accumolator = await acc;
        // console.log(data);
        const result = await Promise.all(data.map((video) => {
            return extractVideoDetails(video);
        }));
        // console.log(result);
        return Promise.resolve([...accumolator, ...result]);
    }, Promise.resolve([]));

    return dataArr;
};

// const extractDetailsOnChunks = (videoUrls) => {
//     const dataArr = videoUrls.map(async (data) => {
//         const result = await Promise.all(data.map((videoUrl) => {
//             return extractVideoDetails(videoUrl);
//         }));
//         return result;
//     });
//     return dataArr;
// };

const getVideosBySearchWord = async (searchWord, pages) => {
    const url = URLS.SEARCHURL + searchWord;
    const videos = await extractVideosFromPage(url);

    const restOfVideos = await getVideosFromAllPages(url, [], 0, pages - 1);

    const allVideos = restOfVideos ? [videos, ...restOfVideos] : [videos];
    const result = extractDetailsOnChunks(allVideos);
    return result;
};

module.exports = {
    getVideosBySearchWord,
};
