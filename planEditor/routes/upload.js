const Path = require('path');
const express = require('express');
const os = require('os');
const router = express.Router();
const Projects = require('../models/project-model');
const fs = require('fs-extra');
const unzip = require('unzipper');
const fstream = require('fstream');
const utils = require('../components/utils');

router.post('/project/:id', (req, res, next) => {
  const id = req.params.id;
  const fields = {};
  Projects.findById(id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else if(!project){
      res.send({
        success: false,
        message: 'Project not found by ID.'
      })
    } else {
      req.busboy.on('field', (fieldname, value) => {
        fields[fieldname] = value;
      });
      req.busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
        const tmpZip = Path.join(os.tmpdir(), filename);
        file.pipe(fs.createWriteStream(tmpZip));
        const folders = utils.getFoldersById(id, req.app.get('config'));
        const destRoot = folders.source;
        fs.ensureDir(destRoot)
          .then(() =>{
            console.log(destRoot, 'exists');
            return fs.emptyDir(destRoot)
          }
        ).then(()=>{
          console.log(destRoot, 'is empty');
          return fs.createReadStream(tmpZip)
            .pipe(unzip.Extract({ path: destRoot })
              .on('entry', (entry) => {
                // console.log(entry.path);
              })
              .on('error', err => console.error('error', err))
              .on('finish', () => {
                console.log('Unzip finished');
                res.send({
                  success: true,
                  message: 'Uploded'
                });
                fs.removeSync(tmpZip);
                console.log(tmpZip, 'deleted');
              })
              .on('close', () => {
                // console.log('close')
              })
            );
        });
      });
      req.busboy.on('finish', () => {
        // console.log('busboy on finish');
      });
      req.pipe(req.busboy);
    }
  });
});

router.post('/floorImage/:id/:floorNumber', (req, res) => {
  const id = req.params.id;
  const floor = req.params.floorNumber;
  Projects.findById(id, (error, project) => {
    if (error) {
      res.send({
        success: false,
        message: error.message
      })
    } else {
      const folders = utils.getFoldersById(id, req.app.get('config'));
      const destFolder = Path.resolve(folders.source, 'custom');
      fs.ensureDirSync(destFolder);
      let fstream;
      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
        const parts = Path.parse(filename);
        const newFileName = 'floorMap' + floor + parts.ext;
        fstream = fs.createWriteStream(Path.resolve(destFolder,newFileName));
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