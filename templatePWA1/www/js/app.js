// Init F7 Vue Plugin
Framework7.use(Framework7Vue);

// Init Vuetify Plugin
Vue.use(Vuetify);

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyARIMiX_C7rE4U-pM6nih2n2z2z0YfhrfY',
    libraries: 'places',
  },
});

// Init Page Components
Vue.component('page-gmap', {
  template: '#page-gmap',
  data: function(){
    return {
      tableHeight: 500,
      showTable: false,
      tableData:[],
      headers: [
        {
          text: 'Name',
          align: 'center',
          sortable: false,
          value: 'name',
          width: '270px',
        },
        {
          text: 'Distance (miles)',
          value: 'distance.distance.value',
          sortable: true,
          align: 'center',
          width: '110px'
        }
      ],
      mapStyle: 'width: 100%; height: 500px;`',
      /*
      center: {
        lat: 43.762976,
        lng: -77.372175
      },
      */
      centerIcon: {
        url: 'tour/skin/vtourskin_mapspotactive.png',
        size: {width: 40, height: 46, f: 'px', b: 'px'},
        scaledSize: {width: 40, height: 46, f: 'px', b: 'px'}
      },
      markers: [],
      infoWindowPos: null,
      infoWinOpen: false,
      infoContent: 'empty',
      currentInfoWindowIdx: -1,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      mapOptions: {
        gestureHandling: 'greedy',
        mapTypeControl: false,
      },
      loading: true,
      selectedCheckBox: [],
    }
  },
  mounted () {
    const catToSearch = store.getters['getCatToSearch'];
    this.selectedCheckBox = [];
    for (var key in catToSearch) {
      if (catToSearch.hasOwnProperty(key)) {
        this.selectedCheckBox.push(key);
      }
    }
    this.tableData = store.getters['getTableData'];
    this.$refs.mapRef.$mapPromise.then((map) => {

      window.map = map;
      window.map.setZoom(15);
      this.mapOptions.mapTypeControl = true;
      this.mapOptions.mapTypeControlOptions = {
        style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
        position: google.maps.ControlPosition.TOP_CENTER
      };
      store.dispatch({
        type: 'setCenterAction',
        center: this.center
      });
      this.mapStyle = `width: 100%; height: ${window.innerHeight - 28}px;`;
      this.tableHeight = window.innerHeight - 28 - 32;
      this.$f7.on('resize', (aa) => {
        this.mapStyle = `width: 100%; height: ${window.innerHeight - 28}px;`;
        this.tableHeight = window.innerHeight - 28 - 32;
      });
      this.createMarkersByPlaces(store.getters['getFound']);
    })
  },
  methods: {
    onTableRowClick(index){
      this.onMarkerClick(this.markers[index], true);
      this.showTable = false;
    },
    onMarkerClick(marker, fromTableClick) {
      const doNotClose = fromTableClick || false;
      // console.log(marker);
      // alert('marker' + marker.markerIndex);
      const markerIndex = marker.markerIndex;
      const markerPlaceId = marker.place_id;
      if ( (markerIndex === this.currentInfoWindowIdx) && !doNotClose){
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        this.currentInfoWindowIdx = markerIndex;
        // const marker = this.markers[markerIndex];
        //  console.log(this.foundPlaces);
        const place = this.foundPlaces[markerPlaceId];
        // const listItem = this.placesList.places[markerIndex];
        this.infoContent = this.composeBalloonTxt(place);
        this.infoWindowPos = marker.position;
        this.infoWinOpen = true;
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(this.center);
        bounds.extend(place.geometry.location);
        window.map.fitBounds(bounds);
        window.map.setZoom(window.map.getZoom()-1);
      }
    },
    composeBalloonTxt(place){
      const balloonText = "<div style=\"color: #1e88e5\">" +
        "<h3>" + place.name + "</h3>" +
        "<span style='color: darkblue'><b>Address:</b> " + place.address + "</span> </p>" +
        "<span style='color: mediumblue'><b>Distance/time:</b> " + place.distance.distance.text +', ' + place.distance.duration.text + "</span> </p>" +
        "</div>";
      return balloonText;
    },
    checkSelected(event){
      this.loading = true;
      const self = this;
      const value = event.target.dataset.value;
      if (self.selectedCheckBox.indexOf(value) === -1) {
        self.selectedCheckBox.push(value);
      } else {
        self.selectedCheckBox.splice(self.selectedCheckBox.indexOf(value), 1);
      }
      store.dispatch({
        type: 'searchBySelect',
        cats: this.selectedCheckBox
      });
      store.dispatch({
        type: 'startSearch',
      });
    },
    clearMarkers() {
      if (this.currentInfoWindowIdx >= 0) {
        this.currentInfoWindowIdx = -1;
        this.infoWinOpen = false;
      }
      this.markers.forEach((marker, index) => {
        this.markers[index].setMap(null);
      });
      this.markers = [];
    },
    createMarkersByPlaces(places){
      this.loading = true;
      this.clearMarkers();
      if(Object.keys(places).length > 0){
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(this.center);
        let i = 0;
        for (let place_id in places) {
          let place = places[place_id];
          if(places.hasOwnProperty(place_id)){
            const image = {
              url: 'tour/ext/gmap/img/' + place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34)
            };
            const marker = new google.maps.Marker({
              map: window.map,
              icon: image,
              title: place.name,
              position: place.geometry.location,
              markerIndex: i,
              place_id: place_id,
            });
            i++;

            marker.addListener('click', () => {
              this.onMarkerClick(marker);
            });

            this.markers.push(marker);
            bounds.extend(place.geometry.location);
          }
        }
        window.map.fitBounds(bounds);
      }
      this.loading = false;
    },
  },
  watch: {
    foundPlaces(places) {
      this.createMarkersByPlaces(places);
    },
    tableDataFromStore(tableData){
      this.tableData = tableData;
    }
  },
  computed: {
    showTableIcon() {
      const show = this.markers.length>0;
      if(!show && this.showTable) this.showTable = false;
      return show;
    },
    foundPlaces(){
      return store.getters['getFound'];
    },
    tableDataFromStore() {
      return store.getters['getTableData'];
    },

    loading() {
      return store.getters['getLoading'];
    },

    center() {
      return store.getters['getCenter'];
    }
  },
});


