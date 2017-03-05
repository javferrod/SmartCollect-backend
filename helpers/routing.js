//TODO: En progreso
var routing = {
    generateInitialSolution: function (containers) {

    },

    generateOneRoute: function(containers){

        var origin = depot; //conseguirDepot
        var truck = truck; //init truck

        var route = [origin];

        while(! truck.finished()){
            var nextContainer = chooseNextContainer(origin, containers, truck, depot);

            route.push(nextContainer);

            truck.currentTime += origin.timeTo(nextContainer);
            containers.remove(nextContainer); //check if disposal. If disposal, do nothing
            truck.updateLoad(nextContainer);

            origin = nextContainer;
        }


        var currentTime = 0; // T cuando abre el deposito
        var totalVisited = 0;
        var qTotal = 0; //Load total que tiene que cargar el vehiculo
        var qCurrent = 0; //Current load del vehiculo
        var currentDestination = 0; //container que se tiene como destino en la ruta actual
        var breakTaken = false; //si ya ha tenido su pausa
    }
};

function chooseNextContainer(origin, containers, truck, depot) {

   return containers
       .filter(function (option) {
           return isVisitable(origin, option, truck.currentTime)
       })
       .filter(function (option) {
           return isCollectible(option, truck);
       })
       .filter(function (option) {
           return thereIsTimeToReturnToDepot(origin, option, truck, depot);
       })
       .reduce(function (bestOption, option) {
           var timeToBestOption = origin.timeTo(bestOption); //TODO cachear esto para más rapidez
           var timeToOption = origin.timeTo(option);

           if(timeToOption < timeToBestOption)
               return timeToBestOption;
       })
}

function isVisitable(origin, destination, actualTime){

    var arrivalTime = origin.timeTo(destination) + actualTime;

    return (arrivalTime > container.openTime && arrivalTime < container.closeTime);
}

function isCollectible(option, truck) {
    return truck.haveCapacityFor(option);
}

function thereIsTimeToReturnToDepot(origin, destination, truck, depot) {
    //Time necesary to recollect destination from origin
    var recollectionTime = origin.timeTo(destination) + truck.collectionTime;

    //Time from destination to the nearest disposal
    var nearestDisposal = origin.getNearestDisposal();
    var emptyingTime = origin.timeTo(nearestDisposal) + truck.emptyingTime;

    //Time to depot from disposal
    var timeToDepot = nearestDisposal.timeTo(depot);

    //Total
    var futureTime = truck.currentTime + recollectionTime + emptyingTime + timeToDepot;

    return (futureTime <= depot.closeTime)
}

