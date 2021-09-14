//REACT
import React, { Component } from 'react';
import {
  TouchableHighlight,
  View,
  StyleSheet,
  Text,
  Image
} from 'react-native';
//DEFINITIONS
import {
  MAIN_FONT_SIZE,
  BLACK,
  LIGHT_BLUE,
  BLUE,
  GOLD,
  RED,
  WHITE,
  GREY,
} from 'WalkWestCentral/app/util/Definitions';
//CLASS
export default class InfoCell extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <View style={styles.textContainer}>
                        <Text style={styles.text}>{this.props.title}</Text>
                    </View>
                    <View style={styles.imageContainer}>
                        <View style={styles.spacer}></View>
                        <Image style={styles.image} source={this.props.backgroundImage}/>
                        <View style={styles.spacer}></View>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        height: 150,
        flex: 1,
    },
    contentContainer:{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        alignSelf: 'stretch'
    },
    textContainer:{
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text:{
        color: WHITE,
        fontWeight: 'bold',
        letterSpacing: -1
    },
    imageContainer:{
        height: 100,
        marginTop: -25,
        alignSelf: 'stretch',
        flexDirection: 'row',
    },
    image:{
        width: null,
        height: null,
        flex: 1,
        alignSelf: 'stretch',
        resizeMode: 'contain'
    },
    spacer:{
        width: 50,
    }
});
