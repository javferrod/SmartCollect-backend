//TODO: En progreso
import {Truck} from "../models/truck";

const GraphNode = require('./../models/GraphNode');

export class Routing {
    static generateInitialSolution(containers) {

        let depot, disposals;
        let trucks = [];

        return Routing.getDepot()
            .then(function(resul){
                depot = resul;
                return Routing.getDisposals();
            })
            .then(function (resul) {
                disposals = resul;
                console.log('papap1');
                return disposals

            })
            .then(function (disposals) {
                while(containers.length > 0){
                    let truck = Routing.generateOneRoute(containers, disposals, depot);
                    trucks.push(truck);
                }
                return trucks;
            });

    }

    static generateOneRoute(containers, disposals, depot){

        let truck = new Truck(); //init truck

        truck.setOrigin(depot);

        while(! truck.finished()){
            let nextDestination;

            if(truck.runOutOfCapacity())
                nextDestination = truck.getNearestDisposal(disposals);
            else{
                nextDestination = Routing.chooseNextContainer(containers, truck, depot, disposals);
                Routing.removeFromContainersList(containers, nextDestination); //check if disposal. If disposal, do nothing
            }

            truck.attachDestination(nextDestination);
        }

        return truck;
    }

    private static chooseNextContainer(containers, truck, depot, disposals) {
        return containers
            .filter(function (option) {
                let collectible = truck.isCollectible(option);
                let time = truck.willBeEnoughTimeToReturnToDepot(option, depot, disposals);
                console.log(collectible, time);
                return collectible && time;
            })
            .reduce(function (bestOption, option) {
                console.log(bestOption);
                console.log(truck);
                let timeToBestOption = truck.timeTo(bestOption); //TODO cachear esto para más rapidez
                let timeToOption = truck.timeTo(option);

                if(timeToOption < timeToBestOption)
                    return option;
                else
                    return bestOption
            })
    }

    private static getDepot() {
        return GraphNode.findOne({type: 'depot'}).then(function (depot) {
            return depot;
        })
    }

    private static getDisposals(){
        return GraphNode.find({type: 'disposal'}).then(function (disposals) {
            return disposals;
        })
    }

    private static removeFromContainersList(list, itemToRemove){
        let index = list.indexOf(itemToRemove);
        list.splice(index, 1);
    }
}
