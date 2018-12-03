var express = require('express');
var router = express.Router();
var XmlReader = require('../components/xmlReader');

/* read data from XML. */
router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  // console.log(req.params);
  var config = req.app.get('config');
  const reader = new XmlReader(config, id);
  reader.read()
  .then( (xml) => {
    const response = JSON.stringify(xml);
    res.send(response);
  });
});

module.exports = router;