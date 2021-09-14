import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Navigator,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import TourScreen from 'WalkWestCentral/app/ui/screens/Tour';
import MainMenu from 'WalkWestCentral/app/ui/screens/MainMenu';
import App from './app/app';

export default class WalkWestCentral extends Component {
    render() {
        return(
            <App/>
        );
    }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('WalkWestCentral', () => WalkWestCentral);
