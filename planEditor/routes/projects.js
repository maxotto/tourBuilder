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

router.post('/create', (req, res) => {
  // var db = req.db;
  console.log(req.body);
  var new_project = new Projects({
    title: req.body.title,
    address: req.body.address,
    folder: req.body.folder,
    template: req.body.template,
    location: req.body.location,
  });

  new_project.save(function (error, data) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: `New project ID_${data._id} saved successfully!`
    })
  })
});

module.exports = router;