/**
 * 从 http://www.tianqi.com/air/ 抓取数据
 */
const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const user1 = require('./createModel');
const cheerio = require('cheerio');

// 用 superagent 去抓取内容
superagent.get('http://www.tianqi.com/air/')
    .charset('gbk')
    .end(function(err, sres) {
        if (err) {
            return next(err);
        }
        let $ = cheerio.load(sres.text);
        let cityList = $('.meta li');
        /* 更新表 */
        let userlatest = user1.model('latest');
        cityList.each(function(idx, element) {
            if (idx == 0) {
                return;
            }
            let $element = $(element);
            let city = $element.find('span').eq(1).find('a').text();
            let num = $element.find('span').eq(2).text();
            let situ = $element.find('span').eq(3).find('em').text();
            let where = {
                city: city
            };
            let upd = {
                num: num,
                situ: situ
            }
            userlatest.update(where, upd, function(err, res) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(idx + 'update success');
                }
            });
        });
        /* 存表 */
        let today = new Date();
        let collectionName = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':00';
        let user = user1.model(collectionName);
        // let CITY = user1.model('city');
        user.count({}, function(err, res) {
            if (err) {
                console.log("Error:" + err);
            } else {
                if (res == 0) {
                    let len = cityList.length - 1,
                        count = 0;
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
                                console.error(idx + err);
                            } else {
                                console.log(idx + 'save success');
                                count++;
                                if (count === len) {
                                    console.log('finished');
                                    // user1.connection.close();
                                }
                            }
                        });
                        /*(new CITY({city:city})).save(function(err, res) {
                            if (err) {
                                console.error(idx + err);
                            } else {
                                console.log(idx + 'save success');
                                count++;
                                if (count === len) {
                                    console.log('finished');
                                    // user1.connection.close();
                                }
                            }
                        });*/
                    });
                } else {
                    console.log(collectionName + '的数据已抓取.');
                    // user1.connection.close();
                }
            }
        });
    });
