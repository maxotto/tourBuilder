const Path = require('path');
var express = require('express');
var router = express.Router();
const Projects = require('../models/project-model');
const Fs = require('fs-extra');

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
      const destFolder = Path.resolve(project.folder, 'custom');
      Fs.ensureDirSync(destFolder);
      let fstream;
      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename);
        fstream = Fs.createWriteStream(Path.resolve(destFolder,filename));
        file.pipe(fstream);
        fstream.on('close', function () {
          res.send({
            success: true,
            project: project,
          });
        });
      });

    }
  });

});

module.exports = router;