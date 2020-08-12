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

// Top 100 chart save
async function searchTop100(song) {
    try {
        for (let i = 0; i < song.length; i++) {
            const findRes = await Songlist.findOne({
                where: {queryName: song[i].searchName}
            }).catch(err => {
                console.error('Search Song Error', err);
            });

            // DB에 검색결과 데이터 없을 경우 Youtube API 사용
            if (!findRes) {
                const res = await youtube.search.list({
                    part: 'snippet',
                    q: song[i].searchName,
                    maxResults: '1',
                    type: "video"
                });

                console.log('Youtube API Coast +100');

                Songlist.create({
                    queryName: song[i].searchName,
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

                console.log(i+1 + '번 노래 저장');

                // 랭크리스트 videoId 업데이트
                Ranklist.update({
                    videoId: res.data.items[0].id.videoId }, {
                    where: { rank: song[i].rank }
                }).catch(err => {
                    console.error('Ranklist videoId Update Error', err);
                });

            } else {
                console.log(i+1 + '번 이미 있음');

                Ranklist.update({
                    videoId: findRes.dataValues.videoId }, {
                    where: { rank: song[i].rank }
                }).catch(err => {
                    console.error('Ranklist videoId Update Error', err);
                });
            } 
        }

        // for문 종료 후

    } catch (error) {
        console.log('youtube search API Error', error);
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