const express = require('express');
const router = express.Router();
const models = require('../models');

// DB define
const Songlist = models.songlist;
const Lyricslist = models.lyricslist;

async function searchList(song) {
    try {
        const queryLength = song.length;
    
        // 검색 결과가 2글자 이상일 경우
        if (!(queryLength === 1)) {
            const query = `select * from songlists s INNER JOIN lyricslists l ON (l.queryName = s.queryName) where l.queryName like '%${song}%' or l.artist like '%${song}%';`;
            let queryResult = await models.sequelize.query(query, { type : models.sequelize.QueryTypes.SELECT ,raw : true});
    
            let datas = [];
            queryResult.map((data, i) => {
                return datas[i] = {
                    videoId: data.videoId,
                    title: data.title,
                    artist: data.artist,
                    album: data.album,
                    lyrics: data.lyrics
                }
            })

            // queryResult 에 값이 들어가는지 확인
            let isEmpty = function(value) { 
                if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) { 
                    return true 
                } else { 
                    return false 
                }
            };

            // queryResult 에 값이 없으면 null 을 return
            if (isEmpty(queryResult)) {
                return null

            }
    
            // console.log(queryResult);
            // console.log('datas', datas)
            return datas

        }

    } catch (err) {
        console.log('searchList Err', err);

    }

}

router.post("/findSong", async(req, res) => {
    try {
        const result = await searchList(req.body.song);
        res.send(result);
    } catch (err){
        console.log("findSong err : " + err);
    }
});

module.exports = router;