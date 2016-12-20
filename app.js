const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const superagent = require('superagent');
const cheerio = require('cheerio');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
// mongoose.connect('mongodb://localhost:10001/test');

let db;

app.get('/', (req, res) => {
	res.sendFile('/var/www/node_mongodb/index.html');
	db = mongoose.connection;
	db.on('error', function(){
		res.send('error.');
	});
	db.once('open', function(){
		res.send('open.');
	});
	mongoose.connect('mongodb://localhost:10001/test');
	// res.send('Hello World');
});
app.post('/switchon', (req, res) => {
	res.send('Hello World');
});
// app.post('/switchoff', (req, res) => {
// 	let db = mongoose.connection;
// 	mongoose.connect('mongodb://localhost:10001/test');
// 	db.on('error', function(){
// 		res.send('error.');
// 	});
//     db.once('open', function(){
//     	res.send('open.');
//     });
// 	// res.send('Hello World');
// });
app.listen('8888', () => {

});