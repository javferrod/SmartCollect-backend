const googleDistance = require('google-distance');

var distance = {

    setDistances: function (originContainer, otherContainers){

        if(otherContainers.length === 0) return;

        var origin = originContainer.getLatLng();

        var destinations = otherContainers.map(function (destination) {
            return destination.getLatLng();
        });

        return askForDistances([origin], destinations)
        
            //Calculamos la distancia del nuevo contenedor a los demás
            .then(function(response){
                return parseResponse(response, otherContainers);
            })
            .then(function (addressAndOrigin) {
                return setAddressAndOrigin(addressAndOrigin, originContainer);
            })

            //Calculamos la distancia de los demás contenedores al nuevo y la guardamos
            .then(function () {
                return askForDistances(destinations, [origin])
            })
            .then(function (distancesResponse) {
                return parseResponse(distancesResponse, [originContainer]);
            })
            .then(function (distancesResponse) {
                return insertOneAddressOnEachContainer(otherContainers, distancesResponse);
            })
            .then(function (containers) {
                containers.forEach(function (container) {
                   container.save();
                });
            })

            //Finally, return the new container with the new addresses
            .then(function () {
               return originContainer;
            })

    }
};

function insertOneAddressOnEachContainer(containers, address) {
    return containers.map(function(container, index){
        container.distances.push(address.distances[index]);
        return container;
    });
}

//HELPERS

function askForDistances(origins, destinations){
     return new Promise(function(resolve, reject) {
         googleDistance.get(
             {
                 origins: origins,
                 destinations: destinations
             },
             function(err, distances) {
                 if(err)
                     reject(err);
                 else
                     resolve(distances);
             });
     });
}
/*
* If containers has several items, uses each element of the array one time in order.
* If only contains one element will use that element for all distances
 */
function parseResponse(response, containers) {
    

   var distances = response.map(function(distanceResponse, index){
       var _container;
       
       if(containers.length === 1)
          _container = containers[0];
       else
           _container = containers[index];
       
       return {
           _container: _container._id,
           distance: distanceResponse.distanceValue,
           friendlyDistance: distanceResponse.distance,
           duration: distanceResponse.durationValue,
           friendlyDuration: distanceResponse.duration
       }
   });

    var originAddress = response[0].origin;

    return {
        distances: distances,
        originAddress: originAddress
    }
}

function setAddressAndOrigin(addressAndOrigin, container){

    container.address.friendlyName = addressAndOrigin.originAddress;
    container.distances = addressAndOrigin.distances;

    return container;
}

module.exports = distance;
