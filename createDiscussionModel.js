const mongoose = require('./connectDB');
/**
 * 数据库字段描述
 * @tS {Object} 数据库对象集合
 * @user {String} 用户名
 * @area {String} 地区
 * @timestamp {String} 时间戳
 * @content {String} 内容
 * 
 * @collectionName {String} 数据库集合（表）名
 */
let tS = new mongoose.Schema({
    user: { type: String },
    area: { type: String },
    timestamp: {type: String },
    content: { type: String }
});
let createModel = function(collectionParams) {
    let collectionName = 'discussion';
    return mongoose.model(collectionName, tS);
}
exports.createModel = createModel;
exports.connection = mongoose.connection;