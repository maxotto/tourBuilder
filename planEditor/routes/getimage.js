const Path = require('path');
var express = require('express');
var router = express.Router();
const utils = require('../components/utils');
const Projects = require('../models/project-model');

/* read data from XML. */
router.get('/', function(req, res, next) {
  const config = req.app.get('config');
  let fileName;
  if(req.query.image){
    fileName = Path.resolve(config.outFolder, 'ext/tour', req.query.image);
  }
  if(req.query.scene){
    if(req.query.vr){
      fileName = Path.resolve(config.outFolder, 'panos', req.query.scene+'.tiles','vr', 'pano_' + req.query.vr + '.jpg');
    } else {
      fileName = Path.resolve(config.outFolder, 'panos', req.query.scene+'.tiles', 'thumb.jpg');
    }
  }
  res.sendFile(fileName);
});

router.get('/fromtemplate/:id/floorselector/:floor/:state', function(req, res, next) {
  const id = req.params.id;
  const floor = req.params.floor;
  const state = req.params.state;
  const suffix = state.charAt(0).toUpperCase() + state.slice(1);
  Projects.findById(id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      const templatePath = utils.getImagePathByTemplate(project.template);
      const fileName = Path.resolve(templatePath, 'ext/tour', floor + 'Floor' + suffix + '.jpg',);
      console.log(fileName);
      res.sendFile(fileName);
    }
  });
});

router.get('/floormap/:id/:floor', function (req, res, next) {
  const id = req.params.id;
  const floor = req.params.floor;
  Projects.findById(id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      if (project === null ) {
        res.status(404)        // HTTP status 404: NotFound
          .send('Not found');
      } else {
        const index = project.floorSelect.findIndex((element, i, array) => {
          return (element.floor === floor);
        });
        if (index === -1) {
          res.status(404)        // HTTP status 404: NotFound
            .send('Not found');
        } else {
          const f = project.floorSelect[index].image;
          const fileName = Path.resolve(project.folder, 'custom', f);
          res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
          res.header('Expires', '-1');
          res.header('Pragma', 'no-cache');
          res.sendFile(fileName);
        }
      }
    }
  });
});

module.exports = router;