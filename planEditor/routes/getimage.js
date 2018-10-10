var express = require('express');
var router = express.Router();

/* read data from XML. */
router.get('/', function(req, res, next) {
  var config = req.app.get('config');
  res.send(req.query.image);
});

module.exports = router;