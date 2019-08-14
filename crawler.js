const axios = require('axios');
const fs = require('fs');
const fsP = fs.promises;
const path = require('path');
//const request = require('request');
const cheerio = require('cheerio'); // 解析html的

const host = 'http://wufazhuce.com/one/';

async function getImgUrl(url) {
    let response = null;
    try {
        response = await axios.get(url);
    } catch (error) {
        console.log(`error:${error}`);
        return null;
    }

    const html = response.data;
    const $ = cheerio.load(html);
    const src = $('.one-imagen>img').attr('src');
    return src;
}

async function getImgStream(url) {
    if (!url) {
        return null;
    }
    const response = await axios.get(url, { responseType: 'stream' });
    return response.data;
}

async function main(start, end) {
    let total = 0;
    for (let index = start; index < end; index++) {
        const url = await getImgUrl(host + index);
        const stream = await getImgStream(url);

        if (!fs.existsSync('./oneimg')) {
            fs.mkdirSync('oneimg');
        }
        const ws = fs.createWriteStream(`./oneimg/${index}.jpg`);

        try {
            stream.pipe(ws);
            total++;
            console.log(`${index}:success`);
        } catch (error) {
            console.log(`${index}:fail , fail message: ${error}`);
        }
    }
    return total;
}

main(1100, 1510).then(data => {
    console.log(`end: 下载 ${data}`);
});

// 神奇的代码：readable.pipe(writable)
