//REACT
import {AsyncStorage} from 'react-native';
//MODELS
import FileStorageModel from 'WalkWestCentral/app/models/file_storage/FileStorageModel';
//MANAGERS
import NetworkManager from 'WalkWestCentral/app/util/managers/NetworkManager';
import AudioManager from 'WalkWestCentral/app/util/managers/AudioManager';
//CLASS
class FileManager{
    constructor(){
        //object to store images for quick access
        this.imageCache = {};

        // this.makeBase64DataFromURL({url: 'http://audiotest.localhost:8888/TheValley.mp3', callback: (base64data)=>{
        //     let name = 'the_valley';
        //     this.saveFileForKey({key: name, name: name, type: 'audio', data: base64data, callback:(success)=>{
        //         if(success){
        //             console.log('success');
        //         }else{
        //             console.log('fail');
        //         }
        //     }});
        // }});

        // this.getFileForKey({key: 'the_valley', callback: (data)=>{
        //     let file = new Blob([data], {type: 'audio/mpeg'});
        //     let fileURL = URL.createObjectURL(file);
        //     AudioManager.setCurrentAudio({url: fileURL, onReady: ()=>{
        //         AudioManager.play();
        //     }});
        // }});
    }

    saveImageFromURLForKey(arg = {key: '', name: '', url: '', callback: (success)=>{}}){
        if(arg.key == null){console.error('saveImageFromURLForKey() needs a key');}
        if(arg.url == null){console.error('saveImageFromURLForKey() needs a url');}
        this.makeBase64DataFromURL({url: arg.url, callback: (base64data)=>{
            this.saveFileForKey({key: arg.key, name: arg.name, type: 'image', data: base64data, callback:(success)=>{
                if(typeof arg.callback === 'function'){
                    arg.callback(success);
                }
            }});
        }});
    }

    getImageWithCaching(arg = {url: '', numDaysBetweenCheck: 0, callback:(value)=>{}}){
        //if we don't have a valid url
        if(arg.url == null && arg.url === ''){
            if(typeof arg.callback === 'function'){
                arg.callback(null);
            }
        }else{
            //we have a valid url
            //first, check to see if we've retrieved this image recently
            if(this.imageCache[arg.url] != null && this.imageCache[arg.url] !== 'null'){
                console.log(`Retrieved ${arg.url} from memory`);
                if(typeof arg.callback === 'function'){
                    arg.callback(this.imageCache[arg.url]);
                }
            }else{
                //check to see if we've downloaded the image before
                this.getFileForKey({key: arg.url, callback:(image)=>{
                    let shouldUpdate = false;
                    //if we got an image back
                    if(image != null && image.dateCreated != null){
                        //calculate the difference in time between when the image was saved and the current date
                        let todayDate = new Date();
                        let date = new Date(image.dateCreated);
                        let difference = (todayDate - date)/(1000*60*60*24);
                        if(arg.numDaysBetweenCheck && difference >= arg.numDaysBetweenCheck){
                            shouldUpdate = true;
                        }
                    }

                    //if we don't have this image yet or if the image stored is too old
                    if(image == null || image.data == null || image.data === 'null' || shouldUpdate){
                        //save the image to the phone using the url as the key
                        this.saveImageFromURLForKey({key:arg.url, url:arg.url, callback:(success)=>{
                            console.log(`Saved ${arg.url}`);
                            if(typeof arg.callback === 'function'){
                                //get the value we just saved and pass it back
                                this.getFileForKey({key: arg.url, callback: (image)=>{
                                    if(typeof arg.callback === 'function'){
                                        arg.callback(image);
                                        //save the image in memory for later usage
                                        this.imageCache[arg.url] = image;
                                    }
                                }});
                            }
                        }});
                    }else{
                        //we have the image stored on the device
                        console.log(`Retrieved ${arg.url} from storage`);
                        if(typeof arg.callback === 'function'){
                            arg.callback(image);
                            //save the image in memory for later usage
                            this.imageCache[arg.url] = image;
                        }
                    }
                }});
            }
        }
    }

    saveFileForKey(arg = {key: '', name: '', type: '', data: '', callback: (success)=>{}}){
        const today = new Date();
        const file = new FileStorageModel({name: arg.name, type: arg.type, data: arg.data, dateCreated: today});
        const fileString = file.getString();
        this.saveValueForKey({key: arg.key, value: fileString, callback: (success)=>{
            if(typeof arg.callback === 'function'){
                arg.callback(success);
            }
        }});
    }

    getFileForKey(arg = {key: '', callback: (value)=>{}}){
        this.getValueForKey({key: arg.key, callback:(item)=>{
            let file = (item != null) ? JSON.parse(item) : null;
            if(typeof arg.callback === 'function'){
                arg.callback(file);
            }
        }});
    }

    saveValueForKey(arg = {key:'', value:'', callback:(success)=>{}}){
        try {
          AsyncStorage.setItem(arg.key, arg.value)
          .then(()=>{
              if(typeof arg.callback === 'function'){
                  arg.callback(true);
              }
          })
        } catch (error) {
          console.error(error);
          if(typeof arg.callback === 'function'){
              arg.callback(false);
          }
        }
    }

    getValueForKey(arg = {key:'', callback:(item)=>{}}){
        try {
            AsyncStorage.getItem(arg.key, (error, result)=>{
                if(typeof arg.callback === 'function'){
                    arg.callback(result);
                }
            });
        } catch (error) {
          console.error(error);
          if(typeof arg.callback === 'function'){
              arg.callback(null);
          }
        }
    }

    makeBase64DataFromURL(arg = {url: '', callback: (base64data)=>{}}){
        NetworkManager.makeFetchRequest({url: arg.url, callback: (response)=>{
            this.responseToBase64Data({response: response, callback: (base64data)=>{
                if(typeof arg.callback === 'function'){
                    arg.callback(base64data);
                }
            }})
        }});
    }

    responseToBase64Data(arg = {response: null, callback: (base64data)=>{}}){
        this.fetchResponseToBlob({response: arg.response, callback:(blob)=>{
            if(blob != null){
                this.blobToBase64Data({blob: blob, callback: (base64data)=>{
                    if(typeof arg.callback === 'function'){
                        arg.callback(base64data);
                    }
                }});
            }else{
                if(typeof arg.callback === 'function'){
                    arg.callback(null);
                }
            }
        }});
    }

    fetchResponseToBlob(arg = {response: null, callback:(blob)=>{}}){
        if(arg != null && arg.response != null && arg.response.status == 200){
            if(typeof arg.response.blob === 'function'){
                arg.response.blob()
                .then((blob)=>{
                    if(typeof arg.callback === 'function'){
                        arg.callback(blob);
                    }
                });
            }
        }else if(typeof arg.callback === 'function'){
            arg.callback(null);
        }
    }

    //takes a blob and then converts it to a base 64 encoded string
    blobToBase64Data(arg = {blob: null, callback:(base64data)=>{}}){
        if(arg.blob != null){
            var reader = new window.FileReader();
            reader.readAsDataURL(arg.blob);
            reader.onloadend = function() {
               base64data = reader.result;
               if(typeof arg.callback === 'function'){
                   arg.callback(base64data);
               }
            }
        }else if(typeof arg.callback === 'function'){
            arg.callback(null);
        }
    }

}

const instance = new FileManager();
export default instance;
