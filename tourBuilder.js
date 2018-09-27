const Fs = require('fs-extra');
const Xml2js = require('xml2js');
const Path = require('path');


module.exports = function (config) {

  const log = function(...args){
    console.log(...args);
  };
  log('Module created with config', config);
  const inFolder = Path.resolve(config.inFolder);
  const outFolder = Path.resolve(config.outFolder);
  const templatesFolder = Path.resolve(config.templatesFolder);
  let mainXML = undefined;
  let floorsList = {};
  let mapHotspots = {};

  const initOutFolder = function () {
    let itemsToCopy = [
      'panos',
      'plugins',
      'skin',
      'tour.js',
      'tour.swf',
//        'tour.html',
      'tour.xml',
      // 'tour_testingserver.exe'
    ];
    copy(inFolder, outFolder, itemsToCopy);
    itemsToCopy = ['ext'];
    copy(templatesFolder, outFolder, itemsToCopy);
    if(config.useCustomMap){
      itemsToCopy = ['index.html'];
      copy(templatesFolder, outFolder, itemsToCopy);
    } else {
      itemsToCopy = [
        'tour.html'
      ];
      copy(inFolder, outFolder, itemsToCopy);
      Fs.renameSync(Path.resolve(outFolder,'tour.html'), Path.resolve(outFolder,'index.html'));
    }
    itemsToCopy = [];
    config.floorSelect.forEach(item => {
      itemsToCopy.push(item.image);
    });
    copy(Path.resolve(inFolder, 'custom'), Path.resolve(outFolder,'ext/tour'), itemsToCopy);
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
          reject(err);
        } else {
          resolve('done');
        }
      })
    });
  };

  const copy = function(source, dest, items) {
    items.forEach((item)=>{
      Fs.copySync(Path.resolve(source, item), Path.resolve(dest, item));
    });
  };

  const setSkinSettings = function(xml) {
    xml.krpano.skin_settings[0]['$']['maps'] = config.showMap;
    xml.krpano.skin_settings[0]['$']['maps_google_api_key'] = config.googleApiKey;
    // xml.krpano.skin_settings[0]['$']['maps_zoombuttons'] = true;
    return xml;
  };

  const setIncludes = function(xml) {
    xml.krpano.include.push({
      '$':  { url: 'ext/tour/ext.xml' }
    });
    return xml;
  };

  const updateScenes = function(xml) {
    xml.krpano.scene.forEach((scene, i) => {
      const floor = scene['$']['floor'] || 1;
      const mapActionName = `map_${floor}_floor`;
      // список сцен на этаже
      if (!floorsList[floor]) floorsList[floor] = [];
      floorsList[floor].push(xml.krpano.scene[i]['$']['name']);
      // список хотспотов на плане этажа.
      if (!mapHotspots[floor]) mapHotspots[floor] = [];
      if (xml.krpano.scene[i]['$']['hotspot'] && xml.krpano.scene[i]['$']['hotspot'] === 'true') {
        mapHotspots[floor].push({
          name: `spot${floor}_${i+1}`,
          style: `mapspot${floor}`,
          x: (i+1)*10,
          y: (i+1)*10,
          zorder: 1,
          onclick: `mapspot_loadscene(${xml.krpano.scene[i]['$']['name']}, map_${floor}_floor);`
        });
      }
      if (xml.krpano.scene[i]['$']['hotspot'] && xml.krpano.scene[i]['$']['hotspot']==='true') {
        xml.krpano.scene[i]['$']['onstart'] = `setFloorMap(${mapActionName}); updateradar(spot${floor}_${i+1},0);`;
      } else {
        xml.krpano.scene[i]['$']['onstart'] = `setFloorMap(${mapActionName});`;
      }
      xml.krpano.scene[i]['$']['lat'] = config.mapCenter.lat;
      xml.krpano.scene[i]['$']['lng'] = config.mapCenter.lng;
      // hotspots
      const hotspots = xml.krpano.scene[i]['hotspot'];
      hotspots.forEach((hs, hsI) => {
        xml.krpano.scene[i]['hotspot'][hsI]['$']['linkedscene_lookat'] = 0;
        xml.krpano.scene[i]['hotspot'][hsI]['$']['style'] = 'hotspot_ani_white';
      });
    });
    return xml;
  };

  const composeFloorSelector = function(xml){
    // delete examples
    for (let item in xml.krpano.floor_settings[0].$){
      if(xml.krpano.floor_settings[0].$.hasOwnProperty(item)) {
        if (item.search('start_scene') >= 0) {
          delete xml.krpano.floor_settings[0].$[item];
        }
      }
    }
    // add real
    xml.krpano.layer = [];
    let i = 0;
    for (let floor in floorsList) {
      if (floorsList.hasOwnProperty(floor)){
        i++;
        let itemName = `start_scene_${floor}`;
        xml.krpano.floor_settings[0].$[itemName] = floorsList[floor][0];
        xml.krpano.layer.push(
          { '$':
            { name: `fs${floor}Off`,
              visible: `false`,
              url: `${floor}FloorUp.jpg`,
              keep: `true`,
              handcursor: `true`,
              capture: `false`,
              align: `rightbottom`,
              y: `${20 + 38*floor}`,
              x: `21`,
              scale: `0.5`,
              scalechildren: `true`,
              onclick: `set(floor_settings.current,${floor});toggleButtons();`
            }
          },
        );
        xml.krpano.layer.push(
          { '$':
            { name: `fs${floor}On`,
              visible: `true`,
              url: `${floor}FloorDown.jpg`,
              keep: `true`,
              handcursor: `true`,
              capture: `false`,
              align: `rightbottom`,
              y: `${20 + 38*floor}`,
              x: `21`,
              scale: `0.5`,
              scalechildren: `true`,
              onclick: ``
            }
          },
        );
      }
    }
    return xml;
  };

  const composeFloorMap = function(xml) {
    xml.krpano.action.forEach((action, i) => {
      switch (action['$']['name']) {
        case 'turnOffAllMaps':
          xml.krpano.action[i]['_']='';
          for (let floor in floorsList) {
            if (floorsList.hasOwnProperty(floor)) {
              xml.krpano.action[i]['_'] = xml.krpano.action[i]['_'] + `set(layer[map_${floor}_floor].visible, false); `
            }
          }
          break;
      }
    });

    for (let floor in floorsList) {
      if (floorsList.hasOwnProperty(floor)){
        let imageUrl = `map_${floor}_floor.png`;
        config.floorSelect.forEach(item => {
          if(item.floor == floor){
            imageUrl = item.image;
          }
        });
        xml.krpano.layer.push({
          '$': {
            name: `map_${floor}_floor`,
            url: imageUrl,
            keep: true, 
            handcursor: false, 
            align: `leftbottom`, 
            scale: `0.25`, 
            scalechildren: true, 
            onclick: `open_map(map_${floor}_floor);`,
            floor: floor
          }
        });
        xml.krpano.style = xml.krpano.style || [];
        xml.krpano.style.push(
          {
            '$': {
              name: `mapspot${floor}`,
              keep: `true`,
              url: `camicon.png`,
              parent: `map_${floor}_floor`,
              align: `lefttop`,
              edge: `center`,
              /*
              scale: {
                mobile: `2`
              }
              */
            }
          }
        );
        mapHotspots[floor].forEach((hotspot) => {
          xml.krpano.layer.push(
            {
              '$': {
                name: hotspot.name,
                style: hotspot.style,
                x: hotspot.x,
                y: hotspot.y,
                zorder: hotspot.zorder,
                onclick: hotspot.onclick
              }
            }
          );            
        });
      }
    }
    return xml;
  };

  const o = {};

  o.run = function(){
    log('Start run');
    initOutFolder();
    loadXml(Path.resolve(outFolder, 'tour.xml'))
      .then( xml => {
        mainXML = xml;
        xml = setIncludes(xml);
        xml = setSkinSettings(xml);
        xml = updateScenes(xml);
        return saveXml(xml, Path.resolve(outFolder, 'tour.xml'));
      })
      .then(() => {
        return loadXml(Path.resolve(outFolder, 'ext/tour/floorMap.xml'));
      })
      .then((xml) => {
        xml = composeFloorMap(xml);
        return saveXml(xml, Path.resolve(outFolder, 'ext/tour/floorMap.xml'));
      })
      .then(() => {
        return loadXml(Path.resolve(outFolder, 'ext/tour/floorSelector.xml'));
      })
      .then((xml) => {
        xml = composeFloorSelector(xml);
        return saveXml(xml, Path.resolve(outFolder, 'ext/tour/floorSelector.xml'));
      })
      .then(() => {
        return loadXml(Path.resolve(outFolder, 'ext/gmap/googleMap.xml'));
      })
      .then((xml) => {
        if(config.useCustomMap){
          xml.krpano.action[0]['_'] = `if(show == null, set(show,true); );
        if(show,
        jscall(googleMap.vm.openApp({lat: ${config.mapCenter.lat}, lng: ${config.mapCenter.lng} }));
        );`;
        } else {
          xml.krpano.action[0]['$']['name'] = 'switched_off';
          // delete xml.krpano.action;
        }
        return saveXml(xml, Path.resolve(outFolder, 'ext/gmap/googleMap.xml'));
      })
      .then(res => log(res, 'Finish run'))
      .catch(err => {
        log(err);
      });
  };

  return o;
};
