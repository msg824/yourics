const express = require('express');
const router = express.Router();
const models = require('../models');

async function searchList(song) {
    try {
        let query = song;

        let reNameMv = query.substr(query.length - 3);
        let reNameLive = query.substr(query.length - 5);

        if (reNameMv === ' mv') {
            query = query.slice(0, -3);
        } else if (reNameLive === ' live') {
            query = query.slice(0, -5);
        }

        const queryLength = query.length;
    
        // 검색 결과가 2글자 이상일 경우
        if (!(queryLength === 1)) {
            if (reNameMv === ' mv') {
                const querySQL = `select distinct s.videoId, l.title, l.artist, l.album, l.lyrics from songlists s INNER JOIN lyricslists l ON (l.queryName = s.queryName) where s.queryName like '%${query}%' and l.queryName regexp 'mv$' or l.artist like '%${query}%' and l.queryName regexp 'mv$' order by l.title asc;`;
                let queryResult = await models.sequelize.query(querySQL, { type : models.sequelize.QueryTypes.SELECT ,raw : true});

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

                return datas

            } else if (reNameLive === ' live') {
                const querySQL = `select distinct s.videoId, l.title, l.artist, l.album, l.lyrics from songlists s INNER JOIN lyricslists l ON (l.queryName = s.queryName) where s.queryName like '%${query}%' and l.queryName regexp 'live$' or l.artist like '%${query}%' and l.queryName regexp 'live$' order by l.title asc;`;
                let queryResult = await models.sequelize.query(querySQL, { type : models.sequelize.QueryTypes.SELECT ,raw : true});

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

                let isEmpty = function(value) { 
                    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) { 
                        return true 
                    } else { 
                        return false 
                    }
                };

                if (isEmpty(queryResult)) {
                    return null
                }

                return datas

            } else {
                const querySQL = `select distinct s.videoId, l.title, l.artist, l.album, l.lyrics from songlists s INNER JOIN lyricslists l ON (l.queryName = s.queryName) where s.queryName like '%${song}%' or l.artist like '%${song}%' order by l.title asc;`;
                let queryResult = await models.sequelize.query(querySQL, { type : models.sequelize.QueryTypes.SELECT ,raw : true});
                
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

                let isEmpty = function(value) { 
                    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) { 
                        return true 
                    } else { 
                        return false 
                    }
                };

                if (isEmpty(queryResult)) {
                    return null
                }

                return datas
            }

        // 노래 제목이 1 글자인 경우
        } else if (queryLength === 1) {
            if (reNameMv === ' mv') {
                const querySQL = `select distinct s.videoId, l.title, l.artist, l.album, l.lyrics from songlists s INNER JOIN lyricslists l ON (l.queryName = s.queryName) where s.queryName regexp '${query}{1}...$' and l.queryName regexp 'mv$' or l.artist like '${query}' and l.queryName regexp 'mv$' order by l.title asc;`;
                let queryResult = await models.sequelize.query(querySQL, { type : models.sequelize.QueryTypes.SELECT ,raw : true});
                
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

                let isEmpty = function(value) { 
                    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) { 
                        return true 
                    } else { 
                        return false 
                    }
                };

                if (isEmpty(queryResult)) {
                    return null
                }

                return datas

            } else if (reNameLive === ' live') {
                const querySQL = `select distinct s.videoId, l.title, l.artist, l.album, l.lyrics from songlists s INNER JOIN lyricslists l ON (l.queryName = s.queryName) where s.queryName regexp '${query}{1}.....$' and l.queryName regexp 'live$' or l.artist like '${query}' and l.queryName regexp 'live$' order by l.title asc;`;
                let queryResult = await models.sequelize.query(querySQL, { type : models.sequelize.QueryTypes.SELECT ,raw : true});
                
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

                let isEmpty = function(value) { 
                    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) { 
                        return true 
                    } else { 
                        return false 
                    }
                };

                if (isEmpty(queryResult)) {
                    return null
                }

                return datas

            } else {
                const querySQL = `select distinct s.videoId, l.title, l.artist, l.album, l.lyrics from songlists s INNER JOIN lyricslists l ON (l.queryName = s.queryName) where s.queryName regexp '${song}$' or s.queryName regexp '${song}{1}.mv$' or s.queryName regexp '${song}{1}.live$' or l.artist like '${song}' order by l.title asc;`;
                let queryResult = await models.sequelize.query(querySQL, { type : models.sequelize.QueryTypes.SELECT ,raw : true});
                
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

                let isEmpty = function(value) { 
                    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) { 
                        return true 
                    } else { 
                        return false 
                    }
                };

                if (isEmpty(queryResult)) {
                    return null
                }

                return datas

            }

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