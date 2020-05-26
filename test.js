const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: false,  // false 일 경우 실행 시 웹사이트 확인 가능
        defaultViewport: null   // 해상도 800x600 제한 해제
    });
    const page = await browser.newPage();
    const query = 'physical';
    let data = {};

    // 사이트 이동 (2초)
    await page.goto(`https://music.naver.com/search/search.nhn?query=${query}&x=0&y=0`);

    // title
    try {
        data.title = await page.$eval('#content > div:nth-child(3) > div._tracklist_mytrack.tracklist_table.tracklist_type1._searchTrack > table > tbody > tr:nth-child(2) > td.name', element => {
            let stringRep = element.textContent.replace(/(\n|\t)/g, "");
            return stringRep
        });
        
    } catch (err) {
        try {
            data.title = await page.$eval('#content > div:nth-child(4) > div._tracklist_mytrack.tracklist_table.tracklist_type1._searchTrack > table > tbody > tr:nth-child(2) > td.name', element => {
                let stringRep = element.textContent.replace(/(\n|\t)/g, "");
                return stringRep
            })
            // console.log('title is null', err);

        } catch (err) {
            data.title = null;
            console.log('No data')
        }
        
    }

    // artist
    try {
        data.artist = await page.$eval('#content > div:nth-child(3) > div._tracklist_mytrack.tracklist_table.tracklist_type1._searchTrack > table > tbody > tr:nth-child(2) > td._artist.artist > a > span', element => {
            let stringRep = element.textContent.replace(/(\n|\t)/g, "");
            return stringRep
        });
    } catch (err) {
        try {
            data.artist = await page.$eval('#content > div:nth-child(4) > div._tracklist_mytrack.tracklist_table.tracklist_type1._searchTrack > table > tbody > tr:nth-child(2) > td._artist.artist > a > span', element => {
                let stringRep = element.textContent.replace(/(\n|\t)/g, "");
                return stringRep
            });

        } catch (err) {
            try {
                await page.waitFor(1000);
                await page.click('#content > div:nth-child(4) > div._tracklist_mytrack.tracklist_table.tracklist_type1._searchTrack > table > tbody > tr:nth-child(2) > td._artist.artist.no_ell2 > a')

                const artist = await page.$eval('#scroll_tl_artist > div.scrollbar-box > div > ul > li:nth-child(1) > a', element => {
                    return element.textContent
                });

                const artist2 = await page.$eval('#scroll_tl_artist > div.scrollbar-box > div > ul > li:nth-child(2) > a', element => {
                    return element.textContent
                });

                const setArtist = artist + ', ' + artist2;
                data.artist = setArtist;

            } catch (err) {
                data.artist = null;
                console.log('artist is null', err);
            }
            
        }
        
    }

    // album
    try {
        data.album = await page.$eval('#content > div:nth-child(3) > div._tracklist_mytrack.tracklist_table.tracklist_type1._searchTrack > table > tbody > tr:nth-child(2) > td.album > a > span', element => {
            let stringRep = element.textContent.replace(/(\n|\t)/g, "");
            return stringRep
        });
    } catch (err) {
        try {
            data.album = await page.$eval('#content > div:nth-child(4) > div._tracklist_mytrack.tracklist_table.tracklist_type1._searchTrack > table > tbody > tr:nth-child(2) > td.album > a > span', element => {
                let stringRep = element.textContent.replace(/(\n|\t)/g, "");
                return stringRep
            });

        } catch (err) {
            data.album = null;
            // console.log('album is null', err);
        }
        
    }

    // 가사 버튼 Element 찾은 후, trackId 추출
    const getDate = await page.$('a[title="가사"]');
    const getClassName = getDate._remoteObject.description;
    const splitId = getClassName.split(':');
    const trackId = splitId[3];

    // 가사 페이지 이동
    await page.goto(`https://music.naver.com/lyric/index.nhn?trackId=${trackId}`)

    // 가사 페이지 맞는지 확인
    if (page.url() === `https://music.naver.com/lyric/index.nhn?trackId=${trackId}`){

        // lyrics
        try {
            data.lyrics = await page.$eval('#lyricText', element => {
                return element.innerHTML
            });

        } catch (err) {
            data.lyrics = null;
            console.log('lyrics is null', err);
        }

        console.log(data)
        return data
    }
    
    
    // 브라우저 닫기
    await browser.close();
})();