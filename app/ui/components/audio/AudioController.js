//REACT
import React, {Component} from 'react';
import {
    View,
    Image,
    StyleSheet,
    Animated,
    Easing,
    TouchableHighlight,
    PanResponder,
    Text
} from 'react-native';
//STYLES
import {WHITE, RED} from 'WalkWestCentral/app/util/Definitions';
//UTILITIES
import _ from 'underscore';
//MANAGERS
import AudioManager from 'WalkWestCentral/app/util/managers/AudioManager';

//constants to help with the UI
const scrubberHeight = 4;
const scrubberContainerHeight = 25;

//CLASS
export default class AudioController extends Component {
    constructor(props) {
        super(props);

        this.audioManager = AudioManager;

        this.state = {
            audioScrubberProgress: new Animated.Value(0),
            playing: false,
            totalTime: '0:00',
            currentTime: '0:00'
        }

        //we want to listen for progress changes from the AudioManager
        this.audioManager.addListener(this);

        //whether or not the user is dragging the scrubber
        this.isPanningScrubber = false;

        //these values are set in the onLayout function of the scrubber during render.
        //these can't be in state because it would cause infinite recursion.
        //we need to remember the width of the audio scrubber
        this.audioScrubberWidth = 0;
        //we need to know what the starting x position of the audio scrubber is
        this.currentScrubberPos = 0;
    }

    componentWillMount() {
        //set up the pan responder for the bottom view
        this.scrubberPanResponderSetup();
    }

    componentWillUnmount() {
        //when the component is removed from the view, we want to stop the audioManager
        //  from playing and remove ourselves as a listener from the notifications
        this.audioManager.stop()
        this.audioManager.removeListener(this);
    }

