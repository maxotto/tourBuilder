const Fs = require('fs-extra');
const Path = require('path');

module.exports = function (config) {
  const log = function(...args){
    console.log(...args);
  };
  log('Module created with config', config);
  const o = {};
  const center = [config.mapCenter.lat, config.mapCenter.lng];
  const googleMapsClient = require('@google/maps').createClient({
    key: config.googleApiKey,
    Promise: Promise
  });

  findPlaces = function(){
    const promises = [];
    const catList = JSON.parse('{"school":"school.png","restaurant":"fastfood.png","cafe":"fastfood.png","bar":"fastfood.png","meal_delivery":"fastfood.png","casino":"stadium.png","gym":"stadium.png","stadium":"stadium.png","movie_theater":"stadium.png","travel_agency":"stadium.png","clothing_store":"mall.png","bakery":"mall.png","convenience_store":"mall.png","department_store":"mall.png","electronics_store":"mall.png","hardware_store":"mall.png","store":"mall.png"}');
    //const catList = JSON.parse('{"restaurant":"school.png"}');
    for (let category in catList){
      if(catList.hasOwnProperty(category)){
        const promise = nearBySearchPromise({
          location: center,
          // rankBy: 'distance',
          type: category,
          // icon: catList[category]
        })
          .then(places => {
          //log(places);
          return addDistancePromise(places);
        });
        promises.push(promise);
      }
    }
    return Promise.all(promises).then((results) => {
      const fullList = makeOneList(results); //method is STATIC! no THIS here
      return Promise.resolve(fullList);
    })
      .catch((error) => {
        console.log(error);
        // alert("GoogleMapPlaces error: " + error);
      });
  };
  nearBySearchPromise = function(request){
    return googleMapsClient.placesNearby({
      language: 'en',
      location: request.location,
      radius: 5000,
      type: request.type,
    }).asPromise().then(result => {
      return Promise.resolve(result.json.results);
    });
  };

  const addDistancePromise = function(places){
    const destinations = [];
    if(places.length === 0) return Promise.resolve([]);
    places.forEach((place, index) => {
      destinations.push(place.geometry.location);
    });
    let units = 'metric';
    if (this.googleMapUnits === 'IMPERIAL') units = 'imperial';
    return getDistancePromise(center, destinations, 'driving', units)
      .then(distanceInfo => {
        // log(distanceInfo.json);
        distanceInfo.json.rows[0].elements.forEach((d,i) => {
          places[i].distance = d;
          // console.log(JSON.stringify(d));
        });
        distanceInfo.json.destination_addresses.forEach((a,i) => {
          places[i].address = a;
        });
        return Promise.resolve(places);
      });
  };
  const getDistancePromise = function(origin, destinations, travelMode, unitSystem){
    const request = {
      origins: [origin],
      destinations: destinations,
      mode: travelMode,
      units: unitSystem
    };
    return googleMapsClient.distanceMatrix(request).asPromise();
  };
  const makeOneList = function(found){
    let list = {};
    for (let i = 0; i < found.length; i++) {
      for (let j = 0; j < found[i].length; j++) {
        const placeId =  found[i][j].place_id;
        list[placeId] = found[i][j];
      }
    }
    const out = [];
    for (var placeId in list) {
      if (list.hasOwnProperty(placeId)) {
        out.push(list[placeId]);
      }
    }
    return out;
  };

  o.run = function(){
    log('Start run');
    findPlaces()
      .then((response) => {
        console.log('ITOGO = ', response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return o;
};