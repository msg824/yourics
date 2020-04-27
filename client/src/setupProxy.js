const proxy = require('http-proxy-middleware');

let configs = {};
process.env.NODE_ENV === 'development' ? configs = 'http://localhost:5000' : configs = '배포 IP주소';


module.exports = function(app) {
    app.use(proxy('/api', { target: 'http://localhost:5000' }));
}