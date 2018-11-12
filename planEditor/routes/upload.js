const Path = require('path');
var express = require('express');
const os = require('os');
var router = express.Router();
const Projects = require('../models/project-model');
const Fs = require('fs-extra');

router.post('/project/:id', (req, res, next) => {
  const id = req.params.id;
  let uploadedFile;
  let saveTo;
  const fields = {};
  Projects.findById(req.params.id, (error, project) => {
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
        // console.log(fieldname,'=', value);
        fields[fieldname] = value;
      });
      req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        // console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
        uploadedFile = file;
        // console.log(fields);
        const rPath = fields.relativePath.substr(fields.relativePath.indexOf('/')+1);
        const parts = Path.parse(rPath);
        // console.log(parts);
        const destRoot = 'E:/aaa';
        const destFolder = Path.join(destRoot, parts.dir);
        Fs.ensureDir(destFolder)
          .then(() => {
            saveTo = Path.join(destRoot, rPath);
            uploadedFile.pipe(Fs.createWriteStream(saveTo));
            res.send({
              success: true,
              message: 'Uploded'
            })
          })
          .catch(err => {
            console.error(err);
            res.send({
              success: false,
              message: err.message
            })

          });
      });
      req.pipe(req.busboy);
      /*
      req.pipe(req.busboy);
      req.busboy.on('file', function (fieldname, file, filename) {
        console.log({fieldname});
        console.log({file});
        console.log({filename});
      });
      req.busboy.on('finish', function() {
        console.log('Upload complete');
        res.writeHead(200, { 'Connection': 'close' });
        res.end("That's all folks!");
      });
      return req.pipe(req.busboy);
      */
    }
  });
});

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