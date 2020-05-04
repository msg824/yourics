const express = require('express');
const app = express();
const axios = require('axios');
const { google } = require('googleapis');

// 환경변수가 production 이 아닐 경우 development
process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';

let configs = {};
process.env.NODE_ENV === 'development' ? configs = require('./devServer_secret') : configs = require('./Server_secret');

// router 정의
const youtubeApi = require('./routes/youtubeApi');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/youtube', youtubeApi);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

// // API 할당량 테스트
// const youtube = google.youtube({
//     version: 'v3',
//     auth: configs.youtubeApi
// })

// async function searchList(song) {
//     try {
//         const res = await youtube.search.list({
//             part: 'id',
//             q: 'counting stars',
//             maxResults: '1',
//             type: 'video',
//             fields: 'items(id(videoId))'
//         });
    
//         console.log('res.data', res.data)
//         console.log('res.data.items', res.data.items[0]);
//     } catch (error) {
//         console.log('youtube search API Error', error)
//     }
    
// }

// searchList();