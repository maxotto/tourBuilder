const Path = require('path');
var express = require('express');
var router = express.Router();

/* read data from XML. */
router.get('/', function(req, res, next) {
  var config = req.app.get('config');
  const fileName = Path.resolve(config.outFolder, 'ext/tour', req.query.image);
  console.log(fileName);
  res.sendFile(fileName);
});

module.exports = router;