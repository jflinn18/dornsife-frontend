//REACT
import React, {Component} from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    Linking,
    Clipboard,
    Alert,
    Platform
} from 'react-native';
//COMPONENTS
import ScreenBase from 'WalkWestCentral/app/ui/screens/ScreenBase';
import ContactCell from 'WalkWestCentral/app/ui/components/list_views/list_cells/ContactCell';
//DEFINITIONS
import{
    SAVED_ICON,
    UNSAVED_ICON,
    WEBSITE_ICON,
    PHONE_ICON,
    ADDRESS_ICON,
    HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT,
    HEADER_SCROLL_DISTANCE,
    TITLE_TEXT_STYLES,
    MAIN_TEXT_STYLES
} from 'WalkWestCentral/app/util/Definitions';
//MANAGERS
import FileManager from 'WalkWestCentral/app/util/managers/FileManager';
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';
import BusinessManager from 'WalkWestCentral/app/util/managers/BusinessManager';

//CLASS
export default class Info extends ScreenBase {

    constructor(props) {
        super(props);
        const {state} = this.props.navigation;
        this.mapPoint = state.params.mapPoint;

        this.state = {
            savedInMyWestCentral: false,
            topImage: null
        }
    }

    componentDidMount(){
        // this.setupTopImage();
        this.isThisBusinessInMyWestCentral();
    }

    setupTopImage(){
        let {state} = this.props.navigation;
        const image = state.params.mapPoint.pictureFile;
        imageURL = image ? NetworkManager.getAWSURLForImage(image) : '';
        if(state && state.params){
            FileManager.getImageWithCaching({
                url: imageURL,
                numDaysBetweenCheck: 1,
                callback:(image)=>{
                    this.setState({
                        topImage: image.data
                    });
            }});
        }
    }

    //make the contact sections for the info screen
    //  based on the attributes the mapPoint has
    makeContactSections(){
        let contactInfo = [];
        if(this.mapPoint){
            if(this.mapPoint.address){
                contactInfo.push(<ContactCell
                    callback={this.goToAddress.bind(this)}
                    key={'Address'}
                    icon={ADDRESS_ICON}
                    content={this.mapPoint.address}/>);
            }
            if(this.mapPoint.phone){
                contactInfo.push(<ContactCell
                    callback={this.copyPhoneToClipboard.bind(this)}
                    key={'Phone'}
                    icon={PHONE_ICON}
                    content={this.mapPoint.phone}/>);
            }
            if(this.mapPoint.website){
                contactInfo.push(<ContactCell
                    callback={this.goToWebsite.bind(this)}
                    key={'Website'}
                    icon={WEBSITE_ICON}
                    content={this.mapPoint.website}/>);
            }

            //is this place saved in MyWestCentral?
            let saveIcon = this.state.savedInMyWestCentral ? SAVED_ICON : UNSAVED_ICON;
            contactInfo.push(<ContactCell
                callback={this.toggleSavedToMyWestCentral.bind(this)}
                key={'Save'}
                icon={saveIcon}
                content={"Save this place"}/>);
        }
        return contactInfo;
    }

    //Makes the additional website sections at the bottom of the Info screen
    makeAdditionalResourcesSections(){
        let resources = [];
        //if we actually have additional websites
        if(this.mapPoint.additionalWebsites != null && this.mapPoint.additionalWebsites.length > 0){
            //add a title to the resources section if there are additional resources
            resources.push(
                <Text key={'resouce_title'} style={[TITLE_TEXT_STYLES, styles.additionalResources]}>{'ADDITIONAL RESOURCES'}</Text>
            );

            //make the additional resource sections
            for(let i = 0; i < this.mapPoint.additionalWebsites.length; i++){
                const contactCell = (
                    <ContactCell
                        callback={()=>{
                            this.openWebsite(this.mapPoint.additionalWebsites[i]);
                        }}
                        key={'Website'+i}
                        icon={WEBSITE_ICON}
                        content={this.mapPoint.additionalWebsites[i]}/>
                )
                resources.push(contactCell);
            }
        }
        return resources;
    }

