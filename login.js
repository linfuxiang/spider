const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const superagent = require('superagent');
const cheerio = require('cheerio');
const app = express();
const uri = 'mongodb://localhost:10001/test';

app.use(express.static(path.join(__dirname, 'public')));
// mongoose.connect('mongodb://localhost:10001/test');

let db;

app.get('/', (req, res) => {
	res.sendFile(__dirname + 'index.html');
	db = mongoose.connection;
	db.on('error', function(){
		res.send('error.');
	});
	db.once('open', function(){
		res.send('open.');
	});
	mongoose.connect(uri);
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