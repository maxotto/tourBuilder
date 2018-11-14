const Path = require('path');
var express = require('express');
var router = express.Router();
const KrPanoFile = require('../components/krPanoTools');
const Projects = require('../models/project-model');
const utils = require('../components/utils');

router.delete('/:id', function(req, res, next) {
  Projects.remove({_id: req.params.id}, err => {
    if (err) {
      res.sendStatus(500)
    } else {
      // todo delete folder too
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

router.get('/:id', function(req, res, next) {
  Projects.findById(req.params.id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      if(project){
        res.send({
          success: true,
          project: project
        })
      } else {
        res.send({
          success: false,
          message: 'Project not found by ID.'
        })
      }
    }
  });

} );

router.get('/:id/xml', function(req, res, next) {
  Projects.findById(req.params.id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      if (project) {
        const folders = utils.getFoldersById(req.params.id, req.app.get('config'));
        const tourFileName = Path.resolve(folders.source, 'tour.xml');
        const tourFileTool = new KrPanoFile(tourFileName);
        tourFileTool.load()
          .then(xml =>{
            res.send({
              success: true,
              xml: xml,
            })
          })
          .catch(error => {
            res.send({
              success: false,
              message: error.message
            })
          }
        );
      } else {
        res.send({
          success: false,
          message: 'Project not found by ID.'
        })
      }
    }
  });

} );

router.post('/:id/xml', function(req, res, next) {
  const id = req.params.id;
  const tour = req.body;
  Projects.findById(id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      const folders = utils.getFoldersById(req.params.id, req.app.get('config'));
      const tourFileName = Path.resolve(folders.source, 'tour.xml');
      const tourFileTool = new KrPanoFile(tourFileName);
      tourFileTool.save(tour)
        .then(xml =>{
          const newState = tourFileTool.getState(project);
          console.log(newState);
          project.state = newState;
          project.markModified('state.floors');
          project.markModified('state.hotspots');
          project.save((error, p) => {
            if(!error){
              res.send({
                success: true,
                message: 'Saved'
              })
            } else {
              res.send({
                success: false,
                message: error.message
              })
            }
          });
      })
        .catch(error => {
          res.send({
            success: false,
            message: error.message
          })
        });
    }
  });

});

router.post('/create', (req, res) => {
  // var db = req.db;
  console.log(req.body);
  var new_project = new Projects({
    title: req.body.title,
    address: req.body.address,
    template: req.body.template,
    location: req.body.location,
    state: req.body.state,
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
  Projects.findById(req.params.id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      project.title = req.body.title;
      project.address = req.body.address;
      project.template = req.body.template;
      project.location = req.body.location;
      project.state = req.body.state;
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