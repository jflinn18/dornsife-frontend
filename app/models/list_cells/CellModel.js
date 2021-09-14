import FileManager from 'WalkWestCentral/app/util/managers/FileManager';

//This model is used to store information for list view cells.
//  backgroundImage (optional): a static image stored on the phone
//  dynamicImage (optional): a non-static image stored online
//  dynamicImageURL (optional): a non-static image url online to be downloaded later.
//                              This will store the image to the phone, and then keep it in memory.
//                              Download will be initiated by calling the loadImage function
//  onDynamicImageLoaded (optional): callback function to be called after the dynamicImageURL has been retrieved
//  iconImage (optional): icon in the cell
//  tallCell (optional): determines whether or not the cell will default to be tall or short
//  type: what kind of cell you're trying to create
//  callback: a function that will be called when the cell is tapped
export default class CellModel{
    constructor(arg = {
        title: '',
        backgroundImage: null,
        dynamicImage: null,
        dynamicImageURL: '',
        onDynamicImageLoaded: ()=>{},
        iconImage: null,
        tallCell: false,
        type: '',
        callback: ()=>{}}){
        this.title = arg.title;
        this.backgroundImage = arg.backgroundImage;
        this.dynamicImage = arg.dynamicImage;
        this.dynamicImageURL = arg.dynamicImageURL;
        this.iconImage = arg.iconImage;
        this.tallCell = arg.tallCell;
        this.callback = arg.callback;
        this.type = arg.type;
        this.onDynamicImageLoaded = arg.onDynamicImageLoaded;
        this.loadImage = this.setupDynamicImage.bind(this);
    }

    //download the dynamicImageURL and set up the image in the cell
    setupDynamicImage(arg = {callback:(image)=>{}}){
        var self = this;
        if(self.dynamicImageURL != null){
            FileManager.getImageWithCaching({url: self.dynamicImageURL, numDaysBetweenCheck: 1, callback:(image)=>{
                //set the dynamic image to the image we just retrieved
                self.dynamicImage = image.data;
                if(typeof self.onDynamicImageLoaded === 'function'){
                    //reload the view (if onDynamicImageLoaded() was a prop passed in)
                    self.onDynamicImageLoaded(self.dynamicImage);
                }
                if(typeof arg.callback === 'function'){
                    arg.callback(self.dynamicImage);
                }
            }});
        }
    }
}

//This is a way to prioritize cells based on their title. for use with the Array.sort() javascript method
//  ex. Array.sort(CellSort)
function CellSort(cell1, cell2){
    if(cell1.title != null && cell2.title != null){
        const title1 = cell1.title.toUpperCase();
        const title2 = cell2.title.toUpperCase();
        return (title1 < title2) ? -1 : (title1 > title2) ? 1 : 0;
    }else{
        return 0;
    }
}

//A function to sort a list of cells alphabetically.
//  This will alter the original array.
function SortCellList(list){
    for(let i1 = 0; i1 < list.length; i1++){
        //the first title
        const title1 = list[i1].title.toUpperCase();
        //start where i1 left off
        for(let i2 = i1; i2 < list.length; i2++){
            let least = null;
            if(list[i1].title != null && list[i2].title != null){
                //second title
                const title2 = list[i2].title.toUpperCase();
                if(least == null || title2 < least.title){
                    least = list[i2];
                }
            }
            //if the lowest title we found is lower than the original title, swap them
            if(i2 == list.length - 1 && least != null && title1 > least.title){
                let temp = list[i1];
                list[i1] = list[i2];
                list[i2] = temp;
            }
        }
    }
}

module.exports = {
    CellModel,
    CellSort,
    SortCellList
}
