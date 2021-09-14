import {
    DeviceEventEmitter
} from 'react-native';
//UTILITIES
import RNAudioStreamer from 'react-native-audio-streamer';
//MANAGERS
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';

class AudioManager {
    constructor() {
        //Flag indicating whether or not we're currently playing an audio file
        this.isPlaying = false;
        //Current audio file loaded
        this.currentAudio = null;
        //Current time in seconds
        this.currentTime = 0;
        //Current progress --> number between 0 and 1
        this.currentProgress = 0;
        //Current timeout that will be used to call an update functione once per second
        this.currentTimeout = null;
        //This is an associative array of objects that will allow other objects
        //  to listen to the progress of the audio file
        this.listeners = [];
        //observer
        this.subscription = DeviceEventEmitter.addListener('RNAudioStreamerStatusChanged',this._statusChanged.bind(this))
    }

    //This function lets us know what the native code is up to
    _statusChanged(status) {
        //Debugging statements
        console.log('Audio Status: '+status);

        //these are all of the possible states for the audio streamer
        //  according to the documentation
        switch (status) {
            case 'PLAYING':
                break;
            case 'PAUSED':
                break;
            case 'STOPPED':
                break;
            case 'FINISHED':
                //we've finished playing
                this.stop();
                this.alert_audioPlaybackComplete();
                break;
            case 'BUFFERING':
                break;
            case 'ERROR':
                break;
            default:
                break;
        }
    }

    //Sets the current audio file that is being observed
    //  the onReady function will only be called if there wasn't an error
    //  loading the file
    setCurrentAudio(arg = {url: null, onReady: () => {}}) {
        if(arg.url != null && arg.url !== this.currentAudio){
            //remember if we were playing when the file changed
            const wasPlaying = this.isPlaying;
            //stop the current file so that the status for the next file is correct
            this.stop();
            //set the url for the next file
            RNAudioStreamer.setUrl(arg.url);
            this.currentAudio = arg.url;

            // TODO: get the current duration for the song here
            //apparently the audio file needs to be playing in order for the duration
            //  to work correctly, so now we're stuck with 0:00 until someone presses play
            this.setCurrentDuration({limit: 1});
            this.currentProgress = this.getPlaybackProgress();

            //if we were playing but the file changed, start playing the next file
            if(wasPlaying){
                this.play();
            }
        }
    }

    //This sets the state of the current file length being observed
    setCurrentDuration(arg = {limit: null, callback:()=>{}}){
        this.recursiveGetDuration({limit: arg.limit, callback:(duration)=>{
            //remember how long the current audio stream is
            this.currentAudioDuration = duration;
            //alert our listeners
            this.alert_audioPlaybackTimeChange();
            this.alert_audioPlaybackProgressChange();

            if(typeof arg.callback === 'function'){
                arg.callback();
            }
        }});
    }

    //This function will check once a second to see if the duration is valid.
    //  We need this because the react-native-audio-streamer duration call returns
    //  either 0 or a negative number if the mp3 file hasn't buffered enough.
    //  Once it's valid, it will stop checking
    recursiveGetDuration(arg = {limit: null, callback:(duration)=>{}}){
        if(this.currentAudio !== null && (arg.limit == null || --arg.limit >= 0)){
            //delay our check by 1000ms
            setTimeout(()=>{
                RNAudioStreamer.duration((err, duration)=>{
                    if(!err){
                        if(duration > 0 || arg.limit == 0){
                            //If we have a callback function
                            if (typeof arg.callback === 'function') {
                                arg.callback(duration);
                            }
                        }else{
                            //we need to check again because it hasn't loaded enough yet
                            this.recursiveGetDuration({limit: arg.limit, callback: arg.callback});
                        }
                    }
                });
            }, 1000);
        }
    }

    //Sets the current audio file to whatever the filename passed in
    //  stored in the amazon s3 bucket
    setCurrentAudioFromAWS(arg = {filename: '', onReady:()=>{}}){
        const url = NetworkManager.getAWSURLForAudio(arg.filename);
        this.setCurrentAudio({url: url, onReady:()=>{
            if(typeof arg.onReady === 'function'){
                arg.onReady();
            }
        }});
    }

    //The callback function returns the percent complete of the audio file
    getPlaybackProgress() {
        if (this.currentAudioDuration != null && this.currentAudioDuration > 0){
            let progress = this.currentTime / this.currentAudioDuration;
            return progress;
        }
        return 0;
    }

    //This will add an object to the array of listeners.
    //  the object must implement the alert_audioPlaybackProgressChange function
    //  in order to work correctly
    addListener(listenerObject) {
        this.listeners.push(listenerObject)
    }

