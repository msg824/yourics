const express = require('express');
const router = express.Router();
const models = require('../models');
const puppeteer = require('puppeteer');

// DB define
const lyricslist = models.lyricslist;

async function lyricsCrawling(song) {
    const browser = await puppeteer.launch({
        headless: true  // false 일 경우 실행 시 웹사이트 확인 가능
    });
    const page = await browser.newPage();
    const query = song;

    // 사이트 이동 (2초)
    await page.goto('https://music.naver.com/home/index.nhn');

    // query 입력
    await page.evaluate(searchName => {
        document.querySelector('input[name="query"]').value = searchName;
    }, query)

    // 검색 버튼 클릭
    await page.click('input[src="https://ssl.pstatic.net/static/nmusic/201008/btn_search.gif"]')

    // 페이지 이동 대기 1초
    await page.waitFor(100);

    // 가사 버튼 Element 찾은 후, trackId 추출
    const getDate = await page.$('a[title="가사"]');
    const getClassName = getDate._remoteObject.description;
    const splitId = getClassName.split(':');
    const trackId = splitId[3];

    // 가사 페이지 이동
    await page.goto(`https://music.naver.com/lyric/index.nhn?trackId=${trackId}`)

    // 가사 페이지 맞는지 확인
    if (page.url() === `https://music.naver.com/lyric/index.nhn?trackId=${trackId}`){

        let data = {};

        // title
        try {
            data.title = await page.$eval('#pop_content > div.section_info > div.dsc > h2 > span > a', element => {
                return element.textContent
            });
        } catch (err) {
            data.title = null;
            // console.log('title is null', err);
        }

        // artist
        try {
            data.artist = await page.$eval('#pop_content > div.section_info > div.dsc > span.artist > a', element => {
                return element.textContent
            });
        } catch (err) {
            data.artist = null;
            // console.log('artist is null', err);
        }

        // songWriter
        try {
            data.songWriter = await page.$eval('#pop_content > div.section_info > div.dsc > p > span:nth-child(1) > a', element => {
                return element.textContent.trim();
            });
        } catch (err) {
            data.songWriter = null;
            // console.log('songWriter is null', err);
        }
        
        // composer
        try {
            data.composer = await page.$eval('#pop_content > div.section_info > div.dsc > p > span:nth-child(2) > a', element => {
                return element.textContent.trim();
            });

        } catch (err) {
            data.composer = null;
            // console.log('composer is null', err)
        }
        
        // arrangement
        try {
            data.arrangement = await page.$eval('#pop_content > div.section_info > div.dsc > p > span:nth-child(3) > a', element => {
                return element.textContent.trim();
            });

        } catch (err) {
            data.arrangement = null;
            // console.log('arrangement is null', err);
        }

        // lyrics
        try {
            data.lyrics = await page.$eval('#lyricText', element => {
                return element.innerHTML
            });

        } catch (err) {
            data.lyrics = null;
            console.log('lyrics is null', err);
        }

        return data
    }
    
    
    // 브라우저 닫기
    await browser.close();
}

router.post('/lyricsLoad', async (req, res) => {
    const result = await lyricsCrawling(req.body.song);
    res.send(result)
})

module.exports = router;