Vue.component('page-found-list', {
  template: '#page-found-list',
  data() {
    return {
      selectedId: [],
      // selectedTxt: 'xxx',
      categories: [
        {id: 'school', text: "Schools", icon: 'static/img/gmap/school.png'},
        {id: 'eat-drink', text: "Eat & Drink", icon: 'static/img/gmap/fastfood.png'},
        {id: 'entertainment', text: "Entertainment", icon: 'static/img/gmap/stadium.png'},
        {id: 'stores', text: "Stores", icon: 'static/img/gmap/mall.png'},
      ],
      headers: [
        {
          text: 'Name',
          align: 'center',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Distance (miles)',
          value: 'distance',
          sortable: true,
          align: 'center',
        }
      ],
    }
  },
  watch: {
    // use "function" syntax, not "()=>{}" !! https://stackoverflow.com/questions/42242682/this-is-undefined-in-vue-js-watcher
    selectedId: function (val) {
      console.log(val);
      store.dispatch({
        type: 'searchBySelect',
        cats: val
      });
    }
  },
  computed: {
    tableData() {
      return store.getters['getTableData'];
    },

    loading() {
      return store.getters['getLoading'];
    }
  },
  methods: {
    onSelectDlgClosed: function(e) {
      store.dispatch({
        type: 'startSearch',
      });
    },
    onTableRowClick(index){
      this.$f7.router.back();
      store.dispatch({
        type: 'actionShowInfoWindow',
        index: index
      });
    },
  },
  mounted(){
    const catToSearch = store.getters['getCatToSearch'];
    this.selectedId = [];
    for (var key in catToSearch) {
      if (catToSearch.hasOwnProperty(key)) {
        this.selectedId.push(key);
      }
    }
    let textA = [];
    for (let i=0, cat; cat=this.categories[i]; i++){
      if (this.selectedId.indexOf(cat.id) !== -1) {
        textA.push(cat.text);
      }
    }
//      this.$refs.catss.f7SmartSelect.setValue(textA.join(', '));
//      this.$refs.catss.f7SmartSelect.on('closed', (e) => {this.onSelectDlgClosed(e)});
  }

});

Vue.component('page-not-found', {
  template: '#page-not-found'
});

// Init App
window.vueApp = new Vue({
  el: '#app',
  methods: {
    runpano (xml) {
      window.embedpano({swf: 'tour/tour.swf', xml: xml, target: 'pano', id: 'pano1', html5: 'auto', mobilescale: 1.0, passQueryParameters: true, consolelog: true})
    }
  },
  mounted () {
    this.runpano('tour/tour.xml');
    const panoStyle = document.getElementById('pano1').style;
    panoStyle.position = 'absolute';
    this.$on('openMap', (data) => {
      store.dispatch({
        type: 'setCenterAction',
        center: {
          lat: data.lat,
          lng: data.lng
        }
      });
      this.$f7.router.navigate( '/gmap/' );
    });

  },
  beforeDestroy () {
    window.removepano('pano1');
  },
  data: function () {
    return {
      // Framework7 parameters here
      f7params: {
        root: '#app', // App root element
        id: '3d.tour.pano', // App bundle ID
        name: 'Framework7', // App name
        theme: 'auto', // Automatic theme detection
        // App routes
        routes: [
          {
            path: '/gmap/',
            component: 'page-gmap'
          },
          {
            path: '(.*)',
            component: 'page-not-found',
          },
        ],
      },
    }
  },
});

