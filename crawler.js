const axios = require('axios');
const fs = require('fs');
const fsP = fs.promises;
const path = require('path');
//const request = require('request');
const cheerio = require('cheerio'); // 解析html的

const url = 'http://wufazhuce.com/one/';
let total = 0;
let promiseAll = [];

async function getUrl(url) {
    const data = await axios.get(url);
}

for (let index = 1100; index < 1110; index++) {
    axios
        .get(url + index)
        .then(Response => {
            const html = Response.data;
            const $ = cheerio.load(html);
            const url = $('.one-imagen>img').attr('src');
            axios.get(url, { responseType: 'stream' }).then(response => {
                // console.log(respone.data);
                const rs = response.data;

                if (!fs.existsSync('./oneimg')) {
                    fs.mkdirSync('oneimg');
                }
                const ws = fs.createWriteStream(`./oneimg/${index}.jpg`);

                try {
                    rs.pipe(ws);
                    total++;
                    console.log(`${index}:success`);
                } catch (error) {
                    console.log(`${index}:fail , fail message: ${error}`);
                }
            });
        })
        .catch(data => {
            console.log(`${index}:网页加载失败`);
        });
}

console.log(`end: 下载 ${total}`);

// 神奇的代码：readable.pipe(writable)
