const Projects = require('../models/project-model');
const utils = require('../components/utils');

module.exports = function(io) {
  const express = require('express');
  const router = express.Router();

  router.get('/:id', function(req, res, next) {
    Projects.findById(req.params.id, (error, project) => {
      if (error) {
        res.send({
          success: false,
          message: error.message
        })
      } else {
        if(project){
          const folders = utils.getFoldersById(req.params.id, req.app.get('config'));
          const config = {
            // todo https://stackoverflow.com/questions/29872317/express-4-routes-using-socket-io
            socket: io,
            inFolder: folders.source,
            outFolder: folders.final,
            templatesFolder: utils.getImagePathByTemplate(project.template),
            googleApiKey: 'AIzaSyARIMiX_C7rE4U-pM6nih2n2z2z0YfhrfY',
            showMap: project.showMap,
            useCustomMap: project.useCustomMap,
            language: project.language,
            loadingtext: project.loadingtext,
            googleMapUnits: project.googleMapUnits,
            mapCenter: {
              lat: project.location.lat,
              lng: project.location.lng
            },
            useFixedZoom: project.useFixedZoom,
            iniZoom: project.iniZoom,
            title: project.title,
            floorMapShift:{
              x: 0,
              y: 60,
            },
            floorSelect: project.floorSelect,
          };
          buildMe(config)
            .then(()=>{
              // todo set BUILT state to true and save project
              project.state.built = true;
              project.state.lookatTag = true;
              project.markModified('state.built');
              project.markModified('state.lookatTag');
              project.save((error, p) => {
                if(!error){
                  res.send({
                    success: true,
                    message: 'Built'
                  })
                } else {
                  res.send({
                    success: false,
                    message: error.message
                  })
                }
              });
            })
            .catch((err)=>{
              res.send({
                success: false,
                message: err
              });
              console.log(err);
            });
        } else {
          res.send({
            success: false,
            message: 'Project not found by ID.'
          })
        }
      }
    });

  } );

  return router;
};

const buildMe = function(config){
  const Builder = require(config.templatesFolder+'/tourBuilder');
  const myBuilder = Builder(config, undefined);
  return myBuilder.run();

};
