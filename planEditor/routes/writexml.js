var express = require('express');
var router = express.Router();

/* read data from XML. */
router.get('/', function(req, res, next) {
  res.send('WriteXml will respond with a resource');
});

module.exports = router;