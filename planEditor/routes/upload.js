const Path = require('path');
var express = require('express');
var router = express.Router();

router.post('/floorImage/:id/:floorNumber', (req, res) => {
  console.log(req.body);
  res.send({
    success: true,
    message: 'Upload works'
  })
});

module.exports = router;