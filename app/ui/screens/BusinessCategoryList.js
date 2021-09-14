//SCREENS
import ListScreenBase from 'WalkWestCentral/app/ui/screens/ListScreenBase';
//MANAGERS
import BusinessManager from 'WalkWestCentral/app/util/managers/BusinessManager';
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';
import FileManager from 'WalkWestCentral/app/util/managers/FileManager';
//MODELS
import {CellModel} from 'WalkWestCentral/app/models/list_cells/CellModel';
//DEFINITIONS
import {
    BUSINESS_BUCKET_ID,
    BUSINESS_IMAGES_JSON,
    BUSINESS_CAT,
    INFORMATION_CAT,
    WORSHIP_CAT,
    VOLUNTEER_CAT,
    BUSINESS_ICON_WHITE,
    VOLUNTEER_ICON_WHITE,
    WORSHIP_ICON_WHITE,
    INFORMATION_ICON_WHITE,
} from 'WalkWestCentral/app/util/Definitions';
//CLASS
export default class BusinessCategory extends ListScreenBase{
    constructor(props){
        super(props);
        this.categories = [];
    }

    setListCells(){
        let url = NetworkManager.getAWSURLForMisc(BUSINESS_IMAGES_JSON);
        NetworkManager.makeJSONFetchRequest({url: url, callback:(images)=>{
            //for navigating to the next screens
            const {navigate} = this.props.navigation;
            BusinessManager.getBusinessCategories({callback:(categories)=>{
                this.categories = categories;
                for(let i = 0; i < categories.length; i++){
                    const category = categories[i];
                    const categoryName = category.name
                    let icon = null;
                    switch (categoryName) {
                        case BUSINESS_CAT:
                            icon = BUSINESS_ICON_WHITE;
                            break;
                        case INFORMATION_CAT:
                            icon = INFORMATION_ICON_WHITE;
                            break;
                        case WORSHIP_CAT:
                            icon = WORSHIP_ICON_WHITE;
                            break;
                        case VOLUNTEER_CAT:
                            icon = VOLUNTEER_ICON_WHITE;
                            break;
                        default:
                            break;
                    }

                    //create a new cell from the tour object
                    let cell = new CellModel({
                        title: categoryName,
                        dynamicImage: NetworkManager.getAWSURLForImage(images[categoryName]),
                        iconImage: icon,
                        tallCell: true,
                        callback:()=>{
                            let category = this.categories[i].file;
                            this.navigateToScreen({screen:'BusinessList', args: {category: category}});
                        }
                    });
                    //add our new cell
                    super.addListCell(cell);
                }
                this.loadImagesInCells();
            }});
        }});
    }

    render(){
        return super.render();
    }
}
