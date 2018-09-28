const Builder = require('./tourBuilder');
const config = {
  inFolder: './inFolder',
  outFolder: './outFolder',
  templatesFolder: './templates',
  googleApiKey: 'AIzaSyARIMiX_C7rE4U-pM6nih2n2z2z0YfhrfY',
  showMap: true,
  useCustomMap: true,
  language: 'ru',
  // googleMapUnits: 'METRIC',
  googleMapUnits: 'IMPERIAL',
  mapCenter: {
    lat: 56.0740,
    lng: 37.5964
  },
  floorSelect: [
    {
      floor: 1,
      image: 'map_1_floor.jpg',
    },
    {
      floor: 2,
      image: 'map_2_floor.jpg',
    },
  ],
};
const myBuilder = Builder(config);
myBuilder.run();