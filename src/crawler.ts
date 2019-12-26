// const axios = require('axios');
// const fs = require('fs');
// const fsP = fs.promises;
// const path = require('path');
// //const request = require('request');
// const cheerio = require('cheerio'); // 解析html的
import axios from "axios";
import * as fs from "fs";
import * as cheerio from "cheerio";
import * as grogram from "commander";

import * as inquirer from "inquirer";

grogram.version("0.0.1");
grogram.option("-s, --start <type>", "start page");
grogram.option("-e, --end <type>", "end page");
grogram.parse(process.argv);

const start = grogram.start || 1000;
const end = grogram.end || 1100;

const host = "http://wufazhuce.com/one/";

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
  const src = $(".one-imagen>img").attr("src");
  return src;
}

async function getImgStream(url: string) {
  if (!url) {
    console.log(`url不存在`);
    return null;
  }
  const response = await axios.get(url, { responseType: "stream" });
  return response.data;
}

async function main(start: number, end: number) {
  let total = 0;
  if (!fs.existsSync("./oneimg")) {
    fs.mkdirSync("oneimg");
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
    // 神奇的代码：readable.pipe(writable)
    try {
      stream.pipe(ws);
      total++;
      console.log(`${index}:success`);
    } catch (error) {
      console.log(`${index}:fail , fail message: ${error}`);
    }
  });
  // console.log(promisesAll);

  await Promise.all(promisesAll);
  //   for (let pro of promisesAll) {
  //     await pro;
  //   }

  return total;
}

(async () => {
  // 交互式命令
  const answer = await inquirer.prompt([
    {
      name: "start",
      type: "number",
      message: "开始的期数，输入数字"
    },
    {
      name: "end",
      type: "number",
      message: "结束的期数"
    }
  ]);
  console.log(answer);

  main(answer.start, answer.end).then(data => {
    console.log(`end: 成功下载 ${data}`);
  });
})();

// 下面的是async学习内容
async function aa() {
  let totla = 0;

  const promis = new Array(10).fill(1).map((element, index) => {
    return new Promise((reslove, reject) => {
      setTimeout(() => {
        totla++;
        console.log(index);

        reslove(index);
      }, Math.random() * 10000);
    });
  });

  //   for (const pro of promis) {
  //     // console.log(pro);
  //     // await pro;
  //     pro.then(console.log);
  //   }

  //   for await (let pro of promis) {
  //     console.log(pro);
  //   }
  await Promise.all(promis);
  return totla;
}

//aa().then(data => console.log(`${data} end`));
