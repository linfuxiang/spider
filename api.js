const urllib = require('url');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');
const https = require('https');

const aqiModel = require('./createModel');
const userModel = require('./createUserModel');
const disModel = require('./createDiscussionModel');

const app = express();

const port = 8888;
const getWeatherKey = '6vshvs4sm5svzwtk';

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var options = {
    key: fs.readFileSync('/root/apache-conf/3_www.superlfx.cn.key', 'utf8'),
    cert: fs.readFileSync('/root/apache-conf/2_www.superlfx.cn.crt', 'utf8'),
    ca: fs.readFileSync('/root/apache-conf/1_root_bundle.crt', 'utf8')
}
var server = https.createServer(options, app).listen(port, function() {
    console.log('listening on ', port)
});

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Origin', 'https://www.superlfx.cn');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'POST, GET');
    res.header("X-Powered-By", '3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    // if (req.method == 'OPTIONS') {
    // res.send(200);
    // } else {
    next();
    // }
});

// app.use(express.static(path.join(__dirname, './')));

// app.get('/', (req, res) => {
//     res.sendFile('/var/www/node_mongodb/index.html');
// });

app.get('/getWeather', (req, res) => {
    let params = urllib.parse(req.url, true);
    let obj = {};
    let aqi = aqiModel.createModel('latest');
    let promise0 = new Promise(function(resolve, reject) {
        aqi.find({ city: new RegExp('^' + params.query.location + '[\u4e00-\u9fa5]*$') }, { '_id': 0, '__v': 0 }).sort({ aqi: 1 }).exec(function(err, r) {
            if (err) {
                console.log("Error:" + err);
                reject(res.send(err));
            } else {
                obj.now = {
                    aqi: r[0].aqi,
                    situ: r[0].situ,
                }
                resolve()
            }
        });
    });
    let promise1 = new Promise(function(resolve, reject) {  //获取最新天气情况
        https.get(`https://api.seniverse.com/v3/weather/now.json?key=${getWeatherKey}&location=${encodeURIComponent(params.query.location)}&days=3`, (ress) => {
            ress.on('data', (d) => {
                let r = JSON.parse(d.toString()).results[0].now;
                obj.now.code = r.code;
                obj.now.temperature = r.temperature;
                obj.now.text = r.text;
                resolve(promise0);
            });
        }).on('error', function(e) {
            reject(res.send(e));
        });
    });
    let promise2 = new Promise(function(resolve, reject) {  //获取最近几日天气情况
        https.get(`https://api.thinkpage.cn/v3/weather/daily.json?key=${getWeatherKey}&location=${encodeURIComponent(params.query.location)}&days=3`, (ress) => {
            ress.on('data', (d) => {
                obj.daily = JSON.parse(d.toString()).results[0];
                resolve(promise1);
            });
        }).on('error', function(e) {
            reject(res.send(e));
        });
    });
    let promise3 = new Promise(function(resolve, reject) {  //获取建议
        https.get(`https://api.thinkpage.cn/v3/life/suggestion.json?key=${getWeatherKey}&location=${encodeURIComponent(params.query.location)}&days=3`, (ress) => {
            ress.on('data', (d) => {
                obj.suggestion = JSON.parse(d.toString()).results[0];
                resolve(promise2);
            });
        }).on('error', function(e) {
            reject(res.send(e));
        });
    });
    promise3.then((d) => {
        res.send(obj)
        // console.log('obj: ', obj);
    })

});

app.get('/getData', (req, res) => {
    let params = urllib.parse(req.url, true);
    let aqi = aqiModel.createModel(params.query.reqCollection),
        area = params.query.reqArea;
    // let aqi = aqiModel.createModel(req.body.reqCollection),
    //     area = req.body.reqArea;
    aqi.find({ city: new RegExp('^' + area + '[\u4e00-\u9fa5]*$') }, { '_id': 0, '__v': 0 }).sort({ aqi: 1 }).exec(function(err, r) {
        if (err) {
            console.log("Error:" + err);
        } else {
            let output = {
                data: r,
                time: params.query.reqCollection
            }
            if (params.query && params.query.callback) {
                let str = params.query.callback + '(' + JSON.stringify(output) + ')'; //jsonP
                res.end(str);
            } else {
                res.end(JSON.stringify(output)); //普通请求
            }
        }
    });
});

