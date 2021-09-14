//REACT NATIVE
import{
    View,
    Text,
    StyleSheet
} from 'react-native'
//SCREENS
import ListScreenBase from 'WalkWestCentral/app/ui/screens/ListScreenBase';
//MANAGERS
import BusinessManager from 'WalkWestCentral/app/util/managers/BusinessManager';
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';
//MODELS
import {CellModel} from 'WalkWestCentral/app/models/list_cells/CellModel';
//CLASS
export default class MyWestCentralScreen extends ListScreenBase{
    constructor(props){
        super(props);
        this.categories = [];
    }

    componentDidMount(){
        super.componentDidMount();
        this.setState({
            noContentMessage: "Looks like you haven't saved any places yet.  Start by looking in the Locations tab and press the heart icon for any businesses you'd like to remember"
        });
    }

    backToView(){
        super.resetListCells();
        this.setListCells();
    }

    setListCells(){
        //for navigating to the next screens
        const {navigate} = this.props.navigation;
        BusinessManager.getBusinessesInMyWestCentral({callback:(savedPlaces)=>{
            for(let key in savedPlaces){
                if(savedPlaces.hasOwnProperty(key)){
                    let place = savedPlaces[key];
                    //create a new cell from the tour object
                    let cell = new CellModel({
                        title: place.name,
                        dynamicImage: NetworkManager.getAWSURLForImage(place.pictureFile),
                        tallCell: true,
                        callback:()=>{
                            this.navigateToScreen({screen:'Info', args:{mapPoint: place}});
                        }
                    });
                    //add our new cell
                    super.addListCell(cell);
                }
            }
            this.loadImagesInCells();
        }});
    }

    render(){
        return super.render();
    }
}
