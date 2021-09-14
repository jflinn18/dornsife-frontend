import React, { Component } from 'react';
import {
  View,
  ListView,
  StyleSheet
} from 'react-native';

//COMPONENTS
import PictureCell from 'WalkWestCentral/app/ui/components/list_views/list_cells/PictureCell';
import InfoCell from 'WalkWestCentral/app/ui/components/list_views/list_cells/InfoCell';
import {CellSort} from 'WalkWestCentral/app/models/list_cells/CellModel';

//CLASS
export default class GenericMenu extends Component{
  constructor(props){
    super(props);
    //set up the list view
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //for navigating to the next screens
    const { navigate } = this.props.navigation;

    //take the cells that were passed in as arguments and make them the dataSource
    this.state = {
        dataSource: this.ds.cloneWithRows(this.props.cells),
        listCells: []
    }

    this.pictureCellRefs = [];
  }

  update(){
      this.setState({
         dataSource: this.ds.cloneWithRows(this.props.cells),
         listCells: this.props.cells
      });
  }

  componentWillReceiveProps(props){
      //empty our refs because we're going to reorder them
      this.pictureCellRefs = [];
      this.setState({
          dataSource: this.ds.cloneWithRows(props.cells),
          listCells: this.props.cells
      });
  }

  //Returns a picture cell
  renderRow(rowData, sectionID, rowID, highlightRow){
    if(rowData.type == null || rowData.type === 'PictureCell'){
        let cellRef = {};
        let pictureCell = (
            <PictureCell
                ref={(ref) => {cellRef.ref = ref}}
                style={[styles.cell]}
                callback={rowData.callback}
                title={rowData.title}
                tallCell={rowData.tallCell || false}
                backgroundImage={rowData.backgroundImage}
                dynamicImageURL={rowData.dynamicImageURL}
                dynamicImage={rowData.dynamicImage}
                loadImage={rowData.loadImage}
                onDynamicImageLoaded={rowData.onDynamicImageLoaded}
                iconImage={rowData.iconImage}/>
        )
        this.pictureCellRefs.push(cellRef);
        return pictureCell
    }else if(rowData.type === 'InfoCell'){
        return (<InfoCell
            style={[styles.cell]}
            callback={rowData.callback}
            title={rowData.title}
            backgroundImage={rowData.backgroundImage}/>)
    }else{
        return null;
    }
  }

  render(){
    return(
      <ListView
        style={[styles.list, this.props.style]}
        enableEmptySections={true}
        onScroll={this.props.onScroll}
        dataSource={this.state.dataSource}
        renderRow={this.renderRow.bind(this)}
        />
    );
  }
}

const styles = StyleSheet.create({
    list:{
        zIndex: 0
    },
    cell:{
        zIndex: 100
    }
});

GenericMenu.propTypes = {
  //This needs to be a list of PictureCellModel objects
  cells: React.PropTypes.array.isRequired,
}
