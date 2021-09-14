//REACT
import React, {Component} from 'react';
import {
    View,
    ListView,
    StyleSheet,
    Text,
    Navigator,
    Animated,
    StatusBar
} from 'react-native';
//STYLES
import {
    HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT,
    HEADER_SCROLL_DISTANCE,
    STATUS_BAR_STYLES,
    ADDRESS_ICON,
    WALKING_ICON,
    SAVED_ICON_WHITE
} from 'WalkWestCentral/app/util/Definitions';
import AudioManager from 'WalkWestCentral/app/util/managers/AudioManager';
//COMPONENTS
import MenuHeader from 'WalkWestCentral/app/ui/components/list_views/headers/MenuHeader';
import {CellModel} from 'WalkWestCentral/app/models/list_cells/CellModel';
import GenericMenu from 'WalkWestCentral/app/ui/components/list_views/GenericMenu';
import ListScreenBase from 'WalkWestCentral/app/ui/screens/ListScreenBase';
//MANAGERS
import FileManager from 'WalkWestCentral/app/util/managers/FileManager';
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';

//CLASS
export default class MainMenu extends ListScreenBase {

    constructor(props) {
        super(props);

        //for navigating to the next screens
        const {navigate} = this.props.navigation;
    }

    componentDidMount(){
        let cells = [
            new CellModel({
                title: 'Take A Tour',
                dynamicImage: NetworkManager.getAWSURLForMisc('tours.jpg'),
                tallCell: true,
                iconImage: WALKING_ICON,
                callback: () => {
                    this.navigateToScreen({screen: 'TourList'});
                }
            }),
            new CellModel({
                title: 'Locations',
                dynamicImage: NetworkManager.getAWSURLForMisc('locations.jpg'),
                tallCell: true,
                iconImage: ADDRESS_ICON,
                callback: () => {
                    this.navigateToScreen({screen: 'BusinessCategoryList'});
                }
            }),
            new CellModel({
                title: 'My West Central',
                dynamicImage: NetworkManager.getAWSURLForMisc('my_west_central.jpg'),
                tallCell: true,
                iconImage: SAVED_ICON_WHITE,
                callback: () => {
                    this.navigateToScreen({screen: 'MyWestCentral'});
                }
            }),
            new CellModel({
                title: 'APP DESIGNED BY WHITWORTH STUDENTS FOR THE',
                backgroundImage: require('WalkWestCentral/app/resources/img/whitworth_logo_horizontal.png'),
                type: 'InfoCell'
            })
        ];

        this.setState({
            listCells: cells
        },()=>{
            this.loadImagesInCells();
        });
    }

    render() {
        StatusBar.setBarStyle('light-content', true);

        return (
            <View style={styles.viewContainer}>
                <StatusBar hidden={false}/>
                {super.renderHeader(true)}
                <GenericMenu
                    ref={ref => this.genericMenu = ref}
                    navigation={this.state.navigate}
                    style={styles.listView} cells={this.state.listCells}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    header: {},
    listView: {}
});
