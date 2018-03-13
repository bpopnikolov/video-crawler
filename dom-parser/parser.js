const jQuery = require('jquery');
const {
    JSDOM,
} = require('jsdom');
// const jsdom = require('jsdom/lib/old-api.js').jsdom;
const axios = require('axios');


const generateDom = async (url) => {
    const doc = await JSDOM.fromURL(url);
    const $ = jQuery(doc.window);

    return $;
};

const generateWindow = async (url) => {
    const doc = await JSDOM.fromURL(url, {
        runScripts: 'outside-only',
    });
    jQuery(doc.window);

    return doc.window;
};

const generateDomWithCustomRequest = async (url) => {
    const request = await axios.get(url, {
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    });

    const html = request.data;
    // console.log(html);
    const doc = new JSDOM(html, {
        runScripts: 'outside-only',
    });
    jQuery(doc.window);

    return doc.window;
};


module.exports = {
    generateDom,
    generateWindow,
    generateDomWithCustomRequest,
};
