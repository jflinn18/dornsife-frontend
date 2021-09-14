//A latitude/longitude coordinate pair
export default class Coordinate {
    constructor(arg = {latitude: 0,longitude: 0}) {
        this.latitude = arg.latitude;
        this.longitude = arg.longitude;
    }
}
