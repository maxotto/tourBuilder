const Path = require('path');
var express = require('express');
var router = express.Router();
const Projects = require('../models/project-model');

router.delete('/:id', function(req, res, next) {
  Projects.remove({_id: req.params.id}, err => {
    if (err) {
      res.sendStatus(500)
    } else {
      res.sendStatus(200)
    }
  });
});


router.get('/list', function(req, res, next) {
  const query = Projects.find();
  query.exec((err, items) => {
    res.send({
      success: true,
      message: `List is here`,
      items: items,
    });
  });
});

router.post('/create', (req, res) => {
  // var db = req.db;
  console.log(req.body);
  var new_project = new Projects({
    title: req.body.title,
    address: req.body.address,
    folder: req.body.folder,
    outFolder: req.body.outFolder,
    template: req.body.template,
    location: req.body.location,
  });

  new_project.save(function (error, data) {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      res.send({
        success: true,
        message: `New project ID_${data._id} saved successfully!`
      })
    }
  })
});

router.put('/:id', (req, res, next) => {
  Projects.findById(req.params.id, 'title, address, folder, outFolder, template, location', (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      project.title = req.body.title;
      project.address = req.body.address;
      project.folder = req.body.folder;
      project.outFolder = req.body.outFolder;
      project.template = req.body.template;
      project.location = req.body.location;
      project.save(error => {
        if (error) {
          res.send({
            success: false,
            message: error.message
          })
        } else {
          res.send({
            success: true,
            message: 'saved'
          })
        }
      })
    }
  });
});

module.exports = router;