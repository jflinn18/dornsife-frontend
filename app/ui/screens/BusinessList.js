//SCREENS
import ListScreenBase from 'WalkWestCentral/app/ui/screens/ListScreenBase';
//MANAGERS
import BusinessManager from 'WalkWestCentral/app/util/managers/BusinessManager';
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';
import FileManager from 'WalkWestCentral/app/util/managers/FileManager';

//MODELS
import {CellModel} from 'WalkWestCentral/app/models/list_cells/CellModel';
//DEFINITIONS
import { BUSINESS_BUCKET_ID } from 'WalkWestCentral/app/util/Definitions';
//CLASS
export default class BusinessList extends ListScreenBase{
    constructor(props){
        super(props);
    }

    setListCells(){
        //for navigating to the next screens
        const {navigate, state} = this.props.navigation;
        BusinessManager.getBusinessNames({fileName: state.params.category, callback: (businesses)=>{
            for(let i = 0; i < businesses.length; i++){
                //create a new cell from the tour object
                let cell = new CellModel({
                    title: businesses[i].name,
                    dynamicImage: NetworkManager.getAWSURLForImage(businesses[i].pictureFile),
                    tallCell: true,
                    callback:()=>{
                        this.navigateToScreen({screen:'Info', args: {mapPoint: businesses[i]}});
                    }
                });
                //add our new cell
                super.addListCell(cell);
            }
            this.loadImagesInCells();
        }});
    }

    render(){
        return super.render();
    }
}
