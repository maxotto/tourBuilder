class GoogleMapPlaces{
    constructor(self){
        this.service = null;
        this.distanceService = null;
        this.map = null;
        this.maxAttempts = 10;
        this.attemptsTimeout = 500;
    }
    initService(map){
        if(!this.service){
            this.map = map;
            this.service = new google.maps.places.PlacesService(map);
            this.distanceService = new google.maps.DistanceMatrixService();
        }
    }
    getPlaces(task, center){
        let catList = [];
        for (let i = 0; i < task.length; i++) {
            if (typeof task[i] === 'string' || task[i] instanceof String){
                catList.push(task[i]);
            } else if (task[i] instanceof Array) {
                for (let j = 0; j < task[i].length; j++) {
                    catList.push(task[i][j]);
                }
            }

        }
        const promises = [];
        for (let i = 0; i < catList.length; i++) {
            promises.push(this.nearBySearchPromise({
                location: center,
                rankBy: google.maps.places.RankBy.DISTANCE,
                type: [catList[i]]
            }));
        }
        return Promise.all(promises).then((results) => {
                const fullList = this.makeOneList(results);
                return Promise.resolve(fullList);
            })
            .catch((error) => {
                console.log(error);
                alert("GoogleMapPlaces error: " + error);
            });
    }
    makeOneList(found){
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
    }
    getDistancePromise(origin, destinations, travelMode, unitSystem){
        const request = {
            origins: [origin],
            destinations: destinations,
            travelMode: travelMode,
            unitSystem: unitSystem
        };
        return new Promise((resolve, reject) => {
            this.distanceService.getDistanceMatrix(request, (distances, status) => {
                    if(status === 'OK'){
                        resolve(distances);
                    } else {
                        reject({
                            status: status,
                            dest: destinations
                        });
                    }
                });
        })
            .then((distances) => {
            return Promise.resolve(distances);
        })
            .catch((error) => {
                if (error.status === "OVER_QUERY_LIMIT"){
                    if (this.maxAttempts > 0) {
                        return new Promise((resolve, reject) => {
                            setTimeout(()=> {
                                resolve();
                            }, this.attemptsTimeout);
                        }).then(() => {
                            // alert('start new attempt');
                            return this.getDistancePromise(origin, destinations, travelMode, unitSystem);
                        });
                    } else {
                        return Promise.reject(error);
                    }
                } else {
                    return Promise.reject(error);
                }
            });
    }
    nearBySearchPromise(request){
        return new Promise((resolve, reject) => {
            // const service = new google.maps.places.PlacesService(this.map);
            this.service.nearbySearch(request, (results, status) => {
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    reject(status);
                }
                resolve(results);
            });
        }).then((result) => {
            return Promise.resolve(result);
        }).catch((status) => {
            if(status === "OVER_QUERY_LIMIT") {
                //alert('Need to make setTimeout()');
                if (this.maxAttempts > 0) {
                    return new Promise((resolve, reject) => {
                        setTimeout(()=> {
                            resolve();
                        }, this.attemptsTimeout);
                    }).then(() => {
                        // alert('start new attempt');
                        return this.nearBySearchPromise(request)
                    });

                } else {
                    return Promise.reject(status);
                }
            } else {
                return Promise.reject(status);
            }
        });
    };
}
console.log("GoogleMapPlaces.js started");
