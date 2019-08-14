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
        console.log(`getImgUrl - error:${error}`);
        return null;
    }

    const html = response.data;
    const $ = cheerio.load(html);
    const src = $('.one-imagen>img').attr('src');
    return src;
}

async function getImgStream(url) {
    if (!url) {
        console.log(`url不存在`);
        return null;
    }
    const response = await axios.get(url, { responseType: 'stream' });
    return response.data;
}

async function main(start, end) {
    let total = 0;
    if (!fs.existsSync('./oneimg')) {
        fs.mkdirSync('oneimg');
    }
    let promisesAll = [];
    for (let index = start; index < end; index++) {
        promisesAll.push(async () => {
            const url = await getImgUrl(host + index);
            const stream = await getImgStream(url);

            if (!stream) {
                console.log(`${index}:fail `);
                return;
            }

            const ws = fs.createWriteStream(`./oneimg/${index}.jpg`);

            try {
                stream.pipe(ws);
                total++;
                console.log(`${index}:success`);
            } catch (error) {
                console.log(`${index}:fail , fail message: ${error}`);
            }
        });
    }
    // console.log(promisesAll);

    // await Promise.all(promisesAll).then(() => total);
    for (let pro of promisesAll) {
        pro();
    }

    // return total;
}

main(1500, 1520);
// .then(data => {
//     console.log(`end: 成功下载 ${data}`);
// });

async function aa() {
    const arr = [];
    let totla = 0;
    for (let index = 0; index < 10; index++) {
        arr.push(
            new Promise((reslove, reject) => {
                console.log(index);
                setTimeout(() => {
                    console.log(index);
                    totla++;
                    reslove();
                }, Math.random() * 10000);
            })
        );
    }
    return Promise.all(arr).then(() => {
        return totla;
    });
}

//aa().then(data => console.log(`${data}:end`));

// 神奇的代码：readable.pipe(writable)
