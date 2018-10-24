class GoogleMapLib {
  constructor(map, center){
    this.ready = false;
    // todo get center from the map
    this.center = center;
    this.map = map;
    this.placesLib = new GoogleMapPlaces();
    this.placesLib.initService(this.map);
  }
  test() {
    console.error('GoogleMapApp tested!');
  }
  findPlaces(list) {
    const promise = this.placesLib.getPlaces(list, this.center)
      .then((places) => {
          return new Promise((resolve, reject) => {
            resolve(places);
          });
        }
      );
    return promise;
  }
}
