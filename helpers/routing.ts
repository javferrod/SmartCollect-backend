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
            else {
                nextDestination = Routing.chooseNextContainer(containers, truck, depot, disposals);
                Routing.removeFromContainersList(containers, nextDestination); //check if disposal. If disposal, do nothing
            }


            /*
            * If we receive a null, it means that there aren't
            * more feasible containers to collect, so we close the route
            */
            if(nextDestination === null)
                return truck;

            truck.attachDestination(nextDestination);
        }

        return truck;
    }

    private static chooseNextContainer(containers, truck, depot, disposals) {
        let feasibleContainers = Routing.getFeasibleContainers(containers, truck, depot, disposals);

        if(feasibleContainers.length === 0)
            return null;
        else
            return Routing.getBestContainer(feasibleContainers, truck);
    }

    private static getFeasibleContainers(containers, truck, depot, disposals){
        return containers.filter(function (option) {
            let collectible = truck.isCollectible(option);
            let time = truck.willBeEnoughTimeToReturnToDepot(option, depot, disposals);
            console.log(collectible, time);
            return collectible && time;
        });
    }

    private static getBestContainer(containers, truck){
        //TODO cachear timeToBestOption para más rapidez
        containers.reduce(function (bestOption, option) {
            console.log(bestOption);
            console.log(truck);
            let timeToBestOption = truck.timeTo(bestOption);
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
