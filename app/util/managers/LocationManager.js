//UTILITIES
const Permissions = require('react-native-permissions');
import{
    Platform
} from 'react-native';

class LocationManager {
    constructor() {
        this.locationPermission = 'none';
        this.getCurrentPermissionStatus();
    }

    //
    // ─── PERMISSIONS FUNCTIONS ──────────────────────────────────────────────────────
    //

    //This should (internally) surround any function of this class that's using the
    //  location of the user.  It will check for the status of the location permissions
    //  and run the function if the user gave permission.  If the user did not give permission
    //  or denied permission previously, the callback function will not be run.
    runLocationBlock(arg = {
        callback: () => {}
    }) {
        if (Platform.OS !== 'android' && this.locationPermission !== 'authorized') {
            //we need to request permission
            this.requestPermission({
                //create a custom block that will only called if we have permission
                callback: (permissionStatus) => {
                    if (permissionStatus === 'authorized') {
                        arg.callback();
                    }
                }
            });
        } else {
            //we're good to go
            arg.callback();
        }
    }

    getCurrentPermissionStatus(arg = {
        callback: (permissionStatus) => {}
    }) {
        Permissions.getPermissionStatus('location').then(response => {
            this.locationPermission = response;
            if (typeof arg.callback === 'function') {
                arg.callback(response);
            }
        });
    }

    //request permission to access location
    requestPermission(arg = {
        callback: (permissionStatus) => {}
    }) {
        Permissions.requestPermission('location').then(response => {
            //returns once the user has chosen to 'allow' or to 'not allow' access
            //response is one of: 'authorized', 'denied', 'restricted', or 'undetermined'
            this.locationPermission = response;
            if (typeof arg.callback === 'function') {
                arg.callback(response);
            }
        });
    }

    alertForLocationPermission() {
        Alert.alert('Can we access your location?', 'We need access to give you content based on where you are', [
            {
                text: 'No way',
                onPress: () => console.log('permission denied'),
                style: 'cancel'
            },
            this.state.photoPermission === 'undetermined'
                ? {
                    text: 'OK',
                    onPress: this.requestPermission.bind(this)
                }
                : {
                    text: 'Open Settings',
                    onPress: Permissions.openSettings
                }
        ])
    }

    //
    // ─── LOCATION FUNCTIONS ─────────────────────────────────────────────────────────
    //

    //Will provide the current location via the callback parameter.
    //  The callback will not be called if the user has not given us permission
    //  to access their current location.
    getCurrentLocation(arg = {
        callback: (position) => {}
    }) {
        //make sure we have the right permissions
        this.runLocationBlock({
            callback: () => {
                //get our current position
                navigator.geolocation.getCurrentPosition((position) => {
                    if (typeof arg.callback === 'function') {
                        arg.callback(position);
                    }
                }, (error) => {
                    console.log(JSON.stringify(error));
                    if (typeof arg.callback === 'function') {
                        arg.callback('error');
                    }
                }, {
                    enableHighAccuracy: true,
                    timeout: 20000,
                    maximumAge: 1000
                });
            }
        });
    }

    //This will start watching the location of the user.  The callback
    //  for this function will be called multiple times with the last position
    //  of the user.
    startWatchingLocation(arg = {
        callback: (lastPosition) => {}
    }) {
        //make sure we have permissions
        this.runLocationBlock({
            callback: () => {
                //remember what ID we're using to identify our watch function
                this.watchID = navigator.geolocation.watchPosition((position) => {
                    var lastPosition = position;
                    if (typeof arg.callback === 'function') {
                        arg.callback(lastPosition);
                    }
                });
            }
        });
    }

    //This will stop watching the user's location.
    stopWatchingLocation() {
        navigator.geolocation.clearWatch(this.watchID);
    }
}

const instance = new LocationManager();
export default instance;
