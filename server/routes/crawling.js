const express = require('express');
const router = express.Router();
const models = require('../models');
const puppeteer = require('puppeteer');

// DB define
const lyricslist = models.lyricslist;
const Ranklist = models.ranklist;

async function lyricsCrawling(song) {
    try {
        const findRes = await lyricslist.findOne({
            where: {queryName: song}
        }).catch(err => {
            console.error('Search Lyrics Error', err)
        })
    
        if (!findRes) {
            const browser = await puppeteer.launch({
                headless: true,  // false 일 경우 실행 시 웹사이트 확인 가능
            });
            const page = await browser.newPage();
            const regSpChar = /&/gi;
            let query = song;

            let reNameMv = query.substr(query.length - 3);
            let reNameLive = query.substr(query.length - 5);

            if (reNameMv === ' mv') {
                query = query.slice(0, -3);
            } else if (reNameLive === ' live') {
                query = query.slice(0, -5);
            }

            query = query.replace(regSpChar, '%26');

            if (regSpChar.test(query)) {
                const blankReg = /\s{1,}/g;
                query = query.replace(blankReg, '+');
            }

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
                        try {
                            await page.waitFor(1000);
                            await page.click('#content > div:nth-child(3) > div._tracklist_mytrack.tracklist_table.tracklist_type1._searchTrack > table > tbody > tr:nth-child(2) > td._artist.artist.no_ell2 > a')
            
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
        
            }
            
            // 브라우저 닫기
            await browser.close();

            if (reNameMv === ' mv') {
                lyricslist.create({
                    queryName: song,
                    title: data.title + ' MV',
                    artist: data.artist,
                    album: data.album,
                    lyrics: data.lyrics
                }).catch(err => {
                    console.error('Lyrics data Create Error', err);
                })

            } else if (reNameLive === ' live') {
                lyricslist.create({
                    queryName: song,
                    title: data.title + ' Live',
                    artist: data.artist,
                    album: data.album,
                    lyrics: data.lyrics
                }).catch(err => {
                    console.error('Lyrics data Create Error', err);
                })

            } else {
                lyricslist.create({
                    queryName: song,
                    title: data.title,
                    artist: data.artist,
                    album: data.album,
                    lyrics: data.lyrics
                }).catch(err => {
                    console.error('Lyrics data Create Error', err);
                })
            }

            return data.lyrics
        }

        return findRes.dataValues.lyrics

    } catch (err) {
        console.log('Lyrics Crawling Error', err);
    }
    
}

// Top 100 chart save
async function crawlingTop100(song) {
    try {
        for (let i = 0; i < song.length; i++) {
            const findRes = await lyricslist.findOne({
                where: {queryName: song[i].searchName}
            }).catch(err => {
                console.error('Search Lyrics Error', err)
            })
        
            if (!findRes) {
                console.log(i + '번 노래 크롤링 시작');

                const browser = await puppeteer.launch({
                    headless: true,  // false 일 경우 실행 시 웹사이트 확인 가능
                });
                const page = await browser.newPage();
                const regSpChar = /&/gi;
                let query = song[i].searchName;
    
                let reNameMv = query.substr(query.length - 3);
                let reNameLive = query.substr(query.length - 5);
    
                if (reNameMv === ' mv') {
                    query = query.slice(0, -3);
                } else if (reNameLive === ' live') {
                    query = query.slice(0, -5);
                }
    
                query = query.replace(regSpChar, '%26');
    
                if (regSpChar.test(query)) {
                    const blankReg = /\s{1,}/g;
                    query = query.replace(blankReg, '+');
                }
    
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
                            try {
                                await page.waitFor(1000);
                                await page.click('#content > div:nth-child(3) > div._tracklist_mytrack.tracklist_table.tracklist_type1._searchTrack > table > tbody > tr:nth-child(2) > td._artist.artist.no_ell2 > a')
                
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
            
                }
                
                // 브라우저 닫기
                await browser.close();
    
                if (reNameMv === ' mv') {
                    lyricslist.create({
                        queryName: song[i].searchName,
                        title: data.title + ' MV',
                        artist: data.artist,
                        album: data.album,
                        lyrics: data.lyrics
                    }).catch(err => {
                        console.error('Lyrics data Create Error', err);
                    })
    
                } else if (reNameLive === ' live') {
                    lyricslist.create({
                        queryName: song[i].searchName,
                        title: data.title + ' Live',
                        artist: data.artist,
                        album: data.album,
                        lyrics: data.lyrics
                    }).catch(err => {
                        console.error('Lyrics data Create Error', err);
                    })
    
                } else {
                    lyricslist.create({
                        queryName: song[i].searchName,
                        title: data.title,
                        artist: data.artist,
                        album: data.album,
                        lyrics: data.lyrics
                    }).catch(err => {
                        console.error('Lyrics data Create Error', err);
                    })
                }
    
                console.log(i+1 + '번 노래 저장');

                // 랭크리스트 lyrics 업데이트
                Ranklist.update({
                    lyrics: data.lyrics }, {
                    where: { rank: song[i].rank }
                }).catch(err => {
                    console.error('Ranklist lyrics Update Error', err);
                });

            } else {
                console.log(i+1 + '번 이미 있음');

                Ranklist.update({
                    lyrics: findRes.dataValues.lyrics }, {
                    where: { rank: song[i].rank }
                }).catch(err => {
                    console.error('Ranklist lyrics Update Error', err);
                });
            }
    
        }
        
    } catch (err) {
        console.log('Lyrics Crawling Error', err);
    }
    
}

router.post('/lyricsLoad', async (req, res) => {
    const result = await lyricsCrawling(req.body.song);
    res.send(result)
});

router.post('/bugs', async (req, res) => {
    const result = await crawlingTop100(req.body.song);
    res.send(result)
})


module.exports = router;