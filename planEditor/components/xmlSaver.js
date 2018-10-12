const Fs = require('fs-extra');
const Xml2js = require('xml2js');
const Path = require('path');
module.exports = function (config, data) {
  const log = function(...args){
    console.log(...args);
  };
  // todo workPath depends on template used. Invent config for this
  const extPath = Path.resolve(config.outFolder,'ext/tour');
  const tourXmlPath = Path.resolve(config.outFolder,'tour.xml');
  const floorMapXmlPath = Path.resolve(extPath,'floorMap.xml');
  const floorMapXmlPath1 = Path.resolve(extPath,'floorMapTest.xml');
  const hotSpotParents = {};
  log('Xml writer created with config', config);

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
              resolve(result);
            }
          });
        }
      });
    });
  };

  const saveXml = function(xmlObject, file) {
    const builder = new Xml2js.Builder();
    const xmlText = builder.buildObject(xmlObject);
    return new Promise((resolve, reject) => {
      Fs.writeFile(file, xmlText, (err) => {
        if (err) {
          log(err);
          reject(err);
        } else {
          resolve(file, 'saved');
        }
      })
    });
  };

  const updateXml = function(xml, data){
    const hotspots = {};
    data.hotspots.forEach(hs=>{
      hotspots[hs.name] = hs;
    });
    xml.krpano.layer.forEach((l, i)=>{
      const layerName = l['$'].name;
      if (hotspots.hasOwnProperty(layerName)) {
        xml.krpano.layer[i]['$'] = {
          name: hotspots[layerName]['name'],
          style: hotspots[layerName]['style'],
          x: hotspots[layerName]['x'],
          y: hotspots[layerName]['y'],
          zorder: hotspots[layerName]['zorder'],
          onclick: hotspots[layerName]['onclick'],
          onclick: hotspots[layerName]['onclick'],
        }
      }
    });
    return(xml);
  };

  const writer = {};
  writer.write = function() {
    return loadXml(floorMapXmlPath)
      .then(xml => {
        const updated = updateXml(xml, data);
        return saveXml(updated, floorMapXmlPath);
      });
  };

  return writer;
};