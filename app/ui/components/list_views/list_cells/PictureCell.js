import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableHighlight
} from 'react-native';
//MANAGERS
import FileManager from 'WalkWestCentral/app/util/managers/FileManager';
//DEFINITIONS
import {
    WHITE,
} from 'WalkWestCentral/app/util/Definitions';

//VIEW FOR THE PICTURE CELLS
export default class PictureCell extends Component{
    constructor(props){
        super(props);

        this.state = {
            dynamicImage: null
        }
    }

    componentDidMount(){}

    //if the dynamicImageURL is set, this function will load the image
    loadImage(){
        if(typeof this.props.loadImage === 'function'){
            this.props.loadImage({callback:(image)=>{
                this.setState({
                    dynamicImage: image
                });
            }});
        }
    }

    render(){
        let iconWidth = this.props.iconImage ? {flex: 1} : {flex: 0.2};
        let cellHeight = (this.props.backgroundImage || this.props.dynamicImage || this.props.tallCell) ? {height: 150} : {height: 75};
        let borderWidth = 0.4;
        let borderColor = WHITE;
        let cellBorder =  {
            borderBottomWidth: borderWidth,
            borderBottomColor: borderColor,
        };

        let title = this.props.title ? this.props.title.toUpperCase() : '';
        let imageSource = null;
        if(this.state.dynamicImage != null){
            imageSource = {uri: this.state.dynamicImage};
        }else if(this.props.dynamicImage != null){
            imageSource = {uri: this.props.dynamicImage};
        }else{
            imageSource = this.props.backgroundImage;
        }

        return(
            <TouchableHighlight
                style={this.props.style}
                onPress={this.onPressCell.bind(this)}>
                <View style={[styles.cellContainer, cellHeight, cellBorder]}>
                        <Image style={styles.cellImage} source={imageSource}/>
                        <View style={styles.cellImageDimmer}></View>
                        <View style={styles.cellContentContainer}>
                            <View style={[styles.cellIconContainer, iconWidth]}>
                                <Image style={styles.cellIcon} source={this.props.iconImage}/>
                            </View>
                            <View style={styles.cellTextContainer}>
                                <Text style={styles.cellText}>
                                    {title}
                                </Text>
                            </View>
                        </View>
                </View>
            </TouchableHighlight>
        );
    }

    //action to be called when the user presses the cell
    onPressCell(){
        if(this.props.callback != null &&
            typeof this.props.callback === 'function'){
            this.props.callback();
        }
    }
}

//STYLES FOR THE VIEW
const styles = StyleSheet.create({
    cellContainer: {
        height: 150,
        flex: 1,
    },
    cellImageDimmer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'black',
        opacity: 0.55,
    },
    cellImage: {
        width: null,
        height: null,
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
    },
    cellContentContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellIconContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellIcon: {
        resizeMode: 'contain',
        height: 30,
        width: 30,
    },
    cellTextContainer: {
        flex: 2.5,
    },
    cellText: {
        backgroundColor: 'rgba(0,0,0,0)',
        color: 'white',
        fontSize: 23,
        fontWeight: 'bold',
    }
});

PictureCell.propTypes = {
    title: React.PropTypes.string.isRequired,
    backgroundImage: React.PropTypes.number,
    iconImage: React.PropTypes.number,
    callback: React.PropTypes.func,
}
