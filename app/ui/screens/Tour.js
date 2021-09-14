//REACT
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    LayoutAnimation,
    TouchableHighlight,
    PanResponder
} from 'react-native';

const Dimensions = require('Dimensions');
//STYLES
import {
    TITLE_TEXT_STYLES,
    MAIN_TEXT_STYLES,
    BLACK,
    RED,
    WHITE,
    LIGHT_BLUE,
    BLUE
} from 'WalkWestCentral/app/util/Definitions';
//MANAGERS
import LocationManager from 'WalkWestCentral/app/util/managers/LocationManager';
import TourManager from 'WalkWestCentral/app/util/managers/TourManager';
import AudioManager from 'WalkWestCentral/app/util/managers/AudioManager';
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';
//COMPONENTS
import ScreenBase from 'WalkWestCentral/app/ui/screens/ScreenBase';
import Map from 'WalkWestCentral/app/ui/components/map/Map';
import TourInfo from 'WalkWestCentral/app/ui/components/map/TourInfo';
import AudioController from 'WalkWestCentral/app/ui/components/audio/AudioController';
import RoundedButton from 'WalkWestCentral/app/ui/components/buttons/RoundedButton';
//MODELS
import MapRect from 'WalkWestCentral/app/models/map/MapRect';
import MapPoint from 'WalkWestCentral/app/models/map/MapPoint';
import TourModel from 'WalkWestCentral/app/models/map/TourModel';
//CLASS
export default class TourScreen extends ScreenBase {

    constructor(props) {
        super(props);

        //get the parameters we passed into this object from the navigation
        const {state} = this.props.navigation;
        this.tour = TourManager.getTour(state.params.tourIndex);
        this.tourIndex = state.params.tourIndex;
        this.mapref = null; //set in render
        let currentMapPointIndex = -1;

        //bottomViewHeight refers to whether or not the bottom menu is expanded
        //currentTitle is the title above the play button
        //currentDescription is the description below the audio scrubber
        //tourPoints are the points that will be displayed on the map.
        //  the tourPoints will be filtered by type in the Map class before it is rendered
        this.state = {
            bottomViewHeight: 0,
            showInfoContainer: false,
            currentTitle: '',
            currentDescription: '',
            watchingLocation: false,
            currentMapPointIndex: currentMapPointIndex
        }

        //previous y position of gesture on bottom view
        this.startBottomPanGestureY = 0;
        this.bottomViewExpanded = false;
    }

    componentWillMount() {
        this.expandPanResponderSetup();
    }

    componentWillUnmount(){
        //if this view goes out of scope, we don't want to continue
        //  watching our current location
        LocationManager.stopWatchingLocation();
        AudioManager.stop();
    }

    nextButtonPressed(){
        this.goToNextTourPoint();
    }

    prevButtonPressed(){
        this.goToPrevTourPoint();
    }

    currentMapPointHasAudio(){
        const isInvalidIndex = (this.state.currentMapPointIndex >= this.tour.tourPoints.length || this.state.currentMapPointIndex < 0);
        return (!isInvalidIndex && this.tour.tourPoints[this.state.currentMapPointIndex].audioFile != null);
    }

    setTourInfoForIndex(index){
        const isInvalidIndex = (index >= this.tour.tourPoints.length || index < 0);
        const title = isInvalidIndex ? '' : this.tour.tourPoints[index].name;
        const description = isInvalidIndex ? '' : this.tour.tourPoints[index].tourDescription;

        if(!isInvalidIndex && this.tour.tourPoints[index].audioFile != null){
            AudioManager.setCurrentAudioFromAWS({filename: this.tour.tourPoints[index].audioFile});
        }else{
            AudioManager.stop();
        }

        this.setState({
            currentMapPointIndex: index,
            currentTitle:  title,
            currentDescription: description
        });
    }

    mapMarkerPressed(index){
        this.setTourInfoForIndex(index);
    }

    goToNextTourPoint(){
        let nextIndex = this.findNextTourPointIndex(this.state.currentMapPointIndex);
        this.setTourInfoForIndex(nextIndex);
    }

    goToPrevTourPoint(){
        let prevIndex = this.findPrevTourPointIndex(this.state.currentMapPointIndex);
        this.setTourInfoForIndex(prevIndex);
    }

    findNextTourPointIndex(index){
        for(let i = (index + 1); i <= this.tour.tourPoints.length; i++){
            if(i >= 0
                && i < this.tour.tourPoints.length
                && this.tour.tourPoints[i].isValidTourPoint()
                && this.tour.tourPoints[i].isTourPoint()){
                return i;
            }else if(i >= this.tour.tourPoints.length){
                return i
            }
        }
        return index;
    }

    findPrevTourPointIndex(index){
        for(let i = (index - 1); i >= -1; i--){
            if(i < this.tour.tourPoints.length
                && i >= 0
                && this.tour.tourPoints[i].isValidTourPoint()
                && this.tour.tourPoints[i].isTourPoint()){
                return i;
            }else if(i < 0){
                return i
            }
        }
        return index;
    }

    toggleWatchingLocation(){
        if(this.state.watchingLocation){
            this.startWatchingLocation();
        }else{
            this.stopWatchingLocation();
        }
    }

