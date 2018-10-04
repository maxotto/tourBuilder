const Fs = require('fs-extra');
const Xml2js = require('xml2js');
const Path = require('path');
const FtpSync = require('ftpsync');


module.exports = function (config, ftp_deploy) {

  const log = function(...args){
    console.log(...args);
  };
  log('Module created with config', config);
  config.FtpConfig = ftp_deploy;
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
    xml.krpano.skin_settings[0]['$']['loadingtext'] = config.loadingtext;
    xml.krpano.skin_settings[0]['$']['maps_google_api_key'] = config.googleApiKey;
    if(config.useCustomMap){
      xml.krpano.skin_settings[0]['$']['maps_type'] = 'bing';
    }
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

      // if floor for a scene is not set, we assume that floor = 1
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
      const hotspots = xml.krpano.scene[i]['hotspot'] || [];
      if (hotspots.length === 0){
        log('Warning! Scene "' + xml.krpano.scene[i]['$']['name'] + '" has no hotspots!');
      }
      hotspots.forEach((hs, hsI) => {
        xml.krpano.scene[i]['hotspot'][hsI]['$']['linkedscene_lookat'] = 0;
        xml.krpano.scene[i]['hotspot'][hsI]['$']['style'] = 'hotspot_ani_white';
      });
    });

    for (let f in mapHotspots ){
      if(mapHotspots.hasOwnProperty(f)){
        if (mapHotspots[f].length === 0) {
          // console.error('ERROR! There are no scenes marked as hotspots to show them on floor #' + f + ' map! Please, correct TOUR.XML in ' + inFolder + '!\n');
          throw new Error('\nAt least the first scene of each floor must be marked as \'hotspot="true"\' to show them on floor #' + f + ' map!\nPlease, correct TOUR.XML in ' + inFolder + ' according to ReadMe.docx!\n');
        }
      }
    }
    itemsToCopy = [];
    config.floorSelect.forEach(item => {
      if (floorsList.hasOwnProperty(item.floor)){
        itemsToCopy.push(item.image);
      }
    });
    copy(Path.resolve(inFolder, 'custom'), Path.resolve(outFolder,'ext/tour'), itemsToCopy);
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
    var floorsCount = Object.keys(floorsList).length;
    if (floorsCount !== 1) {
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
                  y: `${70 + 38*floor}`,
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
                  y: `${70 + 38*floor}`,
                  x: `21`,
                  scale: `0.5`,
                  scalechildren: `true`,
                  onclick: ``
                }
            },
          );
        }
      }
    }
    // actions
    // 1 delete all actions
    xml.krpano.action = [];
    // recreate actions
    let body = '\nturnOffAllButtons();\n';
    for (let floor in floorsList) {
      if (floorsList.hasOwnProperty(floor)){
        body = body + 'if(floor_settings.current == ' + floor + ',\n' +
          'set(layer[fs' + floor + 'Off].visible, false);\n' +
          'set(layer[fs' + floor + 'On].visible, true);\n' +
          ');\n';
      }
    }
    xml.krpano.action.push(createAction('setButtonsByFloor', body));

    body = '\nturnOffAllMaps();\n' +
      'setButtonsByFloor();\n';
    for (let floor in floorsList) {
      if (floorsList.hasOwnProperty(floor)){
        body = body + 'if(floor_settings.current === ' + floor + ',\n' +
          'loadscene(get(floor_settings.start_scene_' + floor + '),null,MERGE,COLORBLEND(1.0,0x000000,easeOutSine));\n' +
          ',);\n';
      }
    }
    xml.krpano.action.push(createAction('toggleButtons', body));

    body = '\n';
    for (let floor in floorsList) {
      if (floorsList.hasOwnProperty(floor)){
        body = body + 'set(layer[fs' + floor + 'Off].visible, true);\n';
        body = body + 'set(layer[fs' + floor + 'On].visible, false);\n';
      }
    }
    xml.krpano.action.push(createAction('turnOffAllButtons', body));
    // log(xml.krpano.action);

    return xml;
  };

  const createTag = function(params, body) {
    const tag = {};
    tag['$'] = params;
    tag['_'] = body;
    return tag;
  };

  const createAction = function(name, body) {
    return createTag({name: name} , body);
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
          if(item.floor === Number(floor)){
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

  const deploy = function() {
    log(config.ftp_deploy);
    FtpSync.settings = {
      host: config.ftp_deploy.host,
      user: config.ftp_deploy.user,
      pass: config.ftp_deploy.password,
      local: outFolder,
      remote: config.ftp_deploy.destinationPath
    };
    return new Promise((resolve, reject) => {
      FtpSync.run(function(err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result);
        }
      });

    });
    // return Promise.resolve('Deployed by FTP.\n');
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
        jscall(googleMap.vm.openApp(
        {
          lat: ${config.mapCenter.lat}, 
          lng: ${config.mapCenter.lng},
          language: '${config.language}',
          googleMapUnits: '${config.googleMapUnits}' 
        }));
        );`;
        } else {
          xml.krpano.action[0]['$']['name'] = 'switched_off';
          // delete xml.krpano.action;
        }
        return saveXml(xml, Path.resolve(outFolder, 'ext/gmap/googleMap.xml'));
      })
      .then((res) => {
        if (config.FtpConfig && config.FtpConfig.run) {
          return deploy();
        } else {
          return Promise.resolve('Deploy skipped.');
        }
      })
      .then(res => log(res, 'Finish.'))
      .catch(err => {
        log(err);
      });
  };

  return o;
};
