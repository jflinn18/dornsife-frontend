export default class TourModel {
    constructor(arg = {
        title: '',
        description: '',
        mapPoints: []
    }) {
        this.title = arg.title;
        this.description = arg.description;
        this.mapPoints = arg.mapPoints;
    }
}