app.post('/signup', (req, res) => {
    let params = urllib.parse(req.url, true);
    let user = userModel.createModel(),
        // un = params.query.un,
        // pw = params.query.pw;
        un = req.body.un,
        pw = req.body.pw;
    (new user({ un: un, pw: pw })).save(function(err, r) {
        if (err) {
            console.log("Error:" + err);
            let output = {
                status: 11000
            };
            if (err.code == 11000) {
                if (params.query && params.query.callback) {
                    let str = params.query.callback + '(' + JSON.stringify(output) + ')'; //jsonP
                    res.send(str);
                } else {
                    res.send(JSON.stringify(output)); //普通请求
                }
            }
        } else {
            console.log(r);
            let output = {
                un: un,
                status: 200
            };
            if (params.query && params.query.callback) {
                let str = params.query.callback + '(' + JSON.stringify(output) + ')'; //jsonP
                res.send(str);
            } else {
                res.send(JSON.stringify(output)); //普通请求
            }
        }
    });
});

app.post('/signin', (req, res) => {
    let params = urllib.parse(req.url, true);
    let user = userModel.createModel(),
        // un = params.query.un,
        // pw = params.query.pw;
        un = req.body.un,
        pw = req.body.pw;
    console.log(un, pw);
    user.find({ un: un, pw: pw }).exec(function(err, r) {
        if (err) {
            console.log("Error:" + err.code);
        } else {
            if (r.length > 0) {
                let output = {
                    un: un,
                    status: 200
                }
                if (params.query && params.query.callback) {
                    let str = params.query.callback + '(' + JSON.stringify(output) + ')'; //jsonP
                    res.send(str);
                } else {
                    res.send(JSON.stringify(output)); //普通请求
                }
            } else {
                let output = {
                    status: 11000
                }
                if (params.query && params.query.callback) {
                    let str = params.query.callback + '(' + JSON.stringify(output) + ')'; //jsonP
                    res.send(str);
                } else {
                    res.send(JSON.stringify(output)); //普通请求
                }
            }
        }
    });
});

app.get('/getAllCity', (req, res) => {
    let params = urllib.parse(req.url, true);
    let CITY = aqiModel.createModel('citylist');
    // un = req.body.un,
    // pw = req.body.pw;
    CITY.find({}, { '_id': 0, '__v': 0 }).sort({ city: 1 }).exec(function(err, r) {
        if (err) {
            console.log("Error:" + err.code);
        } else {
            r = r.map(function(val, idx) {
                return val.city
            });
            if (params.query && params.query.callback) {
                let str = params.query.callback + '(' + JSON.stringify(r) + ')'; //jsonP
                res.end(str);
            } else {
                res.end(JSON.stringify(r)); //普通请求
            }
        }
    });
});

app.post('/discussion', (req, res) => {
    let dis = disModel.createModel();
    let params = req.body;
    if(params.submit) {
        (new dis({
            user: params.user,
            area: params.area,
            content: params.content,
            timestamp: params.timestamp
        })).save(function(err, r) {
            if (err) {
                console.log("Error:" + err);
                let output = {
                    status: 11000
                };
                if (err.code == 11000) {
                    res.send(JSON.stringify(output));
                }
            } else {
                console.log(r);
                let output = {
                    status: 200
                };
                res.send(JSON.stringify(output));
            }
        });
    } else {
        dis.find({}, { '_id': 0, '__v': 0 }).exec((err, r) => {
            if(err) {
                console.log("Error:" + err.code);
            } else {
                res.end(JSON.stringify(r));
                // console.log(r)
            }
        });
    }
    
});