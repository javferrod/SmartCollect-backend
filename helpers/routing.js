//TODO: En progreso
var routing = {
    generateInitialSolution: function (containers) {

    },

    generateOneRoute: function(containers){

        var origin = getDepot(); //conseguirDepot
        var truck = new Truck(); //init truck

        while(! truck.finished()){
            var nextContainer = chooseNextContainer(origin, containers, truck, depot);

            containers.remove(nextContainer); //check if disposal. If disposal, do nothing
            truck.attachDestination(nextContainer);

            origin = nextContainer;
        }

        return truck;
    }
};

function chooseNextContainer(containers, truck, depot) {

   return containers
       .filter(function (option) {
           return truck.isVisitable(option)
       })
       .filter(function (option) {
           return truck.isCollectible(option);
       })
       .filter(function (option) {
           return truck.willBeEnoughTimeToReturnToDepot(option, depot);
       })
       .reduce(function (bestOption, option) {
           var timeToBestOption = truck.timeTo(bestOption); //TODO cachear esto para más rapidez
           var timeToOption = truck.timeTo(option);

           if(timeToOption < timeToBestOption)
               return timeToBestOption;
       })
}

function getDepot() {
    GraphNode.findOne({type: 'depot'}).then(function (depot) {
       return depot;
    })
}


