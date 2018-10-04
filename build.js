const Builder = require('./tourBuilder');
const FtpConfig = require('./ftpConfig');
const config = {
  inFolder: '../inFolder',
  outFolder: '../outFolder',
  templatesFolder: './templates',
  googleApiKey: 'AIzaSyARIMiX_C7rE4U-pM6nih2n2z2z0YfhrfY',
  showMap: true,
  useCustomMap: true,
  language: 'ru',
  loadingtext: '',
  // googleMapUnits: 'METRIC',
  googleMapUnits: 'IMPERIAL',
  //43.76841812480301, lng->-79.39991750129661
  // 43,7604; -79,4116
  mapCenter: {
    lat: 43.7604,
    lng: -79.4116
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
let ftp_deploy = undefined;
if (FtpConfig.run) {
  ftp_deploy = FtpConfig
}
const myBuilder = Builder(config, ftp_deploy);
myBuilder.run();