"use strict";
var http = require('http');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require('cors');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
require('log-timestamp');
const busboy = require('connect-busboy');
const config = require('./config/config');


var indexRouter = require('./routes/index');
var readXmlRouter = require('./routes/readxml');
var writeXmlRouter = require('./routes/writexml');
var getImageRouter = require('./routes/getimage');
var projectsRouter = require('./routes/projects');
var readfolderRouter = require('./routes/readfolder');
var uploadRouter = require('./routes/upload');
var deleteRouter = require('./routes/delete');
var buildRouter = require('./routes/build');

module.exports = function(port, db) {
  var app = express();
  app.set('port', port);
  app.set('config', config);

  app.use(busboy());
  app.use(bodyParser.json()); // support json encoded bodies
  app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

  app.use(logger('dev'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(cors());

  app.use('/', indexRouter);
  app.use('/readxml', readXmlRouter);
  app.use('/writexml', writeXmlRouter);
  app.use('/getimage', getImageRouter);
  app.use('/projects', projectsRouter);
  app.use('/readfolder', readfolderRouter);
  app.use('/upload', uploadRouter);
  app.use('/delete', deleteRouter);
  app.use('/build', buildRouter);
  var server = http.createServer(app);
  const io = require('./socket')(server, app);
  return server;
};

