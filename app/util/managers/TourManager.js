//MODELS
import TourModel from 'WalkWestCentral/app/models/map/TourModel';
import {MapPoint, MapPointType} from 'WalkWestCentral/app/models/map/MapPoint';
import Coordinate from 'WalkWestCentral/app/models/map/Coordinate';
import MapRect from 'WalkWestCentral/app/models/map/MapRect';

//MANAGERS
import LocationManager from 'WalkWestCentral/app/util/managers/LocationManager';
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';
import FileManager from 'WalkWestCentral/app/util/managers/FileManager';

//DEFINITIONS
import { TOUR_BUCKET_ID } from 'WalkWestCentral/app/util/Definitions';

//CLASS
class TourManager {
    constructor() {
        this.tours = [];
        this.bucketID = TOUR_BUCKET_ID;
        this.refreshTours();
    }

    //tourListChanged will be called every time an item is added to the list
    refreshTours(arg = {tourListChanged:(tour)=>{}}){
        var self = this;
        //clear the tour list
        self.tours = [];
        //this will get the bucket of tours, with each json file being the title of the tour
        NetworkManager.getBucket({bucket: this.bucketID, callback:(bucket)=>{
            //this gets the data points for each tour
            NetworkManager.getItemsInBucket({bucket: bucket, callback:(bucketItem)=>{
                let tourPoints = [];
                for(let i = 0; i < bucketItem.data.length; i++){
                    let mapPoint = new MapPoint(bucketItem.data[i]);
                    tourPoints.push(mapPoint);
                }

                let tour = {
                    name: bucketItem.name,
                    tourPoints: tourPoints
                }

                //add the tour to the list of tours
                self.tours.push(tour);

                if(typeof arg.tourListChanged === 'function'){
                    arg.tourListChanged(tour);
                }
            }});
        }});
    }

    saveTour(arg = {tour: null, callback: (success)=>{}}){
        let key = tour.name.replace(' ', '_');
        FileManager.saveFileForKey({key: key, name: arg.tour.name, type: tour, data: arg.tour, callback: (success)=>{
            if(typeof arg.callback === 'function'){
                arg.callback(success);
            }
        }});
    }

    getTour(arg = {tour: null, callback: (tour)=>{}}){
        let key = tour.name.replace(' ', '_');
        FileManager.getFileForKey({key: key, callback:(tour)=>{
            if(typeof arg.callback === 'function'){
                arg.callback(tour);
            }
        }});
    }

    numTours() {
        return this.tours.length;
    }

    //Returns the tour at the given index (returns null if invalid index)
    getTour(index) {
        if (index < this.tours.length && index >= 0) {
            return this.tours[index];
        } else {
            return null;
        }
    }

    getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2 - lat1); // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in km
        return d;
    }

    deg2rad(deg) {
        return deg * (Math.PI / 180)
    }

    closeToPointInTour(arg = {
        tourIndex: 0,
        withinRange: 0,
        location: null,
        callback: (tourPoint) => {}
    }) {
        if (arg.tourIndex === 'undefined') {
            console.error('Need to specify tourIndex');
            return;
        }
        let tour = this.getTour(arg.tourIndex);
        //if we have a valid tour
        if (tour && arg.location) {
            let minDistance = Number.MAX_VALUE;
            let closestTourPoint = null;
            //loop through all of the map points in that tour
            //  and check it against our current location
            for (let i = 0; i < tour.tourPoints.length; i++) {
                let mapPoint = tour.tourPoints[i];
                //if the map point is a tour point
                if (mapPoint.isValidTourPoint() && mapPoint.isTourPoint()) {
                    let mapLoc = mapPoint.coordinate;
                    //find the distance between our current location and the tour point
                    let km = this.getDistanceFromLatLonInKm(arg.location.coords.latitude, arg.location.coords.longitude, mapLoc.latitude, mapLoc.longitude);
                    if (km < minDistance) {
                        minDistance = km;
                        closestTourPoint = mapPoint;
                    }
                }
            }

            //if we aren't within the range of the point, it's not a valid point
            if (arg.withinRange !== 'undefined' && arg.withinRange > 0 && minDistance > arg.withinRange) {
                closestTourPoint = null;
            }

            if (typeof arg.callback === 'function') {
                arg.callback(closestTourPoint);
            }
        }
    }
}

let instance = new TourManager();
export default instance;
