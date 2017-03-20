const GraphNode = require('../models/GraphNode');

export class LocalOptimization{

   disposals: any[];

   constructor(disposals){
     this.disposals = disposals;
   }

   optimize(trucks){
     return trucks.map(function (truck) {
        return this.repositionNodes(truck);
     }.bind(this))
   }

   private repositionNodes(truck){
      let containers = truck.routes.slice();
      let bestTruck = truck.copy();

      containers = containers.filter(function (element) {
         return element.type === 'container';
      });


      containers.forEach(function (container) {
         let neighbourhood = LocalOptimization.getNeighbourhood(container, containers);

         neighbourhood.forEach(function (neighbour) {
            let candidate = bestTruck.copy();
            candidate.moveAfter(container, neighbour);

            let feasible = candidate.isFeasible(this.disposals);
            let better = candidate.isBetterThan(bestTruck);


            if (feasible && better){
               bestTruck = candidate;
            }
         }.bind(this))
      }.bind(this));

      return bestTruck;

   }
   // TODO de momento es cutre, habría que devolver solo los más cercanos
   private static getNeighbourhood(container, containers){

      let all = containers.slice();
      return LocalOptimization.removeFrom(all, container);
   }


   private static removeFrom(containers, container){
      let index = containers.indexOf(container);
      containers.splice(index, 1);
      return containers;
   }
}