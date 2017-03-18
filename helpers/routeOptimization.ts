
export class Optimization{

   static repositionNodes(truck, disposals){
      let containers = truck.routes.slice();
      let bestTruck = truck.copy();

      containers = containers.filter(function (element) {
         return element.type === 'container';
      });


      containers.forEach(function (container) {
         let neighbourhood = Optimization.getNeighbourhood(container, containers);

         neighbourhood.forEach(function (neighbour) {
            let candidate = bestTruck.copy();

            candidate.moveAfter(container, neighbour);

            if (candidate.isFeasible(disposals) && candidate.isBetterThan(bestTruck))
               bestTruck = truck;
         })
      });

      return bestTruck;

   }
   // TODO de momento es cutre, habría que devolver solo los más cercanos
   static getNeighbourhood(container, containers){

      let all = containers.slice();
      return Optimization.removeFrom(all, container);
   }


   private static removeFrom(containers, container){
      let index = containers.indexOf(container);
      containers.splice(index, 1);
      return containers;
   }
}