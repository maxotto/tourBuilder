const LocalSettings = require('./localSettings');
// do not use VAR or CONST to make config global, visible inside planEditor Web server
config = {
  inFolder: LocalSettings.inFolder,
  outFolder: LocalSettings.outFolder,
  templatesFolder: './templates',
  googleApiKey: 'AIzaSyARIMiX_C7rE4U-pM6nih2n2z2z0YfhrfY',
  showMap: true,
  useCustomMap: true,
  language: 'ru',
  loadingtext: '',
  // googleMapUnits: 'METRIC',
  googleMapUnits: 'IMPERIAL',
  //43.76841812480301, lng->-79.39991750129661
  // 43.7604; -79.4116
  mapCenter: {
    lat: 43.76841812480301,
    lng: -79.39991750129661
  },
  floorMapShift:{
    x: 0,
    y: 60,
  },
  floorSelect: [
    {
      floor: 0,
      image: 'map_basement.png',
    },
    {
      floor: 1,
      image: 'map_1_floor.jpg',
    },
    {
      floor: 2,
      image: 'map_2_floor.jpg',
    },
  ]
};
var exec = require('child_process').exec;
exec('buildPlanEditorClient.cmd', function callback(error, stdout, stderr){
  if(error) {
    console.log(error);
  } else {
    console.log(stdout);
    const Server = require('./planEditor/bin/www');
    console.log('Server is running. Open http://localhost:3000 to justify hotstops on floors` maps.');
    console.log('Type Ctrl-C to terminate WEB server.');
  }
});