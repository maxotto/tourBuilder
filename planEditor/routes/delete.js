const Path = require('path');
var express = require('express');
var router = express.Router();
const utils = require('../components/utils');
const Projects = require('../models/project-model');
const Fs = require('fs-extra');

router.delete('/floorImage/:id/:floorNumber', (req, res) => {
  const id = req.params.id;
  const floor = req.params.floorNumber;
  Projects.findById(req.params.id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      const folders = utils.getFoldersById(id, req.app.get('config'));
      const destFolder = Path.resolve(folders.source, 'custom');
      const index = project.floorSelect.findIndex((element, index, array) => {
        return (element.floor === floor);
      });
      if(index === -1){
        res.send({
          success: false,
          message: 'No item to delete.'
        })
      } else {
        const fileToDel = Path.resolve(destFolder, project.floorSelect[index].image) ;
        Fs.unlink(fileToDel)
          .then(result => {
            project.floorSelect.splice(index,1);
            project.markModified('floorSelect');
            if(project.floorSelect.length === 0){
              project.state.floorsImages = false;
              project.markModified('state.floorsImages');
            }
            project.save((error, p) => {
              if(!error){
                res.send({
                  success: true,
                  message: 'Deleted'
                });
              } else {
                res.send({
                  success: false,
                  message: error.message
                })
              }
            });

          })
          .catch(err =>{
            res.send({
              success: false,
              message: err
            })
          });
      }
    }
  });
});

module.exports = router;