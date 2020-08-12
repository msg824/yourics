const express = require('express');
const app = express();
const axios = require('axios');
const sequelize = require('./models').sequelize;

let configs = {};
process.env.NODE_ENV === 'production' ? configs = require('./config/production') : configs = require('./config/development');

// router 정의
const youtubeApi = require('./routes/youtubeApi');
const crawling = require('./routes/crawling');
const dbFront = require('./routes/dbFront');
const rank = require('./routes/rank');
const searchList = require('./routes/searchList');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/youtube', youtubeApi);
app.use('/crawling', crawling);
app.use('/dbFront', dbFront);
app.use('/rank', rank);
app.use('/searchList', searchList);

const port = process.env.PORT || 5000;

sequelize.sync({ force: false }).then(() => {
    app.listen(port, () => console.log(`Listening on port ${port}`));
})