    startWatchingLocation(){
        //whenever our location updates, find the closest point to where we are
        LocationManager.startWatchingLocation({callback:(lastPosition)=>{
            TourManager.closeToPointInTour({
                tourIndex: this.tourIndex,
                withinRange: null,
                location: lastPosition,
                callback: (tourPoint) => {
                    //if we got a tourpoint back
                    if(tourPoint != null){
                        const pointIndex = this.tour.tourPoints.indexOf(tourPoint);
                        this.setTourInfoForIndex(pointIndex);
                    }
                }
            });
        }});
        this.setState({
            watchingLocation: true
        });
    }

    stopWatchingLocation(){
        LocationManager.stopWatchingLocation();
        this.setState({
            watchingLocation: false
        });
    }

    handleBackButton(){
        super.handleBackButton();
        this.stopWatchingLocation();
    }

    exitTour(){
        this.handleBackButton();
    }

    startTour(){
        this.goToNextTourPoint();
        this.startWatchingLocation();
        this.showInfoContainer();
    }

    previewTour(){
        this.goToNextTourPoint();
        this.showInfoContainer();
    }

    render() {
        //should the bottom view be expanded or not?
        let bottomViewStyles = [styles.bottomView, {height: this.state.bottomViewHeight}];
        //should we hide the info container?
        let infoContainerStyles = [styles.infoContainer, (this.state.showInfoContainer ? {flex: 0, marginBottom: 10} : {height: 0})];
        //if we have a title, make it uppercase, otherwise don't display a title
        let title = this.state.currentTitle ? this.state.currentTitle.toUpperCase() : '';
        //should the play button be active or not?
        let playButtonActive = this.currentMapPointHasAudio();

        let startEndView = null;
        //start tour view
        if(this.state.currentMapPointIndex < 0){
            startEndView = (
                <View style={styles.startEndView}>
                    <RoundedButton
                        onPress={this.startTour.bind(this)}
                        backgroundColor={BLUE}
                        title={'Start Tour'}/>
                    <RoundedButton
                        onPress={this.previewTour.bind(this)}
                        backgroundColor={BLACK}
                        title={'Preview Tour'}/>
                </View>
            )
        }
        //end tour view
        if(this.state.currentMapPointIndex >= this.tour.tourPoints.length){
            startEndView = (
                <View style={styles.startEndView}>
                    <RoundedButton
                        onPress={this.exitTour.bind(this)}
                        backgroundColor={RED}
                        title={'Exit Tour'}/>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <View style={styles.contentContainer}>
                    <Map
                        ref={ref => this.mapref = ref}
                        currentMapPointIndex={this.state.currentMapPointIndex}
                        mapPoints={this.tour.tourPoints}
                        onMapMarkerPressed={this.mapMarkerPressed.bind(this)}
                        style={styles.map}/>
                        {startEndView}
                </View>
                <View {...this.expandPanResponder.panHandlers} style={infoContainerStyles}>
                    <Text
                        numberOfLines={1}
                        adjustsFontSizeTofit={true}
                        style={[TITLE_TEXT_STYLES, styles.titleText]}>
                        {title}
                    </Text>
                    <AudioController
                        playButtonActive={playButtonActive}
                        onPrev={this.prevButtonPressed.bind(this)}
                        onNext={this.nextButtonPressed.bind(this)}/>
                </View>
                <View style={bottomViewStyles}>
                    <TourInfo description={this.state.currentDescription}/>
                </View>
            </View>
        )
    }

    expandPanResponderSetup() {
        this.expandPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => {
                return true;
            },
            onPanResponderGrant: (evt, gestureState) => {
                this.startBottomPanGestureY = this.state.bottomViewHeight;
            },
            onPanResponderMove: (evt, gestureState) => {
                this.setState({
                    bottomViewHeight: -gestureState.dy + this.startBottomPanGestureY
                });
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                this.toggleBottomViewHeight();
            },
            onPanResponderTerminate: (evt, gestureState) => {
                this.toggleBottomViewHeight();
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return true;
            }
        });
    }

    toggleBottomViewHeight() {
        let windowHeight = Dimensions.get('window').height;
        let halfWindow = windowHeight / 2;
        let shouldTransition = false;

        if (this.bottomViewExpanded) {
            shouldTransition = this.state.bottomViewHeight < halfWindow / 1.5;
        } else {
            shouldTransition = this.state.bottomViewHeight >= halfWindow / 4;
        }

        //toggle the view
        this.bottomViewExpanded = shouldTransition
            ? !this.bottomViewExpanded
            : this.bottomViewExpanded;
        let newBottomViewHeight = this.bottomViewExpanded
            ? halfWindow
            : 0;

        //next render cycle will have this animation
        LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        this.setState({bottomViewHeight: newBottomViewHeight})
    }

    showInfoContainer(){
        //next render cycle will have this animation
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        this.setState({showInfoContainer: true})
    }

    hideInfoContainer(){
        //next render cycle will have this animation
        // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
        this.setState({showInfoContainer: false})
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: BLACK
    },
    contentContainer:{
        flex: 1,
        alignSelf: 'stretch'
    },
    startEndView:{
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextStyles:{

    },
    map: {
        flex: 1,
        alignSelf: 'stretch'
    },
    expandText: {
        color: WHITE
    },
    bottomView: {
        alignSelf: 'stretch',
        backgroundColor: BLACK
    },
    infoContainer: {
        alignSelf: 'stretch',
        marginBottom: 0
    },
    titleText: {
        padding: 0,
        paddingTop: 10
    }
});

//tourIndex refers to what tour we're looking at in the TourManager.tours
TourScreen.propTypes = {
    tourIndex: React.PropTypes.number
}
