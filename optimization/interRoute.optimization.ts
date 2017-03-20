/*
export class InterRouteOptimization {


    optimize(trucks){

        containers.forEach(function(container){
            let neighbourhood = InterRouteOptimization.getNeighbourhood(container, containers);
            let assignedTruck = this.getAssignedTruck(container);

            neighbourhood.forEach(function (neighbour) {
               let otherAssignedTruck = this.getAssignedTruck(container);



            }.bind(this))

        }.bind(this))
    }



    private getAssignedTruck(container, trucks){
        trucks.forEach(function (truck) {
           if(truck.haveNode(container))
               return truck;
        });
        return null;
    }


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
}*/