export default class MapRect {
    constructor(arg = {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0
    }) {
        this.latitude = arg.latitude;
        this.longitude = arg.longitude;
        this.latitudeDelta = arg.latitudeDelta;
        this.longitudeDelta = arg.longitudeDelta;
    }
}
