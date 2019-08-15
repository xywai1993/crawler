// const axios = require('axios');
// const fs = require('fs');
// const fsP = fs.promises;
// const path = require('path');
// //const request = require('request');
// const cheerio = require('cheerio'); // 解析html的
import axios from 'axios';
import * as fs from 'fs';
import * as cheerio from 'cheerio';

const host = 'http://wufazhuce.com/one/';

async function getImgUrl(url: string) {
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

async function getImgStream(url: string) {
    if (!url) {
        console.log(`url不存在`);
        return null;
    }
    const response = await axios.get(url, { responseType: 'stream' });
    return response.data;
}

async function main(start: number, end: number) {
    let total = 0;
    if (!fs.existsSync('./oneimg')) {
        fs.mkdirSync('oneimg');
    }
    let arr = [];
    for (let index = start; index <= end; index++) {
        arr.push(index);
    }

    let promisesAll = arr.map(async index => {
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
    // console.log(promisesAll);

    // await Promise.all(promisesAll).then(() => total);
    for (let pro of promisesAll) {
        await pro;
    }

    return total;
}

main(1500, 1520).then(data => {
    console.log(`end: 成功下载 ${data}`);
});

// 下面的是async学习内容
async function aa() {
    const arr = [];
    let totla = 0;

    const promis = new Array(10).fill(1).map(async (element, index) => {
        const i = await new Promise((reslove, reject) => {
            setTimeout(() => {
                console.log(index);
                totla++;
                reslove(index);
            }, Math.random() * 10000);
        });
        return i;
    });

    for (const pro of promis) {
        console.log(pro);
        await pro;
    }

    return totla;
}

//aa().then(data => console.log(`${data}:end`));

const bb = async () => {
    return 'aa';
};
const a = Promise.resolve(134);

const c = async () => {
    // const b = await bb ;
    const b = await bb();
    return b;
};
// c().then(console.log);

// 神奇的代码：readable.pipe(writable)
