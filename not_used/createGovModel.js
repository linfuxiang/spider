const mongoose = require('./connectDB');
/**
 * 数据库字段描述
 * @tS {Object} 数据库对象集合
 * @city {String} 城市名
 * @num {Number} 空气质量指数
 * @situ {String} 空气质量状况
 * @collectionName {String} 数据库集合（表）名
 */
let tS = new mongoose.Schema({
    city: { type: String },
    num: { type: Number },
    situ: { type: String },
    things: { type: String }
});
let today = new Date();
// let collectionName = 'spidertest-' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':00';
let createModel = function(collectionParams) {
    let collectionName = 'spidertest-' + collectionParams;
    return mongoose.model(collectionName, tS);
}
exports.model = createModel;
// exports.model = mongoose.model(collectionName, tS);
// exports.time = collectionName;
exports.connection = mongoose.connection;
