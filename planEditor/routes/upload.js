const Path = require('path');
var express = require('express');
var router = express.Router();
const Projects = require('../models/project-model');
const Fs = require('fs-extra');

router.post('/floorImage/:id/:floorNumber', (req, res) => {
  const id = req.params.id;
  const floor = req.params.floorNumber;
  Projects.findById(req.params.id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      const destFolder = Path.resolve(project.folder, 'custom');
      Fs.ensureDirSync(destFolder);
      let fstream;
      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
        const parts = Path.parse(filename);
        const newFileName = 'floorMap' + floor + parts.ext;
        fstream = Fs.createWriteStream(Path.resolve(destFolder,newFileName));
        file.pipe(fstream);
        fstream.on('close', function () {
          if(!project.floorSelect) {
            project.floorSelect = [];
          }
          const index = project.floorSelect.findIndex((element, index, array) => {
            return (element.floor === floor);
          });
          if(index === -1){
            project.floorSelect.push(
              {
                floor: floor,
                image: newFileName,
              }
            );
          } else {
            project.floorSelect[index].image = newFileName;
            project.markModified('floorSelect');
          }
          project.save((error, p) => {
            if(!error){
              res.send({
                success: true,
                project: p,
              });
            } else {
              res.send({
                success: false,
                message: error.message,
                project: p,
              })
            }
          });
        });
      });

    }
  });

});

module.exports = router;