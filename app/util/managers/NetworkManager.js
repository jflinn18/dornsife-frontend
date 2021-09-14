//UTILITIES
import XMLToJSON from 'WalkWestCentral/app/util/XMLToJSON';
const DOMParser = require('xmldom').DOMParser;

//DEFINITIONS
import {
    TOUR_BUCKET_ID,
    IMAGE_BUCKET_ID,
    AUDIO_BUCKET_ID,
    MISC_BUCKET_ID,
    AWS_BASE_URL
} from 'WalkWestCentral/app/util/Definitions';

class NetworkManager{

    constructor(){}

    makeFetchRequest(arg = {url: '', callback: (response)=>{}}){
        fetch(arg.url, {headers: {'Cache-Control': 'no-cache'}})
        .then((response) =>{
            if(typeof arg.callback === 'function'){
                arg.callback(response);
            }
        })
        .catch((error) => {
            console.error(error);
            if(typeof arg.callback === 'function'){
                arg.callback(null);
            }
        });
    }

    makeJSONFetchRequest(arg = {url: '', callback: (jsonResponse)=>{}}){
        fetch(arg.url)
        .then((response) => response.json())
        .then((jsonResponse) => {
            if(typeof arg.callback === 'function'){
                arg.callback(jsonResponse);
            }
        })
        .catch((error) => {
            console.error(error);
            if(typeof arg.callback === 'function'){
                arg.callback(null);
            }
        });
    }

    makeXMLFetchRequest(arg = {url: '', callback: (xmlResponse)=>{}}){
        fetch(arg.url)
        .then((response)=>response.text())
        .then((xmlText)=>{
            let parser = new DOMParser();
            let xml = parser.parseFromString(xmlText, 'text/xml');
            if(typeof arg.callback === 'function'){
                arg.callback(xml)
            }
        })
        .catch((error) => {
            console.error(error);
            if(typeof arg.callback === 'function'){
                arg.callback(null);
            }
        });
    }

    getBucket(arg = {bucket: '', callback: (bucket)=>{}}){
        let url = AWS_BASE_URL+arg.bucket;
        this.makeXMLFetchRequest({url: url, callback:(xmlResponse)=>{
            let json = XMLToJSON(xmlResponse);
            let contents = null;
            let name = null;
            if(json && json.ListBucketResult){
                name = json.ListBucketResult.Name;
                contents = json.ListBucketResult.Contents;
            }
            if(typeof arg.callback === 'function'){
                arg.callback({name: name, url: url, contents: contents});
            }
        }});
    }

    //takes in a bucket object and returns the contents of the bucket items
    //  the callback function will be called for every item in the bucket
    getItemsInBucket(arg = {bucket: null, callback: (bucketItem)=>{}}){
        if(arg.bucket != null && arg.bucket.contents != null){
            let contents = arg.bucket.contents
            if(!Array.isArray(contents)){
                contents = [contents];
            }
            for(let i = 0; i < contents.length; i++){
                let url = `${AWS_BASE_URL}${arg.bucket.name}/${contents[i].Key}`;
                this.makeJSONFetchRequest({url:url, callback:(jsonResponse)=>{
                    if(typeof arg.callback === 'function'){
                        let data = {
                            name: this.jsonFileNameToTitle(contents[i].Key),
                            data: jsonResponse
                        }
                        arg.callback(data);
                    }
                }});
            }
        }
    }

    getAWSURLForImage(filename){
        return this.getAWSURLForBucketAndFile({bucket: IMAGE_BUCKET_ID, file: filename});
    }

    getAWSURLForAudio(filename){
        return this.getAWSURLForBucketAndFile({bucket: AUDIO_BUCKET_ID, file: filename});
    }

    getAWSURLForMisc(filename){
        return this.getAWSURLForBucketAndFile({bucket: MISC_BUCKET_ID, file: filename});
    }

    getAWSURLForBucketAndFile(arg = {bucket: '', file: ''}){
        if(arg.file === '' || arg.file == null){
            return `${AWS_BASE_URL}${arg.bucket}`;
        }
        return `${AWS_BASE_URL}${arg.bucket}/${arg.file}`;
    }

    jsonFileNameToTitle(name){
        //remove the json file extension
        let newName = name.replace('.json', '');
        //replace underscores with spaces
        newName = newName.split('_').join(' ');
        return newName;
    }
}

const instance = new NetworkManager();
export default instance;
