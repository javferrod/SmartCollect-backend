
export class Optimization{

   repositionNodes(truck, disposals){
      let containers = truck.routes.slice();
      let bestTruck = truck.copy();

      containers = containers.filter(function (element) {
         return element.type === 'container';
      });


      containers.forEach(function (container) {
         let neighbourhood = this.getNeighbourhood(container, containers);

         neighbourhood.forEach(function (neighbour) {
            let candidate = bestTruck.copy();

            candidate.moveAfter(container, neighbour);

            if (candidate.isFeasible(disposals) && candidate.isBetterThan(bestTruck))
               bestTruck = truck;
         })
      });


   }
   // TODO de momento es cutre, habría que devolver solo los más cercanos
   getNeighbourhood(container, containers){

      let all = containers.slice();
      return this.removeFrom(all, container);
   }


   removeFrom(containers, container){
      let index = containers.indexOf(container);
      containers.splice(index, 1);
      return containers;
   }
}