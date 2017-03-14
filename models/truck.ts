const GraphNode = require('./GraphNode');
const Route = require('./Route');

const CAPACITY_THRESHOLD = 0.8;
const MAX_WORK_TIME = 10*60 * 60;

export class Truck {
    currentTime: number;
    currentLoad: number;
    maxCapacity: number;

    //TIMES
    collectionTime: number;
    emptyingTime: number;

    //ROUTES
    routes: any[];

    constructor(){
       this.routes = [];
       this.currentLoad = 0;
       this.currentTime = 0;
       this.collectionTime = 30;
        this.emptyingTime = 30;
        this.maxCapacity = 1000;
    }

    saveRoute(){

        let route = new Route({nodes: []});

        this.routes.forEach(function (node, index) {
            console.log(index);
            route.nodes.push({
                _graphNode: node,
                order: index,
            });

        });

        route.save();
    }

    timeTo(destination){
        let actualPosition = this.getActualPosition();
        return actualPosition.timeTo(destination);
    }

    setOrigin(depot){
        this.routes.push(depot);
    }

    attachDestination(destination){
        let actualPosition = this.getActualPosition();

        this.routes.push(destination);
        this.currentTime += actualPosition.timeTo(destination);

        this.updateLoad(destination);

        //TODO faltaría aumentar el límite diario del camion, pero eso se puede comprobar con el currentTime
    }

    finished(){
        return this.currentTime > MAX_WORK_TIME;
    }

    runOutOfCapacity(){
        return (this.currentLoad / this.maxCapacity) > CAPACITY_THRESHOLD
    }

    // Creo que esto no va a ser necesario
    isVisitable(destination){
        let actualPosition = this.getActualPosition();
        let arrivalTime = actualPosition.timeTo(destination) + this.currentTime;

        return (arrivalTime > destination.openTime && arrivalTime < destination.closeTime);
    }

    isCollectible(destination){
        return this.maxCapacity > this.currentLoad + destination.getLoad();
    }

    willBeEnoughTimeToReturnToDepot(destination, depot, disposals){

        let actualPosition = this.getActualPosition();
        let nearestDisposal = this.getNearestDisposal(disposals);

        //Time necesary to recollect destination from origin
        let recollectionTime = actualPosition.timeTo(destination) + this.collectionTime;

        //Time from destination to the nearest disposal
        let emptyingTime = actualPosition.timeTo(nearestDisposal) + this.emptyingTime;

        //Time to depot from disposal
        let timeToDepot = nearestDisposal.timeTo(depot);

        //Total
        let futureTime = this.currentTime + recollectionTime + emptyingTime + timeToDepot;

        return (futureTime <= 500000)
    }

    getNearestDisposal(disposals){
        return disposals.reduce(function (bestOption, option) {
            let timeToBestOption = this.timeTo(bestOption); //TODO cachear esto para más rapidez
            let timeToOption = this.timeTo(option);
            if (timeToOption < timeToBestOption)
                return timeToBestOption;
        })
    }

    private updateLoad(destination){
        if(destination.type === 'disposal')
            this.currentLoad = 0;
        else
            this.currentLoad += destination.getLoad();
    }

    private getActualPosition(){
        return this.routes[this.routes.length - 1];
    }
}

