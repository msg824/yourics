const express = require('express');
const router = express.Router();
const configs = require('../devServer_secret');
const { google } = require('googleapis');

router.get('/', (req, res) => {
    res.json({ data: "I'm king." });
})

router.get('/search', async (req, res) => {
    const result = await blogger.blogs.get(params);
})

module.exports = router;