const Fs = require('fs-extra');
const Xml2js = require('xml2js');
const Path = require('path');
module.exports = function (config) {
    const log = function(...args){
        console.log(...args);
    };
    // todo workPath depends on template used. Invent config for this
    const extPath = Path.resolve(config.outFolder,'ext/tour');
    const tourXmlPath = Path.resolve(config.outFolder,'tour.xml');
    const floooMapXmlPath = Path.resolve(extPath,'floorMap.xml');
    const hotSpotParents = {};
    log('Xml reader created with config', config);
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

    const parseXml = function(xml) {
        const out = {};
        xml.krpano.layer.forEach(layer => {
            if (layer['$']['name'].indexOf('map_') >= 0) {
                out[layer['$']['name']] = {
                    floor: layer['$']['floor'], 
                    image: layer['$']['url'],
                    hotspots: []
                }        
            }        
        });
        for(let map in out){
            if (out.hasOwnProperty(map)) {
                xml.krpano.layer.forEach(layer => {
                    const s = 'spot' + out[map]['floor'];
                    // log(map, s);
                    if (layer['$']['name'].indexOf(s) >= 0) {
                        out[map]['hotspots'].push(
                            layer['$']
                        );
                    }        
                });
            }
        }
        return out;
    };

    const addParentInfo = function(data, tourXml){
      // console.log(tourXml.krpano['scene']);
      for (f in data) {
        if (data.hasOwnProperty(f)) {
          data[f]['hotspots'].forEach((hs, i) => {
            data[f]['hotspots'][i]['parent'] = findParentScene(hs.name, tourXml);
          });
        }
      }
      return data;
    };

    const findParentScene = function(hsName, tourXml) {
      if (!hotSpotParents.hasOwnProperty(hsName)) {
        tourXml.krpano['scene'].forEach(s => {
          let scene = s['$'];
          let onstart = scene.onstart;
          let pos = onstart.indexOf('updateradar(spot');
          if (pos >= 0){ // the scene has hotspot
            let commaPos = onstart.indexOf(',');
            hsn = onstart.substring(pos+12, commaPos);
            let angle = onstart.substring(commaPos+1, onstart.length-2);
            hotSpotParents[hsn] = {
              name: scene.name,
              angle: Number(angle)
            };
          }
        });
      }
      return hotSpotParents[hsName];

    };
    const reader = {};
    reader.read = function() {
/***
 * из папки outFolder считать XML файлы, содержащие сведения о расположении хотспотов на карте.
 * 1 - тут надо ориентироваться на версию шаблона. в разных версиях файлы лежат в разных папках
 * 2 - файл tour.xml - основной файл тура. Туда мы потом поместим информацию о напрвлении радара хотспотов. То есть - считывать его не надо
 * 3 - файл \tour\ext\tour\floorMap.xml. Отсюда берем url картинки плана, url картинок хотспотов, а также перечень этих хотспотов с исходными координатами
 */
        let data = undefined;
        return loadXml(floooMapXmlPath)
        .then(xml => {
          return Promise.resolve(parseXml(xml));
        }).then(result => {
          data = result;
          return loadXml(tourXmlPath);
        })
        .then(xml => Promise.resolve(addParentInfo(data, xml)));
    };
    return reader;
}