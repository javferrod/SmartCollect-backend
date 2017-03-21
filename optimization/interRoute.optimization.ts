import {Truck} from "../models/truck";


export class InterRouteOptimization {

    containers: any[];
    disposals: any[];
    trucks: Truck[];

    constructor(containers, disposals){
        this.containers = containers.slice();
        this.disposals = disposals;
    }

    optimize(trucks){

        this.trucks = trucks.slice();
        console.log(this.containers);
        this.containers.forEach(function(container1){
            let neighbourhood = InterRouteOptimization.getNeighbourhood(container1, this.containers);

            let truck1 = this.getAssignedTruck(container1);

            neighbourhood.forEach(function (container2) {
               let truck2 = this.getAssignedTruck(container2);

               this.swapIfBetter(truck1, truck2, container1, container2);

            }.bind(this))

        }.bind(this));

        this.trucks.forEach(function (truck) {
            console.log("[Truck] Tiempo despues de fase 2: "+truck.currentTime);
        });


        return this.trucks;
    }

    private swapIfBetter(truck1, truck2, container1, container2){
        let truck1Copy = truck1.copy();
        let truck2Copy = truck2.copy();

        this.swapContainers(truck1Copy, truck2Copy, container1, container2);

        if(! truck1Copy.isFeasible(this.disposals))
            return;
        if(! truck2Copy.isFeasible(this.disposals))
            return;

        if(this.copiesBetterThanOriginals(truck1, truck2, truck1Copy, truck2Copy)){
            this.replaceTruck(truck1, truck1Copy);
            this.replaceTruck(truck2, truck2Copy);
        }
    }

    private swapContainers(truck1, truck2, container1, container2){
        truck1.replace(container1, container2);
        truck2.replace(container2, container1);
    }

    // EVALUATION & HELPERS

    private copiesBetterThanOriginals(original1, original2, copy1, copy2): boolean{
        let originalTime = original1.currentTime + original2.currentTime;
        let copyTime = copy1.currentTime + copy2.currentTime;

        return copyTime < originalTime;
    }

    private getAssignedTruck(container): Truck{
        this.trucks.forEach(function (truck) {
            if(truck.haveNode(container))
                return truck;
        });
        return null;
    }

    private replaceTruck(oldTruck, newTruck){
        let index = this.trucks.indexOf(oldTruck);
        this.trucks[index] = newTruck;
    }

    // NEIGHBOURHOOD

    // TODO de momento es cutre, habría que devolver solo los más cercanos
    private static getNeighbourhood(container, containers){

        let all = containers.slice();
        return InterRouteOptimization.removeFrom(all, container);
    }


    private static removeFrom(containers, container){
        let index = containers.indexOf(container);
        containers.splice(index, 1);
        return containers;
    }
}