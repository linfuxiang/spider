const mongoose = require('./connectDB');
/**
 * 数据库字段描述
 * @tS {Object} 数据库对象集合
 * @city {String} 城市名
 * @num {String} 空气质量指数
 * @situ {String} 空气质量状况
 * @collectionName {String} 数据库集合（表）名
 */
let tS = new mongoose.Schema({
    city: { type: String },
    num: { type: String },
    situ: { type: String }
});
let today = new Date();
let collectionName = 'spidertest-' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':00';
// let collectionName = 'spidertest-' + parseInt(Math.random()*100);
// let user = 
module.exports = mongoose.model(collectionName, tS);
