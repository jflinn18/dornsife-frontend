//DEFINITIONS
import{
    BUSINESS_ICON,
    WORSHIP_ICON,
    VOLUNTEER_ICON,
    INFORMATION_ICON
} from 'WalkWestCentral/app/util/Definitions'
//MODELS
import Coordinate from 'WalkWestCentral/app/models/map/Coordinate';

//These are string constants that help classify types of mapPoints.
//  These constants match up with the back end constants.
const MapPointType = {
    INFORMATIONAL: 'Informational',
    BUSINESS: 'Business',
    VOLUNTEER: 'Volunteer',
    WORSHIP: 'Worship',
    WAYPOINT: 'Waypoint'
}

//CLASS
export default class MapPoint {
    constructor(arg = {
        ID: -1,
        latitude: 0,
        longitude: 0,
        name: '',
        excerpt: '',
        description: '',
        tourDescription: '',
        website: '',
        additionalWebsites:[],
        address: '',
        phone: '',
        audioFile: '',
        pictureFile: '',
        type: MapPointType.GENERIC
    }) {
        this.ID = arg.ID,
        this.coordinate = new Coordinate({latitude: parseFloat(arg.latitude), longitude: parseFloat(arg.longitude)});
        this.name = arg.name;
        this.excerpt = arg.excerpt;
        this.description = arg.description;
        this.tourDescription = arg.tourDescription;
        this.website = arg.website;
        this.additionalWebsites = arg.additionalWebsites;
        this.address = arg.address;
        this.phone = arg.phone;
        this.audioFile = arg.audioFile;
        this.pictureFile = arg.pictureFile;
        this.type = arg.type ? arg.type : MapPointType.ROUTEPOINT;
    }

    //do we have a latitude and longitude?
    isValidTourPoint(){
        if(this.coordinate){
            let { latitude, longitude } = this.coordinate;
            if(latitude != null
                && !isNaN(latitude)
                && longitude != null
                && !isNaN(longitude)
            ){
                return true;
            }
            else { return false; }
        }
        return false;
    }

    //is the mapPoint a tourPoint?
    isTourPoint(){
        if(this.type !== MapPointType.WAYPOINT){ return true; }
        return false;
    }

    // is the mapPoint a wayPoint?
    isWayPoint(){
        if(this.type === MapPointType.WAYPOINT){ return true; }
        return false;
    }

    //this will return the icon corresponding with the type of location the mapPoint is
    getIcon(){
        switch (this.type) {
            case MapPointType.BUSINESS:
                return BUSINESS_ICON;
            case MapPointType.INFORMATIONAL:
                return INFORMATION_ICON;
            case MapPointType.WORSHIP:
                return WORSHIP_ICON;
            case MapPointType.VOLUNTEER:
                return VOLUNTEER_ICON;
            default:
                return null;
        }
    }
}

module.exports = {
    MapPointType: MapPointType,
    MapPoint: MapPoint
}
