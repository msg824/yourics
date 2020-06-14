const express = require('express');
const router = express.Router();
const models = require('../models');

// DB define
const Songlist = models.songlist;
const Lyricslist = models.lyricslist;

// 수정 필요.
// INNER JOIN 사용하여 한 번에 데이터를 불러오는 방식으로.
async function randomPlay() {
    let data = {};

    // songlists 테이블의 데이터 총 개수
    const query = `SELECT COUNT(id) as cnt FROM songlists`;
    let result = await models.sequelize.query(query, { type : models.sequelize.QueryTypes.SELECT ,raw : true});

    // 데이터 개수에서 랜덤 값 추출
    let count = result[0].cnt;
    let randomCnt = Math.random() * count;
    randomCnt = Math.ceil(randomCnt);
    
    // 랜덤 id에 해당하는 노래제목 및 비디오ID 찾기.
    // 노래제목에 해당하는 가사 찾기
    try {
        const findName = await Songlist.findOne({
            where: {id: randomCnt},
            raw: true
        })
        data.videoId = findName.videoId;

        let dbQueryName = findName.queryName;
        
        const findId = await Lyricslist.findOne({
            where: {queryName: dbQueryName},
            raw: true
        })
        data.lyrics = findId.lyrics;

    } catch (err) {
        console.log('Random Play Error! lyrics is null', err)
    }

    return data
}

async function vcUp(song) {
    try {
        const findRes = await Songlist.findOne({
            where: {videoId: song}
        }).catch(err => {
            console.error('Search Song Error', err);
        });

        // 현재 조회수
        const currentView = findRes.dataValues.viewCount;

        console.log(currentView)

        // 노래 검색 시 조회수 +1
        Songlist.update({
            viewCount: currentView+1 }, {
            where: { videoId: song }
        }).catch(err => {
            console.error('viewCount Update Error', err);
        })
        
    } catch (err) {
        console.log('View Count Up function Err', err);
    }
}

router.get("/randomPlay", async(req, res) => {
    try {
        const result = await randomPlay();
        res.send(result);
    } catch (err){
        console.log("randomPlay err : " + err);
    }
});

router.post('/viewCountUp', async(req, res) => {
    try {
        const result = await vcUp(req.body.song);
        res.send(result);

    } catch (err) {
        console.log('viewCount Up Err :', err);
    }
})

module.exports = router;