    goToAddress(){
        let name = '';
        //open maps up in ios
        if(Platform.OS === 'ios'){
            //format name for apple url
            if(this.mapPoint.name != null){name = this.mapPoint.name.split(' ').join('+');}
            let url = `http://maps.apple.com/?q=${name}&sll=${this.mapPoint.coordinate.latitude},${this.mapPoint.coordinate.longitude}`;
            Linking.openURL(url).catch(err => console.error('An error occurred while opening Apple Maps', err));
        }else if(Platform.OS === 'android'){
            //format name for google url
            if(this.mapPoint.name != null){name = this.mapPoint.name;}
            let url = `http://maps.google.com/maps?q=${this.mapPoint.coordinate.latitude},${this.mapPoint.coordinate.longitude}+(${this.mapPoint.name})`;
            Linking.openURL(url).catch(err => console.error('An error occurred while opening Google Maps', err));
        }
    }

    //go to the homepage website for the mapPoint being observed
    goToWebsite(){
        this.openWebsite(this.mapPoint.website);
    }

    //open a website in an external browser
    openWebsite(url){
        Linking.openURL(url).catch(err => console.error('An error occurred opening the url given', err));
    }

    //Copy the phone number of the mapPoint to the clipboard and then alert the user
    copyPhoneToClipboard(){
        //copy the phone number to the clipboard
        Clipboard.setString(this.mapPoint.phone);
        //tell the user we copied the phone number to the clipboard
        Alert.alert(
          'Copied',
          'The phone number has been copied to your clipboard',
          [
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
      )
    }

    //check to see if we've saved this business before
    // if we have, set the state to indicate that
    isThisBusinessInMyWestCentral(){
        BusinessManager.getBusinessesInMyWestCentral({callback:(businesses)=>{
            //if our mapPoint is null, it's not saved
            //  but if the ID is in the businesses, we've saved it
            let saved = (this.mapPoint == null || businesses[this.mapPoint.ID] != null)
            this.setState({
                savedInMyWestCentral: saved
            });
        }});
    }

    saveThisBusinessToMyWestCentral(){
        BusinessManager.saveBusinessToMyWestCentral({business: this.mapPoint, callback:()=>{
            this.isThisBusinessInMyWestCentral();
        }});
    }

    unsaveThisBusinessToMyWestCentral(){
        BusinessManager.unsaveBusinessToMyWestCentral({business: this.mapPoint, callback:()=>{
            this.isThisBusinessInMyWestCentral();
        }});
    }

    toggleSavedToMyWestCentral(){
        if(this.state.savedInMyWestCentral){
            this.unsaveThisBusinessToMyWestCentral();
        }else{
            this.saveThisBusinessToMyWestCentral();
        }
    }

    render() {
        let {state} = this.props.navigation;
        let placeTitle = '';
        let placeDescription = '';
        if(state.params){
            if(state.params.mapPoint.name != null){
                placeTitle = state.params.mapPoint.name.toUpperCase();
            }
            placeDescription = state.params.mapPoint.description;
        }

        //do we have an image?
        let imageContainer = (<View/>);
        //if we got an imageURL, display the image container
        if(this.state.topImage != null || state.params.mapPoint.pictureFile != null){
            imageContainer = (
                <View style={styles.imageContainer}>
                    <Image
                        style={styles.image}
                        source={{uri: (this.state.topImage || NetworkManager.getAWSURLForImage(state.params.mapPoint.pictureFile))}}/>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                {super.renderHeader()}
                <ScrollView style={styles.container}>
                    {imageContainer}
                    <Text style={TITLE_TEXT_STYLES}>{placeTitle}</Text>
                    <View style={styles.contactInfoContainer}>
                        {this.makeContactSections()}
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={MAIN_TEXT_STYLES}>
                            {placeDescription}
                        </Text>
                    </View>
                    <View style={styles.contactInfoContainer}>
                        {this.makeAdditionalResourcesSections()}
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'black'
    },
    imageContainer: {
        height: HEADER_MAX_HEIGHT,
        overflow: 'hidden'
    },
    image: {
        width: null,
        height: null,
        flex: 1
    },
    contactInfoContainer: {},
    textContainer: {
        padding: 12,
        flex: 1,
        justifyContent: 'center',
    },
    additionalResources:{
        marginTop: 20
    }
});
