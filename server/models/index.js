'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

let configs = {};
process.env.NODE_ENV === 'production' ? configs = require('../config/production') : configs = require('../config/development');

const sequelize = new Sequelize(configs.database, configs.username, configs.password, { host: configs.host, dialect: configs.dialect, timezone: '+09:00', 
    dialectOptions: {       // DB에 저장된 날짜 데이터 +09:00 하여 표기.
        charset: 'utf8mb4',
        dateStrings: true,
        typeCast: true
    } 
});

sequelize.authenticate().then(() => {
  console.log("Sequelize 연결 성공");
}).catch(err => {
  console.log("연결 실패: ", err);
});

fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
