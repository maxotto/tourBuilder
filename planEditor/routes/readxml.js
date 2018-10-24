var express = require('express');
var router = express.Router();
var XmlReader = require('../components/xmlReader');

/* read data from XML. */
router.get('/', function(req, res, next) {
  var config = req.app.get('config');
  const reader = new XmlReader(config);
  reader.read()
  .then( (xml) => {
    const response = JSON.stringify(xml);
    res.send(response);
  });
});

module.exports = router;