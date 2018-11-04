const Path = require('path');
var express = require('express');
var router = express.Router();
const Projects = require('../models/project-model');

router.post('/floorImage/:id/:floorNumber', (req, res) => {
  const id = req.params.id;
  const floor = req.params.floorNumber;
  // todo reaup save to inFOLDER/custom
  Projects.findById(req.params.id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      res.send({
        success: true,
        project: project
      })
    }
  });

});

module.exports = router;