var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
const cors = require('cors');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
require('log-timestamp');


var indexRouter = require('./routes/index');
var readXmlRouter = require('./routes/readxml');
var writeXmlRouter = require('./routes/writexml');
var getImageRouter = require('./routes/getimage');
var projectsRouter = require('./routes/projects');
var readfolderRouter = require('./routes/readfolder');
var uploadRouter = require('./routes/upload');

var app = express();
const config = require('./config/config');
app.set('config', config);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(config.dbURL, config.dbOptions);

mongoose.connection
  .once('open', () => {
    console.log(`Mongoose - successful connection ...`);
  })
  .on('error', error => console.warn(error));

app.use('/', indexRouter);
app.use('/readxml', readXmlRouter);
app.use('/writexml', writeXmlRouter);
app.use('/getimage', getImageRouter);
app.use('/projects', projectsRouter);
app.use('/readfolder', readfolderRouter);
app.use('/upload', uploadRouter);

module.exports = app;
