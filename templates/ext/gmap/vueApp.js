//todo https://github.com/paulirish/matchMedia.js
//todo https://www.w3schools.com/jsref/met_win_matchmedia.asp
class GoogleMapApp {
    constructor(){
        this.ready = false;
        this.center = {
            lat: 43.762976,
            lng: -79.372175
        };
        this.map = undefined;
        this.vm = undefined;
        this.placesLib = new GoogleMapPlaces();
    }


    createApp() {
        if (!this.ready) {
            const self = this;
            const appDiv = document.getElementById('vueAppContainer');
            appDiv.innerHTML = httpGet('/ext/gmap/vueApp.html');
            Vue.component('google-map', VueGoogleMaps.Map);
            Vue.component('google-marker', VueGoogleMaps.Marker);
            this.vm = new Vue ({
                el: '#googleApp',
                data: {
                  center: self.center,
                  centerIcon: {
                      url: 'skin/vtourskin_mapspotactive.png',
                      size: {width: 40, height: 46, f: 'px', b: 'px'},
                      scaledSize: {width: 40, height: 46, f: 'px', b: 'px'}
                  },
                  dialog: false,
                  xs_dialog: false,
                  searchRules: {
                    'school': {name: 'Школы', cat:['school'], icon: 'school.png'},
                    'eat-drink': {name: 'Покушать', cat:['restaurant', 'cafe', 'bar', 'meal_delivery'], icon: 'fastfood.png'},
                    'entertainment': {name: 'Развлечься', cat:['casino', 'gym', 'stadium', 'movie_theater', 'travel_agency'], icon: 'stadium.png'},
                    'stores': {name: 'Купить', cat:['clothing_store', 'bakery', 'convenience_store', 'department_store', 'electronics_store', 'hardware_store', 'store',], icon: 'mall.png'},
                  },
                  categories: [
                    {id: 'school', cat:['school'], text: "Школы", icon: 'static/img/gmap/school.png'},
                    {id: 'eat-drink', cat:['restaurant', 'cafe', 'bar', 'meal_delivery'], text: "Покушать", icon: 'static/img/gmap/fastfood.png'},
                    {id: 'entertainment', cat:['casino', 'gym', 'stadium', 'movie_theater', 'travel_agency'], text: "Развлечься", icon: 'static/img/gmap/stadium.png'},
                    {id: 'stores', cat:['clothing_store', 'bakery', 'convenience_store', 'department_store', 'electronics_store', 'hardware_store', 'store',], text: "Купить", icon: 'static/img/gmap/mall.png'},
                  ],
                  valuesToSearch: [],

                  notFound: false,

                  tableHeight: 0,
                  placesList: {
                      search: '',
                      headersSmallScreen: [
                          {
                              text: 'Наименование',
                              align: 'center',
                              sortable: false,
                              value: 'name',
                          }
                      ],
                      headers: [
                          {
                              text: 'Наименование',
                              align: 'center',
                              sortable: false,
                              value: 'name',
                          },
                          {
                              text: 'Расстояние',
                              value: 'distanceValue',
                              sortable: true,
                              align: 'center',
                          }
                      ],
                      places: [],
                      loading: false
                  },
                  placeObjects: [],
                  markers: [],
                  infoWindowPos: null,
                  infoWinOpen: false,
                  infoContent: '',
                  currentInfoWindowIdx: -1,
                  infoOptions: {
                      pixelOffset: {
                          width: 0,
                          height: -35
                      }
                  },
                },
                watch: {
                    valuesToSearch (val){
                        // this.runSearch();
                    }
                },
                mounted(){
                    this.$refs.mapRef.$mapPromise.then((map) => {
                        self.map = map;
                        self.placesLib.initService(self.map);
                    });
                    this.onTableParentResize();
                },
                methods: {
                  setMedia(media){
                      if (!media.matches) {
                          this.xs_dialog = false;
                      }
                  },
                  onTableParentResize(){
                      const parentHeight =this.getHeightById('map-container');
                      const toolbarHeight =this.getHeightById('toolbar');
                      this.tableHeight = parentHeight - toolbarHeight - 10;
                  },
                  getHeightById(elmID) {
                      var elmPadding, elmHeight, elmMargin, elm = document.getElementById(elmID);
                      elmHeight = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('height'));
                      elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'));
                      elmPadding = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('padding-top')) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('padding-bottom'));
                      return (elmHeight + elmMargin + elmPadding);
                  },
                  runSearch(){
                      self.findPlaces();
                  },
                  openApp(center){
                    this.dialog = true;
                    self.center = center;
                    this.center = center;
                    self.findPlaces();
                  },
                  showBalloon(markerIndex){
                        if ( markerIndex === this.currentInfoWindowIdx ){
                            this.infoWinOpen = !this.infoWinOpen;
                        } else {
                            this.currentInfoWindowIdx = markerIndex;
                            const marker = this.markers[markerIndex];
                            const place = this.placeObjects[markerIndex];
                            const listItem = this.placesList.places[markerIndex];
                            const balloonText = "<div style=\"color: #1e88e5\">" +
                              "<h3>" + place.name + "</h3>" +
                              "<span style='color: #0000b6'><u><b>Адрес:</b></u> " + place.address + "</span><br>" +
                              "<span style='color: mediumblue'><u><b>Расстояние/время:</b></u> " + listItem.distanceText + "</span>" +
                              "</div>";
                            this.infoContent = balloonText;
                            this.infoWindowPos = marker.position;
                            this.infoWinOpen = true;
                            const bounds = new google.maps.LatLngBounds();
                            bounds.extend(self.center);
                            bounds.extend(place.geometry.location);
                            self.map.fitBounds(bounds);
                            self.map.setZoom(self.map.getZoom()-1);
                        }
                    }
                },
            });
            matchMedia('(max-width: 599px)').addListener(this.vm.setMedia);
            this.ready = true;
        }
    }
    findPlaces() {
      this.vm.placesList.loading = true;
      const searchCriteria = {};
      this.vm.valuesToSearch.forEach((set) => {
        this.vm.searchRules[set]['cat'].forEach((category) => {
          searchCriteria[category] = this.vm.searchRules[set]['icon'];
        });
      });
      var promise = this.placesLib.getPlaces(searchCriteria, this.center);
        promise.then(
            results => {
              this.clearPlaces();
              this.vm.placesList.places = [];
              this.vm.placeObjects = [];
              this.vm.onTableParentResize();
              if (results.length === 0){
              } else {
                this.createMarkers(results);
                this.updateList(results);
              }
              this.vm.placesList.loading = false;
            },
            error => alert("Ошибка: " + error.message) // Ошибка: Not Found
        );
    }

    updateList(places){
        for (let i = 0, place; place = places[i]; i++) {
            this.vm.placesList.places.push({
                value: false,
                distanceValue: place.distance.distance.value,
                distanceText: place.distance.distance.text + ', ' + place.distance.duration.text,
                name: place.name,
                markerIndex: i,
            });
            this.vm.placeObjects.push(place);
        }
    }

    clearPlaces(){
        this.vm.infoWinOpen=false;
        for (let i = 0; i < this.vm.markers.length; i++) {
            this.vm.markers[i].setMap(null);
        }
        this.vm.markers = [];
    }

    createMarkers(places){
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(this.center);
        let count = 0;
        for (let i = 0, place; place = places[i]; i++) {
            count++;
            const image = {
                url: "http://maps.google.com/mapfiles/ms/micons/red.png",
                // url: place.icon
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34)
                // scaledSize: new google.maps.Size(25, 25)
            };
            const marker = new google.maps.Marker({
                map: this.map,
                icon: 'ext/gmap/img/' + place.icon,
                title: place.name,
                position: place.geometry.location,
                markerIndex: i,
            });
            marker.addListener('click', () => {
                this.onMarkerClick(marker);
            });
            this.vm.markers.push(marker);
            bounds.extend(place.geometry.location);
        }
        this.map.fitBounds(bounds);
        if(count <3 ) this.map.setZoom(this.map.getZoom()-1);
    }

    onMarkerClick(marker){
        this.vm.showBalloon(marker.markerIndex);
    }
}

