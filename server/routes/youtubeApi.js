const express = require('express');
const router = express.Router();
const configs = require('../config/development');
const { google } = require('googleapis');
const models = require('../models');

// DB define
const Songlist = models.songlist;

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
                maxResults: '1'
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

router.post('/search', async (req, res) => {
    const result = await searchList(req.body.song);
    res.send(result)
})

module.exports = router;