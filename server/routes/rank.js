const puppeteer = require('puppeteer');
const express = require('express');
const models = require('../models');
const router = express.Router();

// DB define
const ranklist = models.ranklist;

async function top100() {
    await ranklist.destroy({ truncate: true });

    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1920,
        height: 1080
    });

    let data = [];

    await page.goto('https://music.bugs.co.kr/chart');
    data.push(await getAll(page));

    let searchNameArray = [];
    data.forEach(async (res, i) => {
        for (i = 0; i < res.length; i++) {
            await ranklist.bulkCreate([{
                rank: res[i].rank,
                title: res[i].title,
                artist: res[i].artist,
                album: res[i].album
            }], {
                individualHooks : true,
            });

            searchNameArray.push({
                rank: res[i].rank,
                searchName: res[i].title + ' ' + res[i].artist
            });
            
            
        };
    });
    await page.waitFor(10000);
    await browser.close();

    return searchNameArray;
    
}


async function getAll(page) {
    let data = [];
    const number = await page.$$eval("#CHARTrealtime > table > tbody > tr", (data) => data.length);
    // tr태그의 개수를 세어서 줄의 개수를 얻은 후에
    for (let index = 0; index < number; index++) {
        data.push(await getOne(page, index + 1));
        // 각 줄의 정보를 얻어서 배열에 Push
    }
    return Promise.resolve(data);
}

async function getOne(page, index) {

    let data = {};

    let temp = await page.$("#CHARTrealtime > table > tbody > tr:nth-child("+ index +") > td:nth-child(4) > div > strong");
    // nth-child(index)를 이용해 원하는 줄을 선택할 수 있도록 한다.

    data.rank = await page.evaluate((data) => {
        return data.textContent;
    }, temp);

    data.title = await page.$eval("#CHARTrealtime > table > tbody > tr:nth-child("+ index +") > th > p > a", (data) => data.textContent);

    data.artist = await page.$eval("#CHARTrealtime > table > tbody > tr:nth-child("+ index +") > td:nth-child(8) > p > a", (data) => data.textContent);

    data.album = await page.$eval("#CHARTrealtime > table > tbody > tr:nth-child("+ index +") > td:nth-child(9) > a", (data) => data.textContent);

    return Promise.resolve(data);

}

router.get('/rankLoad', async (req, res) => {
    const result = await top100();
    res.send(result)
})

module.exports = router;