function httpGetAsync(theUrl, callback)
{
    const XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
    const xmlHttp = new XHR();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    };
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

function httpGet(theUrl)
{
    const xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

/**
 * @function promisify: convert api based callbacks to promises
 * @description takes in a factory function and promisifies it
 * @params {function} input function to promisify
 * @params {array} an array of inputs to the function to be promisified
 * @return {function} promisified function
 * */
function promisify(fn) {
    return function () {
        var args = Array.prototype.slice.call(arguments);
        return new Promise(function(resolve, reject) {
            fn.apply(null, args.concat(function (err, result) {
                if (err) reject(err);
                else resolve(result);
            }));
        });
    }
}


console.log("vueApp.js started");
Vue.use(VueGoogleMaps, {
    load: {
        key: 'AIzaSyARIMiX_C7rE4U-pM6nih2n2z2z0YfhrfY',
        libraries: 'places', // This is required if you use the Autocomplete plugin
        // OR: libraries: 'places,drawing'
        // OR: libraries: 'places,drawing,visualization'
        // (as you require)

        //// If you want to set the version, you can do so:
        // v: '3.26',
    },
    //// If you intend to programmatically custom event listener code
    //// (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
    //// instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
    //// you might need to turn this on.
    // autobindAllEvents: false,

    //// If you want to manually install components, e.g.
    //// import {GmapMarker} from 'vue2-google-maps/src/components/marker'
    //// Vue.component('GmapMarker', GmapMarker)
    //// then disable the following:
    // installComponents: true,
});
var googleMap = new GoogleMapApp();
googleMap.createApp();

/*
                    obj_types:[
                        'no filter',
                        'accounting',
                        'airport',
                        'amusement_park',
                        'aquarium',
                        'art_gallery',
                        'atm',
                        'bakery',
                        'bank',
                        'bar',
                        'beauty_salon',
                        'bicycle_store',
                        'book_store',
                        'bowling_alley',
                        'bus_station',
                        'cafe',
                        'campground',
                        'car_dealer',
                        'car_rental',
                        'car_repair',
                        'car_wash',
                        'casino',
                        'cemetery',
                        'church',
                        'city_hall',
                        'clothing_store',
                        'convenience_store',
                        'courthouse',
                        'dentist',
                        'department_store',
                        'doctor',
                        'electrician',
                        'electronics_store',
                        'embassy',
                        'fire_station',
                        'florist',
                        'funeral_home',
                        'furniture_store',
                        'gas_station',
                        'gym',
                        'hair_care',
                        'hardware_store',
                        'hindu_temple',
                        'home_goods_store',
                        'hospital',
                        'insurance_agency',
                        'jewelry_store',
                        'laundry',
                        'lawyer',
                        'library',
                        'liquor_store',
                        'local_government_office',
                        'locksmith',
                        'lodging',
                        'meal_delivery',
                        'meal_takeaway',
                        'mosque',
                        'movie_rental',
                        'movie_theater',
                        'moving_company',
                        'museum',
                        'night_club',
                        'painter',
                        'park',
                        'parking',
                        'pet_store',
                        'pharmacy',
                        'physiotherapist',
                        'plumber',
                        'police',
                        'post_office',
                        'real_estate_agency',
                        'restaurant',
                        'roofing_contractor',
                        'rv_park',
                        'school',
                        'shoe_store',
                        'shopping_mall',
                        'spa',
                        'stadium',
                        'storage',
                        'store',
                        'subway_station',
                        'supermarket',
                        'synagogue',
                        'taxi_stand',
                        'train_station',
                        'transit_station',
                        'travel_agency',
                        'veterinary_care',
                        'zoo',
                    ],

 */
