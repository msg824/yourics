const express = require('express');
const router = express.Router();
const configs = require('../config/development');
const { google } = require('googleapis');
const models = require('../models');

// DB define
const Songlist = models.songlist;
const Ranklist = models.ranklist;

const youtube = google.youtube({
    version: 'v3',
    auth: configs.youtubeApi
})

async function searchList(song) {
    try {
        const findRes = await Songlist.findOne({
            where: {queryName: song}
        }).catch(err => {
            console.error('Search Song Error', err);
        });

        // DB에 검색결과 데이터 없을 경우 Youtube API 사용
        if (!findRes) {
            const res = await youtube.search.list({
                part: 'snippet',
                q: song,
                maxResults: '1',
                type: "video"
            });

            console.log('Youtube API Coast +100');

            Songlist.create({
                queryName: song,
                viewCount: 1,
                videoId: res.data.items[0].id.videoId,
                title: res.data.items[0].snippet.title,
                description: res.data.items[0].snippet.description,
                channelId: res.data.items[0].snippet.channelId,
                channelTitle: res.data.items[0].snippet.channelTitle,
                publishedAt: res.data.items[0].snippet.publishedAt
            }).catch(err => {
                console.error('Song Data Create Error', err)
            });

            return res.data.items[0].id.videoId
        }

        // 현재 조회수
        const currentView = findRes.dataValues.viewCount;

        // 노래 검색 시 조회수 +1
        Songlist.update({
            viewCount: currentView+1 }, {
            where: { queryName: song }
        }).catch(err => {
            console.error('viewCount Update Error', err);
        })
        
        return findRes.dataValues.videoId

    } catch (error) {
        console.log('youtube search API Error', error)
    }
    
}

// Top 100 chart save. 노래 하나당 2번씩 할당 (lyrics, mv)
async function searchTop100(song) {
    try {
        for (let i = 0; i < song.length; i++) {

            for (let j = 0; j < 2; j++) {

                // MV 에서의 노래를 끊어쓰는 것을 방지하기 위해
                // 더 정확히는 TOP 100 재생목록을 위해
                // 검색내용 : '노래제목' '아티스트' 'lyrics'
                if (j === 0) {
                    const findRes = await Songlist.findOne({
                        where: {queryName: song[i].searchName}
                    }).catch(err => {
                        console.error('Search Song Error', err);
                    });
        
                    // DB에 검색결과 데이터 없을 경우 Youtube API 사용
                    if (!findRes) {
                        await youtubeListApi(song[i], ' lyrics', '', false);
                        console.log(i+1 + '번 lyrics 노래 저장');
        
                    } else {
                        console.log(i+1 + '번 lyrics 노래 이미 있음');
        
                        Ranklist.update({
                            videoId: findRes.dataValues.videoId }, {
                            where: { rank: song[i].rank }
                        }).catch(err => {
                            console.error('Ranklist videoId Update Error', err);
                        });
                    } 

                }

                // 검색내용 : '노래제목' '아티스트' 'mv'
                if (j === 1) {
                    const findRes = await Songlist.findOne({
                        where: {queryName: song[i].searchName + ' mv'}
                    }).catch(err => {
                        console.error('Search Song Error', err);
                    });
        
                    // DB에 검색결과 데이터 없을 경우 Youtube API 사용
                    if (!findRes) {
                        await youtubeListApi(song[i], ' mv', ' mv', true);
                        console.log(i+1 + '번 mv 노래 저장');
        
                    } else {
                        console.log(i+1 + '번 mv 노래 이미 있음');
        
                        Ranklist.update({
                            videoMvId: findRes.dataValues.videoId }, {
                            where: { rank: song[i].rank }
                        }).catch(err => {
                            console.error('Ranklist videoId Update Error', err);
                        });
                    } 
                }
                
            }
            
        }

        // for문 종료 후

    } catch (error) {
        console.log('youtube search API Error', error);
    }
    
}

// 매개변수 정의
// song = TOP100 JSON의 노래제목 index
// addQuery = 검색내용 끝에 lyrics, mv 추가
// addDbQuery = DB에 저장되는 추가 문자 (mv만)
// isMv = Ranklist 테이블 수정할때 컬럼명 선택을 위해
async function youtubeListApi(song, addQuery, addDbQuery, isMv) {
    const res = await youtube.search.list({
        part: 'snippet',
        q: song.searchName + addQuery,
        maxResults: '1',
        type: "video"
    });

    console.log('Youtube API Coast +100');

    Songlist.create({
        queryName: song.searchName + addDbQuery,
        viewCount: 0,
        videoId: res.data.items[0].id.videoId,
        title: res.data.items[0].snippet.title,
        description: res.data.items[0].snippet.description,
        channelId: res.data.items[0].snippet.channelId,
        channelTitle: res.data.items[0].snippet.channelTitle,
        publishedAt: res.data.items[0].snippet.publishedAt
    }).catch(err => {
        console.error('Song Data Create Error', err);
    });

    // 컬럼명 videoId, videoMvId 구분을 위해
    if (isMv) {
        Ranklist.update({
            videoMvId: res.data.items[0].id.videoId }, {
            where: { rank: song.rank }
        }).catch(err => {
            console.error('Ranklist videoId Update Error', err);
        });

    } else {
        Ranklist.update({
            videoId: res.data.items[0].id.videoId }, {
            where: { rank: song.rank }
        }).catch(err => {
            console.error('Ranklist videoId Update Error', err);
        });
    }
    
}




router.post('/search', async (req, res) => {
    const result = await searchList(req.body.song);
    res.send(result)
});

router.post('/bugs', async (req, res) => {
    const result = await searchTop100(req.body.song);
    res.send(result)
});

module.exports = router;