const Container = require('./container');

export class Truck {
    currentTime: number;
    currentLoad: number;
    maxCapacity: number;

    //TIMES
    collectionTime: number;
    emptyingTime: number;

    //ROUTES
    routes: any[];

    timeTo(destination){
        let actualPosition = this.getActualPosition();
        return actualPosition.timeTo(destination);
    }

    attachDestination(destination){
        let actualPosition = this.getActualPosition();

        this.routes.push(destination);
        this.currentTime += actualPosition.timeTo(destination);

        this.updateLoad(destination);

        //TODO faltaría aumentar el límite diario del camion, pero eso se puede comprobar con el currentTime
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

    willBeEnoughTimeToReturnToDepot(destination, depot){

        let actualPosition = this.getActualPosition();
        let nearestDisposal = actualPosition.getNearestDisposal();

        //Time necesary to recollect destination from origin
        let recollectionTime = actualPosition.timeTo(destination) + this.collectionTime;

        //Time from destination to the nearest disposal
        let emptyingTime = actualPosition.timeTo(nearestDisposal) + this.emptyingTime;

        //Time to depot from disposal
        let timeToDepot = nearestDisposal.timeTo(depot);

        //Total
        let futureTime = this.currentTime + recollectionTime + emptyingTime + timeToDepot;

        return (futureTime <= depot.closeTime)
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

