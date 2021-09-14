//REACT
import React, { Component } from 'react';
import {
    View,
    Text,
    Animated,
    StyleSheet,
    Image,
    TouchableHighlight,
    Platform,
} from 'react-native';
//DEFINITIONS
import{
    WHITE,
    BLACK,
    RED
} from 'WalkWestCentral/app/util/Definitions';
//NODE IMPORTS
import MapView from 'react-native-maps';
//CONSTANTS
const BIG_MARKER_SIZE = 50;
const SMALL_MARKER_SIZE = 30;
//CLASS
export default class MapMarker extends Component{
    constructor(props){
        super(props);
        let diameter = (this.props.isActive && Platform.OS === 'ios') ? BIG_MARKER_SIZE : SMALL_MARKER_SIZE;
        this.state = {
            diameter: new Animated.Value(diameter),
            borderWidth: 0,
            icon: null,
            imageLoaded: false,
            imageRemoved: false,
            mapLoaded: false,
        }
        this.marker = null; //set in render
    }

    componentDidMount(){
        this.setState({
            icon: this.props.icon,
        });
    }

    highlightCurrentMarker(active){
        if(Platform.OS === 'ios'){
            let diameter = (active) ? BIG_MARKER_SIZE : SMALL_MARKER_SIZE;
            Animated.timing(this.state.diameter,{toValue:diameter, duration: 333}).start();
        }else if(Platform.OS === 'android'){
            //we need some kind of current point indicator for android since
            //  changing the size doesn't work very well, so we add a border
            let borderWidth = (active) ? 2 : 0;
            this.setState({
                borderWidth: borderWidth
            });
        }
    }

    showCalloutIfNeeded(active){
        if((active != null && !active) || this.props.isActive){
            this.marker.showCallout();
        }
    }

    hideCalloutIfNeeded(active){
        if((active != null && active) || this.props.isActive){
            this.marker.hideCallout();
        }
    }

    componentWillReceiveProps(props){
        this.highlightCurrentMarker(props.isActive);
    }

    onPress(){
        if(typeof this.props.onPress === 'function'){
            this.props.onPress(this.props.markerIndex);
        }
    }

    imageLoaded(){
        //This is literally the only way we can get images to show up for map icons in Android.
        if(!this.state.imageLoaded){
            //make the marker invisible
            this.setState({
                imageLoaded: true
            },()=>{
                //remove the image
                this.setState({
                    imageRemoved: true
                },()=>{
                    //load the marker again and then make it all super visible and stuff
                    this.setState({
                        imageRemoved: false
                    });
                });
            });
        }
    }

    mapLoaded(){
        if(!this.state.mapLoaded){
            this.setState({
                mapLoaded: true
            });
        }
    }

    render(){
        const borderRadius = this.state.diameter.interpolate({
            inputRange: [SMALL_MARKER_SIZE, BIG_MARKER_SIZE],
            outputRange: [SMALL_MARKER_SIZE/2, BIG_MARKER_SIZE/2]
        });

        const containerWidth = this.state.diameter.interpolate({
            inputRange: [SMALL_MARKER_SIZE, BIG_MARKER_SIZE],
            outputRange: [SMALL_MARKER_SIZE, BIG_MARKER_SIZE]
        });

        //so we know which one(s) is/are the start, middle, and end
        const numberBubbleColor = this.props.bubbleColor ? this.props.bubbleColor : RED;

        let imageView = null;
        if(Platform.OS === 'ios'){
            //IOS IMAGE VIEW
            imageView = (
                <TouchableHighlight
                    underlayColor={'rgba(0,0,0,0)'}
                    onPress={this.onPress.bind(this)}>
                    <Animated.View
                        style={[
                            styles.container,
                            {borderWidth: this.state.borderWidth},
                            {width: containerWidth, height: containerWidth, borderRadius: borderRadius}]}>

                        <Image
                            source={this.state.icon}
                            style={[styles.icon]}>
                        </Image>
                    </Animated.View>
                </TouchableHighlight>
            )
        }else{
            //ANDROID IMAGE VIEW
            //we have to do this dumb stuff because android sucks
            //  and can't load a damn image into a map.
            let image = !this.state.imageRemoved ? (
                <Image
                    onLoadEnd={this.imageLoaded.bind(this)}
                    source={this.state.icon}
                    style={[styles.icon, {opacity: this.state.imageLoaded ? 1 : 0}]}>
                </Image>
            ): <View/>;

            imageView = (
                <View
                    style={[
                        styles.container,
                        {borderWidth: this.state.borderWidth},
                        {width: SMALL_MARKER_SIZE, height: SMALL_MARKER_SIZE, borderRadius: SMALL_MARKER_SIZE/2}]}>
                    {image}
                </View>
            )
        }

        return(
            <MapView.Marker
                ref={ref => this.marker = ref}
                anchor={{x:0.5, y:0.5}}
                onLoadEnd={this.mapLoaded.bind(this)}
                coordinate={this.props.mapPoint.coordinate}
                title={this.props.mapPoint.name}
                description={this.props.mapPoint.description}
                style={[this.props.style,styles.marker]}>

                <View style={[styles.textContainer, {backgroundColor: numberBubbleColor}]}>
                    <Text style={styles.text}>{this.props.pointNumber}</Text>
                </View>
                
                {imageView}
            </MapView.Marker>
        )
    }
}

const styles = new StyleSheet.create({
    marker:{
        padding: (SMALL_MARKER_SIZE/4),
    },
    container:{
        backgroundColor: WHITE,
        width: SMALL_MARKER_SIZE,
        height: SMALL_MARKER_SIZE,
        borderRadius: SMALL_MARKER_SIZE/2,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderColor: RED
    },
    icon:{
        width: null,
        height: null,
        flex: 1,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer:{
        width: 15,
        height: 15,
        borderRadius: 7.5,
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: RED,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
    },
    text:{
        color: BLACK,
        textAlign: 'center',
        backgroundColor: 'rgba(0,0,0,0)',
        fontSize: 8,
        fontWeight: 'bold',
    },
    callout:{
        width: 100,
        height: 100,
        backgroundColor: BLACK
    }
});

MapMarker.propTypes = {
    isActive: React.PropTypes.bool.isRequired
}
