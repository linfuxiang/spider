/**
 * 从 http://www.pm25.in/rank 抓取数据
 * 定时操作：
 * 更新 aqi-latest 表的数据
 * 添加 aqi-[date&time] 新表
 */
const charset = require('superagent-charset');
const superagent = charset(require('superagent'));
const model = require('./createModel');
const cheerio = require('cheerio');

// 用 superagent 去抓取内容
superagent.get('http://www.pm25.in/rank')
    // .charset('gbk')
    .end(function(err, sres) {
        if (err) {
            return next(err);
        }
        let $ = cheerio.load(sres.text);
        let cityList = $('table.table tbody tr');
        /* 初始化aqi-latest表 */
        let modelLatest = model.createModel('latest');
        /* 初始化aqi-[date&time]表 */
        let today = new Date();
        let collectionName = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '_' + today.getHours() + ':00';
        let modelData = model.createModel(collectionName);

        let len = cityList.length,
            count1 = 0,
            count2 = 0;

        cityList.each(function(idx, element) {
            let $element = $(element);
            let city = $element.find('td').eq(1).find('a').text().replace(/(^\s*)|(\s*$)/g, "");
            let aqi = $element.find('td').eq(2).text();
            let situ = $element.find('td').eq(3).text();
            let pri = $element.find('td').eq(4).text().replace(/(^\s*)|(\s*$)/g, "");
            let pm25 = $element.find('td').eq(5).text();
            let pm10 = $element.find('td').eq(6).text();
            let co = $element.find('td').eq(7).text();
            let no2 = $element.find('td').eq(8).text();
            let o3 = $element.find('td').eq(9).text();
            let o3_8h = $element.find('td').eq(10).text();
            let so2 = $element.find('td').eq(11).text();
            let where = {
                city: city
            };
            let jsons = {
                city: city,
                aqi: aqi != '_' ? aqi : -1,
                situ: situ,
                pri: pri,
                pm25: pm25 != '_' ? pm25 : -1,
                pm10: pm10 != '_' ? pm10 : -1,
                co: co != '_' ? co : -1,
                no2: no2 != '_' ? no2 : -1,
                o3: o3 != '_' ? o3 : -1,
                o3_8h: o3_8h != '_' ? o3_8h : -1,
                so2: so2 != '_' ? so2 : -1
            };
            modelLatest.update(where, jsons, function(err, res) {
                if (err) {
                    console.error(`latest ${idx} ${err}`);
                } else {
                    console.log(`latest ${idx} updated`);
                    count1++;
                    console.log(count1, count2, len);
                    if (count1 == len && count2 == len) {
                        model.connection.close();
                    }
                }
            });
            (new modelData(jsons)).save(function(err, res) {
                if (err) {
                    console.error(`data ${idx} ${err}`);
                } else {
                    console.log(`data ${idx} saved`);
                    count2++;
                    console.log(count1, count2, len);
                    if (count1 == len && count2 == len) {
                        model.connection.close();
                    }
                }
            });
        });
    });
