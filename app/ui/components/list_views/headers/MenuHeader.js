import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Animated
} from 'react-native';

export default class MenuHeader extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <Animated.View style={[styles.header, this.props.style]}>
                <View style={styles.spacerView}></View>
                <Text>{'WALK WEST CENTRAL'}</Text>
                <Image
                  style={[styles.bar, styles.headerImage]}
                  source={require('WalkWestCentral/app/resources/img/whitworth-logo-horizontal-reverse-rgb.png')}/>
                <View style={styles.spacerView}></View>
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
      alignSelf: 'stretch',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    bar: {
      height: null,
      width: null,
      alignSelf: 'stretch',
      resizeMode: 'contain'
    },
    headerImage:{
        opacity: 1,
        flex: 1
    },
    logo:{
        width: null,
        height: null,
        alignSelf: 'stretch',
        resizeMode: 'contain',
    },
    spacerView:{
      flex: 1
    }
});