    //This removes the listener from the array of listeners to be notified
    removeListener(listenerObject) {
        //if the object exists in the array of listeners, we want to delete it
        let index = this.listeners.indexOf(listenerObject);
        if (index != -1) {
            //remove the item from the array
            this.listeners.splice(index, 1)
        }
    }

    convertSecondsToMinutesAndSeconds(timeInSeconds) {
        timeInSeconds = Math.ceil(timeInSeconds);
        let minutes = Math.floor(timeInSeconds / 60);
        let seconds = timeInSeconds - (minutes * 60);
        //we want to always have two digits
        if (seconds < 10) {
            seconds = '0' + seconds
        }
        return minutes + ':' + seconds;
    }

    //Toggles the play/pause state of the current song (if there is one)
    togglePlayPause() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    updateCurrentPosition() {
        //if we're playing and we have an audio file
        if (this.isPlaying) {
            //update the current time every 100 milliseconds
            this.currentTimeout = setTimeout(() => {
                //get the current time in seconds
                RNAudioStreamer.currentTime((err, currentTime)=>{
                    if(!err){
                        //update the current time
                        this.currentTime = currentTime;
                        //update the current progress
                        this.currentProgress = this.getPlaybackProgress();
                        //alert the listeners that the progress changed
                        this.alert_audioPlaybackProgressChange();
                        this.alert_audioPlaybackTimeChange();
                        //update again after the timeout is set
                        this.updateCurrentPosition();
                    }
                });
            }, 100)
        }
    }

    setPlaybackProgress(progress) {
        let newTime = (this.currentAudioDuration || 0) * progress;
        RNAudioStreamer.seekToTime(newTime)
        this.currentTime = newTime;
        this.alert_manualProgressChange();
        this.alert_audioPlaybackTimeChange();
    }

    //Play the current audio file if there is one
    play() {
        console.log('playing');
        //we're now playing
        this.isPlaying = true;
        this.updateCurrentPosition();
        RNAudioStreamer.play();
        this.setCurrentDuration();
    }

    //Pause the current audio file if there is one
    pause() {
        console.log('pausing');
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
        //we've stopped playing
        this.isPlaying = false;
        RNAudioStreamer.pause();
    }

    //Stop the current audio file if there is one
    stop() {
        RNAudioStreamer.pause();
        //we've stopped playing
        this.isPlaying = false;
        RNAudioStreamer.setUrl('');
        this.currentAudio = null;
        this.currentTime = 0;
        this.setPlaybackProgress(0);
        this.alert_audioPlaybackTimeChange();
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
        }
    }

    //ALERTS--------------------------------------------------------
    //This is called during the playback of the current audio file
    alert_audioPlaybackProgressChange() {
        //for every listener we're observing
        for (let i = 0; i < this.listeners.length; i++) {
            let listener = this.listeners[i];
            //if the listener has implemented the alert_audioPlaybackProgressChange funtion
            if (typeof listener.alert_audioPlaybackProgressChange === 'function') {
                listener.alert_audioPlaybackProgressChange(this.currentProgress);
            }
        }
    }

    //Called when the user manually changes the progress of the song using setPlaybackProgress
    alert_manualProgressChange() {
        //for every listener we're observing
        for (let i = 0; i < this.listeners.length; i++) {
            let listener = this.listeners[i];
            //if the listener has implemented the alert_audioPlaybackProgressChange funtion
            if (typeof listener.alert_audioPlaybackProgressChange === 'function') {
                listener.alert_manualProgressChange(this.currentProgress);
            }
        }
    }

    //Called when the audio clip finishes playing
    alert_audioPlaybackComplete() {
        //for every listener we're observing
        for (let i = 0; i < this.listeners.length; i++) {
            let listener = this.listeners[i];
            //if the listener has implemented the alert_audioPlaybackComplete function
            if (typeof listener.alert_audioPlaybackComplete === 'function') {
                listener.alert_audioPlaybackComplete();
            }
        }
    }

    //Called whenever the time is changed
    alert_audioPlaybackTimeChange() {
        //for every listener we're observing
        for (let i = 0; i < this.listeners.length; i++) {
            let listener = this.listeners[i];
            //if the listener has implemented the alert_audioPlaybackTimeChange function
            if (typeof listener.alert_audioPlaybackTimeChange === 'function') {
                listener.alert_audioPlaybackTimeChange({
                    currentTime: Math.floor(this.currentTime),
                    currentTimeString: this.convertSecondsToMinutesAndSeconds(this.currentTime),
                    totalTime: (this.currentAudioDuration || 0),
                    totalTimeString: this.convertSecondsToMinutesAndSeconds((this.currentAudioDuration || 0))
                });
            }
        }
    }
    //END ALERTS----------------------------------------------------
}

const instance = new AudioManager();
export default instance;
