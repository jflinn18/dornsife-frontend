//REACT
import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    View,
} from 'react-native';
//STYLES
import {
    RED,
    BLACK,
    BLUE,
    WHITE,
    GOLD,
    LIGHT_BLUE
} from 'WalkWestCentral/app/util/Definitions';
//VIEWS
import MapMarker from 'WalkWestCentral/app/ui/components/map/MapMarker';
//MODELS
import MapView from 'react-native-maps';
import MapRect from 'WalkWestCentral/app/models/map/MapRect';
import MapPoint, {MapPointType} from 'WalkWestCentral/app/models/map/MapPoint';

//CLASS
export default class Map extends Component {
    constructor(props) {
        super(props);

        this.mapAnimationDuration = 750;

        //these will be set in render()
        this.mapRef = null;
        this.tourPoints = null;
        this.wayPoints = null;
        this.lastMarkerShownIndex = -1;

        //set on map press
        this.markerPressedAction = false;

        //has the map rendered the first time?
        this.initialMapLayoutComplete = false;
    }

    componentDidMount() {}

    onMapLoad(){
        //if the map hasn't been rendered yet, zoom to fit the mapPoints
        if(!this.initialMapLayoutComplete){
            this.zoomToFitMapPoints(false);
            this.initialMapLayoutComplete = true;
        }
    }

    componentWillReceiveProps(props){
        //when the view is about to render, set the map position
        this.setMapPosition(props.currentMapPointIndex);
    }

    //This will orient the map to fit all of the given mapPoints
    zoomToFitMapPoints(animated){
        //get all of the coordinates from
        const points = this.props.mapPoints.map((mapPoint)=>{
            return mapPoint.coordinate;
        });

        //how much space between the edge of the map and the outermost points do we want?
        const pad = 30;
        const padding = {top: pad, bottom: pad, left: pad, right: pad};
        //fit the coordinates to the points and the padding
        this.mapRef.fitToCoordinates(points, {edgePadding: padding, animated: animated});
    }

    //Zooms into a particular mapPoint
    zoomToPoint(arg = {coord: {}}){
        //zoom the map to the coordinate (delta is basically the zoom)
        //  the animation will take .75 seconds
        this.mapRef.animateToRegion({latitude: arg.coord.latitude, longitude: arg.coord.longitude, latitudeDelta: 0.01, longitudeDelta: 0.01}, this.mapAnimationDuration);
    }

    //Orients the map based on the mapPoint index we're currently observing
    setMapPosition(mapPointIndex){
        //set the zoom level and position of the map based on the current waypoint
        if(this.props.mapPoints
            && this.props.mapPoints.length > mapPointIndex
            && mapPointIndex >= 0){
            //get the current coordinate we're observing
            const coord = this.props.mapPoints[mapPointIndex].coordinate;
            //zoom into that coordinate
            this.zoomToPoint({coord: coord});
        }else{
            //if we aren't looking at a specific point, just zoom out to fit all points
            this.zoomToFitMapPoints(true);
        }
    }

    //Set the current marker
    setMarker(index){
        if(typeof this.props.onMapMarkerPressed === 'function'){
            //set the map position
            this.setMapPosition(index);
            //wait until the map is finished animating before we show the callout
            setTimeout(()=>{
                //show the current marker that was pressed
                if(index >= 0 && index < this.props.mapPoints.length){
                    this.tourPoints[index].ref.showCalloutIfNeeded();
                }
            }, this.mapAnimationDuration);
        }
    }

    markerPressed(index){
        //tell the parent view what we just did
        if(typeof this.props.onMapMarkerPressed === 'function'){
            this.props.onMapMarkerPressed(index);
        }
        this.setMarker(index);
        this.markerPressedAction = true;
    }

    mapPressed(){
        //if we didn't just press a marker, we want to hide the marker callout
        if(!this.markerPressedAction && (this.props.currentMapPointIndex >= 0 && this.props.currentMapPointIndex < this.props.mapPoints.length)){
            this.tourPoints[this.props.currentMapPointIndex].ref.hideCalloutIfNeeded();
        }
        this.markerPressedAction = false;
    }

    mapRegionChangeComplete(){ }

    //get all the tour points on the map that will be displayed
    getTourPoints() {
        if(this.props.mapPoints){
            //the index to be displayed on each point
            let pointIndex = 1;
            //for each mapPoint, format the markers
            return this.props.mapPoints.map((mapPoint, index) => {
                const noPointSelected = (this.props.currentMapPointIndex < 0 || this.props.currentMapPointIndex >= this.props.mapPoints.length);
                const isCurrentPoint = (this.props.currentMapPointIndex == index);

                //set the zIndex of the waypoint to be above all the others if it is the current index,
                //  otherwise have the first point above all of the others
                let zIndex = (isCurrentPoint || noPointSelected && index == 0)? 1000 : 0;

                if (mapPoint.isTourPoint() && mapPoint.isValidTourPoint()) {
                    let bubbleColor = null;
                    if(index == 0){bubbleColor = LIGHT_BLUE;}
                    else if (index == this.props.mapPoints.length - 1){bubbleColor = RED;}
                    else {bubbleColor = GOLD;}

                    //we need a reference to all of these markers somehow,
                    //  and this was the best way I could think of accomplishing that.
                    //  the references are to be able to update the markers based on the map position
                    let tourPoint = {};
                    tourPoint.marker = (
                        <MapMarker
                            mapPoint={mapPoint}
                            key={"mapPoint" + index}
                            ref={(ref) => {tourPoint.ref = ref}}
                            style={{zIndex: zIndex}}
                            isActive={isCurrentPoint}
                            onPress={this.markerPressed.bind(this)}
                            markerIndex={index}
                            icon={mapPoint.getIcon()}
                            bubbleColor={bubbleColor}
                            pointNumber={(pointIndex++)}/>
                    );

                    return tourPoint;
                }
            });
        }else{
            return [];
        }
    }

    //get all of the points in the tour that are not waypoints so we can make a more
    //  coherent route
    getWayPoints() {
        if(this.props.mapPoints){
            let wayPoints = [];
            for(let i = 0; i < this.props.mapPoints.length; i++){
                if(this.props.mapPoints[i].isValidTourPoint()){
                    wayPoints.push(this.props.mapPoints[i].coordinate);
                }
            }
            return <MapView.Polyline
                strokeWidth={5}
                strokeColor={RED}
                coordinates={wayPoints}/>
        }else{
            return [];
        }
    }

    render() {
        this.tourPoints = this.getTourPoints();
        this.wayPoints = this.getWayPoints();

        return (
            <View style={[this.props.style, styles.container]}>
                <MapView
                    onLayout={this.onMapLoad.bind(this)}
                    onRegionChangeComplete={this.mapRegionChangeComplete.bind(this)}
                    onPress={this.mapPressed.bind(this)}
                    showsUserLocation={true}
                    style={styles.map}
                    ref={(ref) => {this.mapRef = ref}}>
                    {this.tourPoints.map((tourPoint)=>{if(tourPoint){return tourPoint.marker}})}
                    {this.wayPoints}
                </MapView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {},
    map: {
        flex: 1,
        alignSelf: 'stretch'
    }
});

Map.propTypes = {
    mapRect: React.PropTypes.object,
    mapPoints: React.PropTypes.array,
    routePoints: React.PropTypes.array
}
