const express = require('express');
const router = express.Router();
const configs = require('../devServer_secret');
const { google } = require('googleapis');

const youtube = google.youtube({
    version: 'v3',
    auth: configs.youtubeApi
})

async function searchList(song) {
    try {
        const res = await youtube.search.list({
            part: 'snippet',
            q: song,
            maxResults: '1'
        });
    
        return res.data.items[0];
    } catch (error) {
        console.log('youtube search API Error', error)
    }
    
}

router.post('/search', async (req, res) => {
    const result = await searchList(req.body.song);
    res.send(result)
})

module.exports = router;