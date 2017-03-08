const mongoose = require('./connectDB');
/**
 * 数据库字段描述
 * @tS {Object} 数据库对象集合
 * @un {String} 用户名
 * @pw {String} 密码
 * @collectionName {String} 数据库集合（表）名
 */
let tS = new mongoose.Schema({
    un: { type: String, index: { unique: true, dropDups: true }},
    pw: { type: String }
});

let createModel = function() {
    let collectionName = 'userList';
    return mongoose.model(collectionName, tS);
}
exports.createModel = createModel;
exports.connection = mongoose.connection;
