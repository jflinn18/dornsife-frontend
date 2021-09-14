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
//DEFINITIONS
import {
    WHITE
} from 'WalkWestCentral/app/util/Definitions'
//STYLES
import {
    HEADER_MAX_HEIGHT,
    HEADER_MIN_HEIGHT,
    HEADER_SCROLL_DISTANCE,
    STATUS_BAR_STYLES
} from 'WalkWestCentral/app/util/Definitions';
//COMPONENTS
import {CellModel, SortCellList} from 'WalkWestCentral/app/models/list_cells/CellModel';
import GenericMenu from 'WalkWestCentral/app/ui/components/list_views/GenericMenu';
import ScreenBase from 'WalkWestCentral/app/ui/screens/ScreenBase';

export default class TourList extends ScreenBase{
    constructor(props){
        super(props);
        this.genericMenu = null; //set in render function
        //for navigating to the next screens
        const {navigate} = this.props.navigation;
        //set up the state
        this.state = {
            navigate: navigate,
            listCells: [],
            noContentMessage: ''
        };
    }

    setListCells(){
        //the subclasses should implement this method
        console.warn('Function: "setListCells" must be implemented by subclass');
    }

    //remove all cells from the view
    resetListCells(){
        this.setState({
            listCells: []
        });
    }

    //add a cell to the menu
    addListCell(cell){
        this.setState({
             listCells: this.state.listCells.concat(cell)
        },()=>{
            let listCells = this.state.listCells;
            SortCellList(listCells);
            this.setState({
                listCells: listCells
            });
        });
    }

    //If images are set using the dynamicImageURL, we need to call this to set
    //  up the images.
    //  if we don't have this function and try to load the images directly,
    //  the images will be in the wrong cells because of async operations.
    //  therefore this should be called after all of the cells have been loaded,
    //  and then the cells will have the correct images.
    loadImagesInCells(){
        if(this.genericMenu != null){
            for(let i = 0; i < this.genericMenu.pictureCellRefs.length; i++){
                this.genericMenu.pictureCellRefs[i].ref.loadImage();
            }
        }
    }

    componentDidMount(){
        //when the component is mounted, set the cells that will be in the table
        this.setListCells();
    }

    render(){
        let noContentMessage = null;
        //if we don't have any cells to display
        if(this.genericMenu != null && this.state.listCells.length == 0){
            noContentMessage = (
                <View style={styles.noContentMessage}>
                    <Text style={styles.noContentMessageText}>
                        {this.state.noContentMessage}
                    </Text>
                </View>
            )
        }

        return(
            <View style={styles.viewContainer}>
                {super.renderHeader()}
                <View style={styles.contentContainer}>
                    {noContentMessage}
                    <GenericMenu
                        ref={ref => this.genericMenu = ref}
                        navigation={this.state.navigate}
                        style={styles.listView}
                        cells={this.state.listCells}/>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    viewContainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    contentContainer:{
        flex: 1,
        alignSelf: 'stretch'
    },
    noContentMessage:{
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center'
    },
    noContentMessageText:{
        fontWeight: 'bold',
        fontSize: 15,
        textAlign: 'center',
        padding: 20,
        color: WHITE
    },
    header: {},
    listView: {}
});
