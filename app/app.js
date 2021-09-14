import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, Navigator, View} from 'react-native';
import {StackNavigator} from 'react-navigation';

import LocationManager from 'WalkWestCentral/app/util/managers/LocationManager';
import TourScreen from 'WalkWestCentral/app/ui/screens/Tour';
import MainMenu from 'WalkWestCentral/app/ui/screens/MainMenu';
import InfoScreen from 'WalkWestCentral/app/ui/screens/Info';
import TourListScreen from 'WalkWestCentral/app/ui/screens/TourList';
import BusinessCategoryListScreen from 'WalkWestCentral/app/ui/screens/BusinessCategoryList';
import BusinessListScreen from 'WalkWestCentral/app/ui/screens/BusinessList';
import MyWestCentralScreen from 'WalkWestCentral/app/ui/screens/MyWestCentral';

//DEFINE THE SCREENS FOR THE APP
const AppNavigator = StackNavigator({
    MainMenu: { screen: MainMenu, headerMode: 'none' },
    Tour: { screen: TourScreen },
    Info: { screen: InfoScreen },
    TourList:{ screen: TourListScreen },
    BusinessCategoryList:{ screen: BusinessCategoryListScreen },
    BusinessList:{ screen: BusinessListScreen },
    MyWestCentral:{ screen: MyWestCentralScreen },
}, {headerMode: 'screen'});

export default class App extends Component {
    constructor(props) {
        super(props);
        this.navigator = null;
    }

    navigationStackChanged(prevState, currentState){
        
    }

    render() {
        return (
            <View style={styles.container}>
                <AppNavigator
                    onNavigationStateChange={this.navigationStackChanged.bind(this)}
                    ref={nav => {this.navigator = nav;}}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignSelf: 'stretch'
    }
});
