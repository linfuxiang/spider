"use strict";
// const http = require('http');
// const express = require('express');
// const mongoose = require('mongoose');
const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const user = require('./createModel');
const cheerio = require('cheerio');
// let app = express();

// const uri = 'mongodb://localhost:10001/test';

// app.get('/', function(req, res){
// 用 superagent 去抓取 https://cnodejs.org/ 的内容
superagent.get('http://www.tianqi.com/air/')
    .charset('gbk')
    .end(function(err, sres) {
        if (err) {
            return next(err);
        }
        // let db = mongoose.connection;
        // db.on('error', function() {
        //     console.error('error.');
        // });
        // db.once('connected', function() {
        //     console.log('open.');
        // });
        // db.on('disconnected', function() {
        //     console.log('disconnected.');
        // });
        // mongoose.Promise = global.Promise;
        // mongoose.connect(uri);
        // let tS = new mongoose.Schema({
        //     city: { type: String },
        //     num: { type: String },
        //     situ: { type: String }
        // });

        // let today = new Date();
        // let collectionName = 'spidertest-' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate());
        // let user = mongoose.model(collectionName, tS);
        user.count({}, function(err, res) {
            if (err) {
                console.log("Error:" + err);
            } else {
                if (res == 0) {
                    let $ = cheerio.load(sres.text);
                    let cityList = $('.meta li');
                    let len = cityList.length - 1,
                        count = 0;
                    // 需要重新连接一次数据库
                    // mongoose.connect(uri);
                    cityList.each(function(idx, element) {
                        if (idx == 0) {
                            return;
                        }
                        let $element = $(element);
                        let city = $element.find('span').eq(1).find('a').text();
                        let num = $element.find('span').eq(2).text();
                        let situ = $element.find('span').eq(3).find('em').text();
                        let jsons = {
                            city: city,
                            num: num,
                            situ: situ
                        };
                        (new user(jsons)).save(function(err, res) {
                            if (err) {
                                console.error(err);
                            } else {
                                console.log('success');
                                count++;
                                if (count === len) {
                                    console.log('finished');
                                }
                            }
                        });
                    });
                } else {
                    console.log('今天的数据已抓取.');
                }
            }
            // db.close();
        });
        // db.close();
    });
// });

// app.listen('8088', ()=>{});

