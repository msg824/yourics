const express = require('express');
const router = express.Router();

// youtube api key : AIzaSyAdXm-2xV5ECTYdEYU1CqvRSV7LihEpa8g

router.get('/', (req, res) => {
    res.json({ data: 'this is index' });
})

module.exports = router;