//TODO: En progreso
import {Truck} from "../models/truck";

export class InitialSolver {

    containers: any[];
    disposals: any[];
    depot: any;

    constructor(containers, disposals, depot){
        this.containers = containers.slice();
        this.disposals = disposals.slice();
        this.depot = depot;
    }

    generateInitialSolution() {

        let trucks = [];

        while(this.containers.length > 0){
            let truck = this.generateOneRoute();
            trucks.push(truck);
            console.log("[Truck] Tiempo antes de optimizar: "+truck.currentTime)
        }
        return trucks;
    }

    generateOneRoute(){

        let truck = new Truck(); //init truck

        truck.setOrigin(this.depot);

        while(! truck.finished()){
            let nextDestination;

            if(truck.runOutOfCapacity())
                nextDestination = truck.getNearestDisposal(this.disposals);
            else {
                nextDestination = this.chooseNextContainer(truck);
                this.removeFromContainersList(nextDestination); //check if disposal. If disposal, do nothing
            }

            /*
            * If we receive a null, it means that there aren't
            * more feasible containers to collect, so we close the route
            */
            if(nextDestination === null){
                this.attachDepot(truck);
                return truck;
            }

            truck.attachDestination(nextDestination);
        }

        this.attachDepot(truck);
        return truck;
    }

    private chooseNextContainer(truck) {
        let feasibleContainers = this.getFeasibleContainers(truck);

        if(feasibleContainers.length === 0)
            return null;
        else
            return this.getBestContainer(feasibleContainers, truck);
    }

    private getFeasibleContainers(truck){
        return this.containers.filter(function (option) {
            let collectible = truck.isCollectible(option);
            let time = truck.willBeEnoughTimeToReturnToDepot(option, this.depot, this.disposals);
            return collectible && time;
        }.bind(this));
    }

    private getBestContainer(options, truck){

        //TODO cachear timeToBestOption para más rapidez
        return options.reduce(function (bestOption, option) {
            let timeToBestOption = truck.timeTo(bestOption);
            let timeToOption = truck.timeTo(option);

            if(timeToOption < timeToBestOption)
                return option;
            else
                return bestOption
        })
    }

    private attachDepot(truck){
        if(truck.currentLoad != 0){
           let disposal = truck.getNearestDisposal(this.disposals);
           truck.attachDestination(disposal);
        }

        truck.attachDestination(this.depot);
        return truck;
    }



    private removeFromContainersList(itemToRemove){
        let index = this.containers.indexOf(itemToRemove);
        this.containers.splice(index, 1);
    }
}