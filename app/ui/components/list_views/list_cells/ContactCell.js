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
  GREY,
} from 'WalkWestCentral/app/util/Definitions';

export default class ContactCell extends Component{
  constructor(props){
    super(props);
  }

  onPress(){
      if(this.props.callback && typeof this.props.callback === 'function'){
          this.props.callback();
      }
  }

  render(){
    return(
      <TouchableHighlight onPress={this.onPress.bind(this)}>
        <View style={styles.container}>
          <Text style={styles.content}>
            {this.props.content}
          </Text>
          <Image style={styles.icon} source={this.props.icon}/>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.25)',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row'
  },
  content:{
    color: GREY,
    fontSize: MAIN_FONT_SIZE,
    flex: 10
  },
  icon:{
    width: null,
    height: 20,
    flex: 1,
    resizeMode: 'contain',
  }
});
