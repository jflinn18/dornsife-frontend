//MODELS
import {MapPoint, MapPointType} from 'WalkWestCentral/app/models/map/MapPoint';
//MANAGERS
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';
import FileManager from 'WalkWestCentral/app/util/managers/FileManager';
//DEFINITIONS
import {
    AWS_BASE_URL,
    BUSINESS_BUCKET_ID,
    MY_WEST_CENTRAL_KEY,
} from 'WalkWestCentral/app/util/Definitions';

class BusinessManager{
    constructor(){}

    getBusinessCategories(arg = {callback:(categories)=>{}}){
        NetworkManager.getBucket({bucket: BUSINESS_BUCKET_ID, callback:(bucket)=>{
            let categories = [];
            for(let i = 0; i < bucket.contents.length; i++){
                let category = bucket.contents[i].Key;
                let name = NetworkManager.jsonFileNameToTitle(category);
                categories.push({file: category, name: name});
            }
            if(typeof arg.callback === 'function'){
                arg.callback(categories);
            }
        }});
    }

    getBusinessNames(arg = {fileName: '', callback:(businesses)=>{}}){
        let url = NetworkManager.getAWSURLForBucketAndFile({bucket: BUSINESS_BUCKET_ID, file: arg.fileName});
        NetworkManager.makeJSONFetchRequest({url: url, callback: (jsonResponse)=>{
            if(typeof arg.callback === 'function'){
                for(let i = 0; i < jsonResponse.length; i++){
                    //convert all the json objects into MapPoints
                    jsonResponse[i] = new MapPoint(jsonResponse[i]);
                }
                arg.callback(jsonResponse);
            }
        }});
    }

    saveBusinessToMyWestCentral(arg = {business: null, callback:(success)=>{}}){
        //get the MyWestCentral object from the phone's storage
        this.getBusinessesInMyWestCentral({callback:(savedPlaces)=>{
            //if we got a valid business parameter
            if(arg.business != null){
                //save the business
                savedPlaces[arg.business.ID] = arg.business;
                FileManager.saveFileForKey({key: MY_WEST_CENTRAL_KEY, name: MY_WEST_CENTRAL_KEY, type: 'json', data: savedPlaces, callback: (success)=>{
                    if(typeof arg.callback === 'function'){
                        arg.callback(success);
                    }
                }});
            }else{
                //we didn't get a valid business
                if(typeof arg.callback === 'function'){arg.callback(false);}
            }
        }});
    }

    unsaveBusinessToMyWestCentral(arg = {business: null, callback:(success)=>{}}){
        //get the MyWestCentral object from the phone's storage
        this.getBusinessesInMyWestCentral({callback:(savedPlaces)=>{
            //if we got a valid business parameter
            if(arg.business != null){
                //save the business
                delete savedPlaces[arg.business.ID];
                FileManager.saveFileForKey({key: MY_WEST_CENTRAL_KEY, name: MY_WEST_CENTRAL_KEY, type: 'json', data: savedPlaces, callback: (success)=>{
                    if(typeof arg.callback === 'function'){
                        arg.callback(success);
                    }
                }});
            }else{
                //we didn't get a valid business
                if(typeof arg.callback === 'function'){arg.callback(false);}
            }
        }});
    }

    getBusinessesInMyWestCentral(arg = {callback:(myWestCentral)=>{}}){
        FileManager.getFileForKey({key: MY_WEST_CENTRAL_KEY, callback:(savedPlaces)=>{
            //if we haven't saved anything before, make a blank object we can save stuff to
            if(savedPlaces == null){savedPlaces = {}}
            if(typeof arg.callback === 'function'){
                const businesses = (savedPlaces.data != null) ? JSON.parse(savedPlaces.data) : {};
                arg.callback(businesses);
            }
        }});
    }
}

let instance = new BusinessManager();
export default instance;
