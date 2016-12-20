const urllib = require('url');
const express = require('express');
const user = require('./createModel');
let app = express();

const port = 10011;
const data = { 'name': 'jifeng', 'company': 'taobao' };

app.get('/', (req, res) => {
    let params = urllib.parse(req.url, true);
    console.log(params);
    user.find({}, function(err, r) {
        if (err) {
            console.log("Error:" + err);
        } else {
            console.log("Res:" + res);
            if (params.query && params.query.callback) {
                let str = params.query.callback + '(' + JSON.stringify(r) + ')';
                res.end(str);
            } else {
                res.end(JSON.stringify(r));
            }
        }
    })
    // if (params.query && params.query.callback) {
    //     let str = params.query.callback + '(' + JSON.stringify(data) + ')';
    //     res.end(str);
    // } else {
    //     res.end(JSON.stringify(data));
    // }
})

app.listen(port, () => {
    console.log('server is listening on port ' + port);
});
