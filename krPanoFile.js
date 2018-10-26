const Fs = require('fs-extra');
const Xml2js = require('xml2js');

module.exports = function (xmlFile) {
  const log = function(...args){
    console.log(...args);
  };
  const loadXml = function(file) {
    var parser = new Xml2js.Parser();
    return new Promise((resolve, reject) => {
      Fs.readFile(file, function(err, data) {
        if (err) {
          reject(err)
        } else {
          parser.parseString(data, function (err, result) {
            if (err) {
              reject(err);
            } else {
              resolve(result.krpano);
            }
          });
        }
      });
    });
  };

  const saveXml = function(xml) {
    const builder = new Xml2js.Builder();
    const out = {
      krpano:xml
    };
    const xmlText = builder.buildObject(out);
    return new Promise((resolve, reject) => {
      Fs.writeFile(xmlFile, xmlText, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve('done');
        }
      })
    });
  };

  const object = {};

  object.load = function(){
    return loadXml(xmlFile);
  };

  object.save = function(xml){
    return saveXml(xml);
  };

  return object;
};