    render() {
        //if the player is currently playing, show the pause button
        //  otherwise show the play button
        let playStatusImage = this.audioManager.isPlaying
            ? require('WalkWestCentral/app/resources/img/pause_button.png')
            : require('WalkWestCentral/app/resources/img/play_button.png');

        //left and right buttons for changing the audio
        let backButtonImage = require('WalkWestCentral/app/resources/img/back_button.png');
        let forwardButtonImage = require('WalkWestCentral/app/resources/img/forward_button.png');

        //scrubber dimensions
        let scrubberHandleSize = this.isPanningScrubber ? scrubberContainerHeight : 15;
        let scrubberHandleStyle = {
            width: scrubberHandleSize,
            height: scrubberHandleSize,
            borderRadius: scrubberHandleSize / 2
        };
        let audioScrubberProgressWidth = this.state.audioScrubberProgress;
        let spacerWidth = this.state.audioScrubberProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        });

        //if playButtonActive is undefined or true, have full brightness, otherwise dim to show it's inactive
        let activeStyles = (this.props.playButtonActive == null || this.props.playButtonActive) ? {} : {opacity: 0.3};

        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.navContainer}>
                    <View style={[styles.genericButtonContainer]}>
                        <TouchableHighlight
                            onPress={this.handlePrevButton.bind(this)}
                            style={styles.leftRightButton}>
                            <Image
                                style={styles.leftRightImage}
                                source={backButtonImage}/>
                        </TouchableHighlight>
                    </View>
                    <TouchableHighlight
                        onPress={this.handlePlayPauseButton.bind(this)}
                        style={[styles.playPauseButton, activeStyles]}>
                        <View style={[styles.playStateContainer, styles.genericButtonContainer]}>
                            <Image style={styles.playStateImage} source={playStatusImage}/>
                        </View>
                    </TouchableHighlight>
                    <View style={styles.genericButtonContainer}>
                        <TouchableHighlight
                            onPress={this.handleNextButton.bind(this)}
                            style={styles.leftRightButton}>
                            <Image
                                style={styles.leftRightImage}
                                source={forwardButtonImage}/>
                        </TouchableHighlight>
                    </View>
                </View>

                <View style={[styles.scrubberInfoContainer, activeStyles]}>

                    <View style={styles.scrubberInfo}>

                        <View style={styles.scrubberTimeContainer}>
                            <Text style={[styles.scrubberTime, styles.currentTime]}>{this.state.currentTime}</Text>
                            <Text style={[styles.scrubberTime, styles.totalTime]}>{this.state.totalTime}</Text>
                        </View>

                        <View style={styles.scrubberContainer}>
                            <View ref={ref => this.scrubberView = ref}
                                    style={styles.scrubber}
                                    onLayout={(event) => {
                                        this.audioScrubberWidth = event.nativeEvent.layout.width - (2*scrubberContainerHeight);
                                    }}>

                                <Animated.View
                                    style={[styles.scrubberProgress, {flex: audioScrubberProgressWidth}]}/>
                                <View {...this.scrubberPanResponder.panHandlers}
                                    style={[scrubberHandleStyle, styles.scrubberHandle]}/>
                                <Animated.View
                                    style={[styles.scrubberSpacer, {flex: spacerWidth}]}/>

                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    scrubberPanResponderSetup() {
        this.scrubberPanResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                this.isPanningScrubber = true;
                this.currentScrubberPos = this.state.audioScrubberProgress._value;
            },
            onPanResponderMove: (evt, gestureState) => {
                //don't let the user move the scrubber if the player is set to inactive
                if(this.props.playButtonActive == null || this.props.playButtonActive){
                    //progress is how far your finger is progress wise relative to the scrubber view
                    let progress = gestureState.dx / this.audioScrubberWidth;
                    progress += this.currentScrubberPos

                    if (progress < 0) {
                        this.state.audioScrubberProgress.setValue(0);
                        this.audioManager.setPlaybackProgress(0);
                    } else if (progress >= 0 && progress <= 1) {
                        this.state.audioScrubberProgress.setValue(progress);
                        this.audioManager.setPlaybackProgress(progress);
                    } else if (progress > 1) {
                        this.state.audioScrubberProgress.setValue(1);
                        this.audioManager.setPlaybackProgress(1);
                    }
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                let progress = gestureState.dx / this.audioScrubberWidth;
                progress += this.currentScrubberPos;
                if (progress >= 0 && progress < 1) {
                    this.audioManager.setPlaybackProgress(progress);
                }
                this.isPanningScrubber = false;
            },
            onPanResponderTerminate: (evt, gestureState) => {},
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return true;
            }
        });
    }

    handlePlayPauseButton() {
        if(this.props.playButtonActive == null || this.props.playButtonActive){
            this.audioManager.togglePlayPause();
            this.setState({playing: this.audioManager.isPlaying});
        }
    }

    handleNextButton() {
        if (typeof this.props.onNext === 'function') {
            this.props.onNext();
        }
    }

    handlePrevButton() {
        //Get the current playback progress
        //  if it's greater than 0, reset it to the beginning of
        //  the audio clip
        this.audioManager.getPlaybackProgress({
            callback: (progress) => {
                if (progress > 0) {
                    this.audioManager.setPlaybackProgress(0);
                }
            }
        });

        if (typeof this.props.onPrev === 'function') {
            this.props.onPrev();
        }
    }

    //updates the progress of the scrubber.
    //  called by the AudioManager
    alert_audioPlaybackProgressChange(progress) {
        //don't change the position of the scrubber if the user is panning
        if (!this.isPanningScrubber) {
            //animate the audio progress bar
            Animated.timing(this.state.audioScrubberProgress, {
                toValue: progress,
                duration: 50,
                easing: Easing.inOut(Easing.ease)
            }).start();
        }
    }

    alert_manualProgressChange(progress) {}

    //called by the AudioManager
    alert_audioPlaybackTimeChange(arg = {
        currentTime: 0,
        totalTime: 0
    }) {
        this.setState({currentTime: arg.currentTimeString, totalTime: arg.totalTimeString});
    }

    alert_audioPlaybackComplete() {
        this.render();
    }
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
    },
    navContainer: {
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    playStateContainer: {
        borderRadius: 40,
        borderColor: WHITE,
        borderWidth: 2
    },
    playPauseButton: {},
    playStateImage: {},
    genericButtonContainer: {
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        marginBottom: 0,
    },
    leftRightButton: {
        alignSelf: 'stretch',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    leftRightImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    scrubberInfoContainer: {},
    scrubberInfo: {
        marginLeft: 50,
        marginRight: 50
    },
    scrubberContainer: {
        height: scrubberContainerHeight,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    scrubberTimeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    scrubberTime: {
        color: WHITE,
        marginBottom: 7,
        fontSize: 10
    },
    currentTime: {
        textAlign: 'left'
    },
    totalTime: {
        textAlign: 'right'
    },
    scrubber: {
        flex: 1,
        height: scrubberContainerHeight,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: scrubberContainerHeight,
        paddingRight: scrubberContainerHeight,
        marginLeft: -scrubberContainerHeight,
        marginRight: -scrubberContainerHeight
    },
    scrubberProgress: {
        backgroundColor: RED,
        height: scrubberHeight,
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5,
        zIndex: 0,
    },
    scrubberHandle: {
        backgroundColor: RED,
        marginLeft: -6,
        marginRight: -6,
        zIndex: 1000,
    },
    scrubberSpacer: {
        backgroundColor: WHITE,
        opacity: 0.1,
        height: scrubberHeight,
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5,
        zIndex: 0,
    }
});
