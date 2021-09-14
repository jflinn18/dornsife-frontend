import React, { Component } from 'react';
import {
    View,
    ListView,
    StyleSheet,
    Text,
    Navigator,
    Animated,
    StatusBar
} from 'react-native';

import ListScreenBase from 'WalkWestCentral/app/ui/screens/ListScreenBase';
//MANAGERS
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';
import TourManager from 'WalkWestCentral/app/util/managers/TourManager';
//MODELS
import {CellModel} from 'WalkWestCentral/app/models/list_cells/CellModel';
//DEFINITIONS
import { TOUR_BUCKET_ID } from 'WalkWestCentral/app/util/Definitions';
//CLASS
export default class TourList extends ListScreenBase{
    constructor(props){
        super(props);
    }

    setListCells(){
        //for navigating to the next screens
        const {navigate} = this.props.navigation;
        TourManager.refreshTours({tourListChanged:(tour)=>{
            //create a new cell from the tour object
            let cell = new CellModel({
                title: tour.name,
                callback:()=>{
                    let index = TourManager.tours.indexOf(tour);
                    console.log(index);
                    this.navigateToScreen({screen:'Tour', args: {tourIndex: index}});
                }
            });
            //add our new cell
            super.addListCell(cell);
        }});
    }

    render(){
        //everything we need for this generic list view is what's in super
        return super.render();
    }
}
