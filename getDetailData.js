const urllib = require('url');
const express = require('express');
const user1 = require('./createLatestModel');
const user = user1.model;
let app = express();

const port = 10011;
const data = { 'name': 'jifeng', 'company': 'taobao' };

app.get('/', (req, res) => {
    let params = urllib.parse(req.url, true);
    console.log(params);
    user.find({}).sort({num: 1}).exec(function(err, r) {
        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + r);
            let output = {
                data: r,
                time: user1.time
            }
            if (params.query && params.query.callback) {
                let str = params.query.callback + '(' + JSON.stringify(output) + ')';    //jsonP
                res.end(str);
            } else {
                res.end(JSON.stringify(r)); //普通请求
            }
        } 
    });
})

app.listen(port, () => {
    console.log('server is listening on port ' + port);
});
