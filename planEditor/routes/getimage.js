const Path = require('path');
var express = require('express');
var router = express.Router();

/* read data from XML. */
router.get('/', function(req, res, next) {
  const config = req.app.get('config');
  let fileName;
  if(req.query.image){
    fileName = Path.resolve(config.outFolder, 'ext/tour', req.query.image);
  }
  if(req.query.scene){
    fileName = Path.resolve(config.outFolder, 'panos', req.query.scene+'.tiles', 'thumb.jpg');
  }
  res.sendFile(fileName);
});

module.exports = router;