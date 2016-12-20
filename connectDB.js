const mongoose = require('mongoose');
const uri = 'mongodb://localhost:10001/test';
let db = mongoose.connection;
db.on('error', function() {
    console.error('error.');
});
db.once('connected', function() {
    console.log('open.');
});
db.on('disconnected', function() {
    console.log('disconnected.');
});
mongoose.Promise = global.Promise;
mongoose.connect(uri);
// let user = 
module.exports = mongoose;