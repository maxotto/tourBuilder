const Path = require('path');
const express = require('express');
const router = express.Router();
const KrPanoFile = require('../components/krPanoTools');
const Projects = require('../models/project-model');
const utils = require('../components/utils');
const fs = require('fs-extra');

router.get('/build/:id', function(req, res, next) {
  Projects.findById(req.params.id, (error, project) => {
    if (error) {
      res.sendStatus(404);
    } else {
      const builder = require('../components/builder');
      builder.run(project)
      .then(p => {
        console.log({p});
        res.send({
          success: true,
          message: `Build is passed`,
          project: p,
        });
      }
      );
    }
  });
});

router.delete('/:id', function(req, res, next) {
  Projects.remove({_id: req.params.id}, err => {
    if (err) {
      res.sendStatus(500)
    } else {
      // todo delete folder too
      const folders = utils.getFoldersById(req.params.id, req.app.get('config'));
      const projectRoot = folders.root;
      fs.remove(projectRoot)
        .then(
          () => {
            res.sendStatus(200)
          }
        )
        .catch(err => {
          console.error(err);
          res.sendStatus(500);
        });
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
  res.send({
    success: false,
    message: 'Deprecated call'
  });
  return;
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
    showMap: req.body.showMap,
    useCustomMap: req.body.useCustomMap,
    language: req.body.language,
    loadingtext: req.body.loadingtext,
    googleMapUnits: req.body.googleMapUnits,
    useFixedZoom: req.body.useFixedZoom,
    iniZoom: req.body.iniZoom,
    state: req.body.state,
    tour: req.body.tour,
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
      project.showMap = req.body.showMap;
      project.useCustomMap = req.body.useCustomMap;
      project.language = req.body.language;
      project.loadingtext = req.body.loadingtext;
      project.googleMapUnits = req.body.googleMapUnits;
      project.useFixedZoom = req.body.useFixedZoom;
      project.iniZoom = req.body.iniZoom;
      project.state = req.body.state;
      project.tour = req.body.tour;
      console.log(project);
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