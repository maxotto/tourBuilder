var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var readXmlRouter = require('./routes/readxml');
var writeXmlRouter = require('./routes/writexml');
var getImageRouter = require('./routes/getimage');

var app = express();
// var config = require('../localSettings');
app.set('config', config); 

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/readxml', readXmlRouter);
app.use('/writexml', writeXmlRouter);
app.use('/getimage', getImageRouter);

module.exports = app;
