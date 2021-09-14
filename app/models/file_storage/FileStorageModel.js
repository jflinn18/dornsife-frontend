//Model for how we store data.
//  Name: what you want to call the data
//  Type: type of data (audio/image/etc)
//  Data: data to be stored. Should be a string, so encode your media as base64 string.
//        If it's not a string, the constructor will try to make it a JSON string object
//  Date Created: the date the file was initially Created
//  Date Modified: the date the file was edited last
export default class FileStorageModel{
    constructor(arg = {name: '', type: '', data: '', dateCreated: '', dateModified: ''}){
        this.name = arg.name;
        this.type = arg.type;
        this.dateCreated = arg.dateCreated;
        this.dateModified = arg.dateModified;

        if(typeof arg.data === 'string'){
            this.data = arg.data;
        }else{
            this.data = JSON.stringify(arg.data);
        }
    }

    //Return a string version of the model
    getString(){
        return JSON.stringify(this);
    }
}
