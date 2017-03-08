const mongoose = require('./connectDB');
/**
 * 数据库字段描述
 * @tS {Object} 数据库对象集合
 * 
 * @city {String} 城市名
 * @aqi {Number} aqi数值
 * @situ {String} 空气质量状况
 * @pri {String} 首要污染物
 * @pm25 {Number} 首要污染物
 * @pm10 {Number} 首要污染物
 * @co {Number} 首要污染物
 * @no2 {Number} 首要污染物
 * @o3 {Number} 首要污染物
 * @o3_8h {Number} 首要污染物
 * @so2 {Number} 首要污染物
 * 
 * @collectionName {String} 数据库集合（表）名
 */
let tS = new mongoose.Schema({
    city: { type: String },
    aqi: { type: Number },
    situ: { type: String },
    pri: { type: String },
    pm25: { type: Number },
    pm10: { type: Number },
    co: { type: Number },
    no2: { type: Number },
    o3: { type: Number },
    o3_8h: { type: Number },
    so2: { type: Number }
});
let createModel = function(collectionParams) {
    let collectionName = 'aqi-' + collectionParams;
    return mongoose.model(collectionName, tS);
}
exports.createModel = createModel;
exports.connection = mongoose.connection;