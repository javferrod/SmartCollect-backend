const GraphNode = require('./GraphNode');
const Route = require('./Route');

const CAPACITY_THRESHOLD = 0.8;
const MAX_WORK_TIME = 1500;

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

        let route = new Route(
            {
                time: this.currentTime,
                nodes: []
            });

        this.routes.forEach(function (node, index) {
            route.nodes.push({
                _graphNode: node,
                order: index,
            });

        });

        route.save();
    }

    isBetterThan(anotherTruck){
        return this.currentTime < anotherTruck.currentTime;
    }

    isFeasible(disposals){
        // Realizamos una copia del camión actual
        let truck = new Truck();
        let pendingNodes = this.routes.slice();

        let origin = pendingNodes.shift();
        truck.setOrigin(origin);

        pendingNodes.forEach(function (element, index) {
            if(!truck.isCollectible(element)){
                let nearestDisposal = truck.getNearestDisposal(disposals);
                truck.attachDestination(nearestDisposal);
            }

            truck.attachDestination(element);

            /*
            /* Si se ha cumplido el tiempo de trabajo y no se
            /* han acabado con la ruta, esta ruta no es posible
            */

            if(truck.finished() && index != (pendingNodes.length -1 ))
                return false;
        });

        // Actualizamos el currentTime
        this.currentTime = truck.currentTime;
        return true;
    }

    haveNode(node){
        return this.indexOfRoute(node) != -1;
    }

    replace(oldNode, newNode){
        let index = this.routes.indexOf(oldNode);
        this.routes[index] = newNode;
    }

    moveAfter(container1, container2){
        //TODO alterar order
        this.removeFromRoutes(container1);
        let index2 = this.routes.indexOf(container2);

        this.routes.splice(index2 + 1, 0, container1);
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

        return (futureTime <= MAX_WORK_TIME)
    }

    getNearestDisposal(disposals){

        if(disposals.length === 1)
            return disposals[0];

        return disposals.reduce(function (bestoption, option) {
            let timetobestoption = this.timeto(bestoption); //todo cachear esto para más rapidez
            let timetooption = this.timeto(option);
            if (timetooption < timetobestoption)
                return timetobestoption;
        })
    }

    copy(){
        let truck = new Truck();
        truck.currentTime = this.currentTime;
        truck.routes = this.routes.slice();

        return truck;
    }

    private removeFromRoutes(container){
        let index = this.routes.indexOf(container);
        this.routes.splice(index, 1);
    }

    private updateLoad(destination){
        if(destination.type === 'disposal')
            this.currentLoad = 0;
        else if(destination.type === 'container')
            this.currentLoad += destination.getLoad();
    }

    private getActualPosition(){
        return this.routes[this.routes.length - 1];
    }

    private indexOfRoute(node){

        for(let i = 0; i < this.routes.length; i++){
            if(this.routes[i]._id.equals(node._id))
                return i;
        }

        return -1;
    }
}

