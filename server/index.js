const express = require('express');
const app = express();
const axios = require('axios');
const { google } = require('googleapis');

process.env.NODE_ENV = ( process.env.NODE_ENV && ( process.env.NODE_ENV ).trim().toLowerCase() == 'production' ) ? 'production' : 'development';

let configs = {};
process.env.NODE_ENV === 'development' ? configs = require('./devServer_secret') : configs = '배포 IP주소';

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

const apiTest = google.youtube({
    version: 'v3',
    auth: configs.youtubeApi
})

// console.log(apiTest)