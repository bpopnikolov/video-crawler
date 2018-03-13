const Video = require('./../models/Video');
const {
    VIDEOPAGE,
    SEARCHPAGE,
    URLS,
} = require('./../selectors').vboxSelectors;
const chalk = require('chalk');
const {
    generateDomWithCustomRequest,
} = require('./../dom-parser');

const attachScriptToWindow = (window) => {
    const $ = window.$;

    let script = '';

    $('script').each((_, s) => {
        const $s = $(s);
        if ($s.text().includes('encodedTitle')) {
            script = $s.text();
        }
    });

    // console.log(script);
    window.eval(script);
};

const extractVideoDetails = async (video) => {
    const id = video.url.split('/play:')[1].trim();

    const window = await generateDomWithCustomRequest(
        URLS.FETCH_VIDEO + id);
    const $ = window.$;

    const removeWhiteSpaces = new RegExp(/\s/, 'g');
    const onlyDigits = new RegExp(/\d+/);
    /* eslint-disable */
    const removeUtf8mb4Chars = /(?![\x00-\x7F]|[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3})./g;
    /* eslint-enable */

    const name = $(VIDEOPAGE.TITLE)
        .text()
        .toLowerCase()
        .replace(removeUtf8mb4Chars, '')
        .trim();

    const user = $(VIDEOPAGE.USER)
        .attr('data-username')
        .toLowerCase()
        .trim();

    const published = $(VIDEOPAGE.PUBLISHED)
        .attr('datetime')
        .trim();

    const likes = $(VIDEOPAGE.LIKES)
        .text()
        .trim()
        .match(onlyDigits)[0]
        .replace(removeWhiteSpaces, '') || 0;

    const dislikes = $(VIDEOPAGE.DISLIKES)
        .text()
        .trim()
        .replace(removeWhiteSpaces, '') || 0;

    const views = $(VIDEOPAGE.VIEWS)
        .next()
        .text()
        .trim()
        .replace(removeWhiteSpaces, '') || 0;

    return new Video(id, name, video.url, video.duration, published,
        user, +views, +likes, +dislikes, URLS.BASEURL);
};

const extractVideosFromPage = async (pageUrl) => {
    const window = await generateDomWithCustomRequest(pageUrl);
    const $ = window.$;
    const videos = [];

    $(SEARCHPAGE.VIDEO_CONTAINER).each((_, el) => {
        const $child = $(el);

        videos.push({
            url: URLS.BASEURL +
                $child
                .find(SEARCHPAGE.VIDEOURL)
                .attr('href'),
            duration: $child
                .find(SEARCHPAGE.VIDEO_DURATION)
                .text(),
        });
    });

    return videos;
};

const getVideosFromAllPages = async (url, videoUrls, searchWord,
    currentPage, subPage, numOfPages, pageCount) => {
    const window = await generateDomWithCustomRequest(url);

    // console.log(chalk.bgRed.bold(url));
    attachScriptToWindow(window);

    if (window.endLeft || pageCount === numOfPages) {
        return null;
    }

    const videos = await extractVideosFromPage(url);
    videoUrls.push(videos);

    if (subPage < 108) {
        subPage += 36;
    } else {
        subPage = 0;
        currentPage++;
    }

    pageCount++;

    const nextPage = URLS.NEXTPAGE_BASEURL +
        `${searchWord}&ajax=1&page=${currentPage}&start=${subPage}`;

    await getVideosFromAllPages(nextPage, videoUrls, searchWord,
        currentPage, subPage, numOfPages, pageCount);

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
    const INCREMENT_PAGE = 36;
    const url = URLS.SEARCHURL + searchWord;
    const nextPage = URLS.NEXTPAGE_BASEURL +
        `${searchWord}&ajax=1&page=1&start=${INCREMENT_PAGE}`;

    const videos = await extractVideosFromPage(url);
    const restOfVideos = await getVideosFromAllPages(nextPage, [],
        searchWord, 1, INCREMENT_PAGE, pages - 1, 0);

    const allVideos = restOfVideos ? [videos, ...restOfVideos] : [videos];
    const result = extractDetailsOnChunks(allVideos);

    return result;
};

// getVideosBySearchWord('azis', 10).catch((err) =>
//     console.log(err));

module.exports = {
    getVideosBySearchWord,
};
