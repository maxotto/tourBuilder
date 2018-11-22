const express = require('express');
const router = express.Router();
const Projects = require('../models/project-model');
const utils = require('../components/utils');

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
        build(config);
      } else {
        res.send({
          success: false,
          message: 'Project not found by ID.'
        })
      }
    }
  });

} );

const build = function(config){
  const Builder = require(config.templatesFolder+'/tourBuilder');
  const myBuilder = Builder(config, ftp_deploy);
  myBuilder.run()
    .then(res => {
      console.log(res, 'Build finished.');console.log("\007");
    })
    .catch(err => {
      console.log(err);
    });

}
