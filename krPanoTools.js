const Fs = require('fs-extra');
const Xml2js = require('xml2js');
const Path = require('path');

module.exports = function (xmlFile) {
  const log = function(...args){
    console.log(...args);
  };
  let xml = {};
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
              xml = result.krpano;
              resolve(result.krpano);
            }
          });
        }
      });
    });
  };

  const saveXml = function() {
    const builder = new Xml2js.Builder();
    const out = {
      krpano:xml
    };
    const xmlText = builder.buildObject(xml);
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

  const createTag = function(params, body) {
    const tag = {};
    tag['$'] = params;
    tag['_'] = body;
    return tag;
  };

  const exportTag = function(tagType, tagName){
    const i = findTagIndex(tagType, tagName);
    return {
      params: xml[tagType][i]['$'],
      body: xml[tagType][i]['_'],
    }
  };

  const findTagIndex = function(tagType, tagName){
    return xml[tagType].findIndex((tag) => {
      return (tag.name === tagName);
    });
  };

  const object = {};

  object.load = function(){
    return loadXml(xmlFile);
  };

  object.save = function(){
    return saveXml();
  };

  object.getTag = function(tagType, tagName){
    return exportTag(tagType, tagName);
  };

  object.setTag = function(tagType, tagName, params, body){
    params.name = tagName;
    const i = findTagIndex(tagType, tagName);
    const tag = createTag(params, body);
    if(i === -1){
      xml[tagType].push(tag);
    } else {
      xml[tagType][i] = tag;
    }
  };

  object.createTag = function(tagType, tagName, params, body){
    params.name = tagName;
    const tag = createTag(params, body);
    xml[tagType].push(tag);
  };

  return object;
};