// vuex states
const store = new Vuex.Store({
  state: {
    searchRules: {
      'school': {name: 'Schools', cat:['school'], icon: 'school.png'},
      'eat-drink': {name: 'To eat&drink', cat:['restaurant', 'cafe', 'bar', 'meal_delivery'], icon: 'fastfood.png'},
      'entertainment': {name: 'Entertainment', cat:['casino', 'gym', 'stadium', 'movie_theater', 'travel_agency'], icon: 'stadium.png'},
      'stores': {name: 'Where to buy', cat:['clothing_store', 'bakery', 'convenience_store', 'department_store', 'electronics_store', 'hardware_store', 'store',], icon: 'mall.png'},
    },
    catToSearch: {},
    startSearch: false,
    loading: false,
    found:{},
    foundCache: {},
    tableData: [],
    center: {
      lat: 0,
      lng: 0,
    },
    showInfoWindow: null, // index of marker for which infowindow will be shown
  },
  getters: {

    getShowInfoWindow: state => {
      return state.showInfoWindow;
    },

    getTableData: state => {
      return state.tableData;
    },

    getFound: state => {
      return state.found;
    },

    startSearch: state => {
      return state.startSearch;
    },

    getLoading: state => {
      return state.loading;
    },

    searchRules: state => {
      return state.searchRules;
    },
    getCatToSearch: state => {
      return state.catToSearch;
    },
    getCenter: state => {
      return state.center;
    }
  },
  actions: {
    actionShowInfoWindow({commit}, actionData){
      const index = actionData.index;
      commit('setShowInfoWindow', index);
    },
    searchBySelect ({commit}, actionData) {
      commit('setCatsToSearch', actionData.cats);
    },
    setCenterAction({commit}, actionData){
      commit('setCenter', actionData.center);
    },
    startSearch ({dispatch, commit, state}, actionData){
      window.googleMapLib = new GoogleMapLib(window.map, state.center);
      commit('setLoading', true);
      const promisesList = [];
      for (let key in state.catToSearch){
        if (state.catToSearch.hasOwnProperty(key) ){
          if (state.foundCache[key] instanceof Object) { // there are places in cache for this category. Put them in promise
            promisesList.push(Promise.resolve(state.foundCache[key]));
          } else { // otherwise get places from service
            let list = {};
            let item = state.catToSearch[key];
            item.cat.forEach((cat) => {
              list[cat] = item.icon;
            });

            promisesList.push( window.googleMapLib.findPlaces(list).then(
              places => {
                commit('setFoundCache',{cat: key, places: places});
              })
            );
          }
        }
      }
      Promise.all(promisesList)
        .then((places) => {
          commit('composeFoundFromCache');
        });
    },
  },
  mutations: {

    setShowInfoWindow (state, value){
      state.showInfoWindow = value;
    },

    setStartSearch (state, value){
      state.startSearch = value;
    },

    setLoading (state, value){
      state.loading = value;
    },

    setCatsToSearch (state, cats) {
      const searchRules = {
        'school': {name: 'Schools', cat:['school'], icon: 'school.png'},
        'eat-drink': {name: 'To eat&drink', cat:['restaurant', 'cafe', 'bar', 'meal_delivery'], icon: 'fastfood.png'},
        'entertainment': {name: 'Entertainment', cat:['casino', 'gym', 'stadium', 'movie_theater', 'travel_agency'], icon: 'stadium.png'},
        'buy': {name: 'Where to buy', cat:['clothing_store', 'bakery', 'convenience_store', 'department_store', 'electronics_store', 'hardware_store', 'store',], icon: 'mall.png'},
      };
      // according this https://stackoverflow.com/questions/38750705/filter-object-properties-by-key-in-es6/38750895
      state.catToSearch = _.pick(state.searchRules, cats);
    },

    setFoundCache(state, data){
      const cat = data.cat;
      // transform array to object where keys are place_id
      const placesObject = {};
      data.places.forEach((place) => {
        let place_id = place.place_id;
        placesObject[place_id] = place;
      });
      state.foundCache[cat] = placesObject;
    },

    composeFoundFromCache(state){
      const list = {};
      for (let key in state.catToSearch) {
        if (state.catToSearch.hasOwnProperty(key)) {
          if(state.foundCache.hasOwnProperty(key)){
            for (let place_id in state.foundCache[key]) {
              if (state.foundCache[key].hasOwnProperty(place_id)){
                list[place_id] = state.foundCache[key][place_id];
              }
            }
          } else {
            console.log('????');
          }
        }
      }
      state.found = list;
      state.tableData = [];
      let i = 0;
      for (let place_id in state.found){
        if (state.found.hasOwnProperty(place_id)) {
          let place = state.found[place_id];
          state.tableData.push({
            index: i,
            place_id: place_id,
            name: place.name,
            distance: place.distance
          });
          i++;
        }
      }
    },

    setFound (state, value) {
      state.found = value;
      // upaate tableData
      state.tableData = [];
      for (let i=0, place; place = state.found[i]; i++){
        state.tableData.push({
          index: i,
          name: place.name,
          distance: place.distance
        });
      }
    },

    setTableData (state, value) {
      state.tableData = value;
    },

    setCenter (state, center) {
      state.center = center;
    },

  }
});