const Builder = require('./tourBuilder');
const config = {
  inFolder: './inFolder',
  outFolder: './outFolder',
  templatesFolder: './templates',
  googleApiKey: 'AIzaSyARIMiX_C7rE4U-pM6nih2n2z2z0YfhrfY',
  showMap: true,
  mapCenter: {
    lat: 56.0740,
    lng: 37.5964
  },
  floorSelect: [
    {
      floor: 1,
      image: 'map_1st_floor.png',
    },
    {
      floor: 2,
      image: 'map_2nd_floor.png',
    },
  ],
};
const myBuilder = Builder(config);
myBuilder.run();