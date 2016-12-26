const urllib = require('url');
const express = require('express');
const spiderModel = require('./createModel');
const userModel = require('./createUserModel');
let app = express();

const port = 10011;

app.get('/', (req, res) => {
    let params = urllib.parse(req.url, true);
    console.log(params);
    let spider = spiderModel.model(params.query.reqCollection),
        area = params.query.reqArea;
    spider.find({ city: new RegExp('^' + area + '[\u4e00-\u9fa5]*$') }).sort({ num: 1 }).exec(function(err, r) {
        if (err) {
            console.log("Error:" + err);
        } else {
            // console.log("Res:" + r);
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

app.get('/signup', (req, res) => {
    let params = urllib.parse(req.url, true);
    let user = userModel.model(params.query.reqCollection),
        un = params.query.un,
        pw = params.query.pw;
    (new user({ un: un, pw: pw })).save(function(err, r) {
        if (err) {
            console.log("Error:" + err);
            let output = {
                status: 11000
            };
            if (err.code == 11000) {
                if (params.query && params.query.callback) {
                    let str = params.query.callback + '(' + JSON.stringify(output) + ')'; //jsonP
                    res.end(str);
                } else {
                    res.end(JSON.stringify(output)); //普通请求
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
                res.end(str);
            } else {
                res.end(JSON.stringify(output)); //普通请求
            }
        }
    });
});

app.get('/signin', (req, res) => {
    let params = urllib.parse(req.url, true);
    let user = userModel.model(params.query.reqCollection),
        un = params.query.un,
        pw = params.query.pw;
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
                    res.end(str);
                } else {
                    res.end(JSON.stringify(output)); //普通请求
                }
            } else {
                let output = {
                    status: 11000
                }
                if (params.query && params.query.callback) {
                    let str = params.query.callback + '(' + JSON.stringify(output) + ')'; //jsonP
                    res.end(str);
                } else {
                    res.end(JSON.stringify(output)); //普通请求
                }
            }
        }
    });
});

app.listen(port, () => {
    console.log('server is listening on port ' + port);
});
