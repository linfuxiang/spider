// const charset = require('superagent-charset');
// const superagent = charset(require('superagent'));
const superagent = require('superagent');
const user1 = require('./createGovModel');
const cheerio = require('cheerio');

let n = 1,
    max = 1;
let today = new Date();
let todayStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + (today.getDate() - 1),
    modelName = 'gov-' + todayStr + '_' + today.getHours() + ':00';
superagent.get('http://datacenter.mep.gov.cn/')
    // .charset('gbk')
    .end(function(err, sres) {
        if (err) {
            return next(err);
        }
        let $ = cheerio.load(sres.text);
        let cityList = $('.font12 tr').eq(1).find('td').text();
        max = Math.ceil(parseInt(cityList.split('，')[1].match(/\d+/)) / 30);
        let userlatest = user1.model(modelName);
        while (n <= max) {
            superagent.get('http://datacenter.mep.gov.cn/report/air_daily/air_dairy.jsp?city=&startdate=' + todayStr + '&enddate=' + todayStr + '&page=' + n)
                .end(function(err, sres) {
                    let $ = cheerio.load(sres.text);
                    let cityList = $('#report1 tr');
                    let trLen = cityList.length - 3;
                    cityList.each(function(idx, element) {
                        if (idx <= 1 || idx >= trLen) {
                            return;
                        }
                        let $element = $(element);
                        let city = $element.find('td').eq(1).text();
                        let num = $element.find('td').eq(3).text();
                        let situ = $element.find('td').eq(4).text();
                        let things = $element.find('td').eq(5).text();
                        let jsons = {
                            city: city,
                            num: num,
                            situ: situ,
                            things: things
                        };
                        (new userlatest(jsons)).save(function(err, res) {
                            if (err) {
                                console.error(idx + err);
                            } else {
                                console.log(idx + 'save success');
                            }
                        });
                    });
                });
            n++;
        }
    });
