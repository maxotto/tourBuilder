const Path = require('path');
var express = require('express');
var router = express.Router();
const Projects = require('../models/project-model');

router.get('/list', function(req, res, next) {
  res.send({
    success: true,
    message: `List is here`,
  })
});

module.exports = router;