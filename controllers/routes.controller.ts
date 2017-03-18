import {Routing} from "../helpers/routeCalculator";
import {Optimization} from "../helpers/routeOptimization";
const router = require('express').Router();
const GraphNode = require('../models/GraphNode');
const Route = require('../models/Route');

router.get('/', function (req, res) {

   Route
       .find()
       .populate('nodes._graphNode')
       .exec()
       .then(function(nodes){
           return res.json(nodes);
       })
       .catch(function (err) {
          console.error(err);
          return res.status(500);
       });

});


router.get('/generate', function (req, res) {

    let disposals;

    Routing.getDisposals()
        .then(function (disposalsList) {
            disposals = disposalsList;
            return Route.remove({});
        })
        .then(function () {
            return GraphNode.find({type: 'container'});
        })
        .then(function (containers) {
            return Routing.generateInitialSolution(containers);
        })
        /*.then(function (trucks) {
            let optimizedTrucks = [];

            trucks.forEach(function(truck){
                optimizedTrucks.push(Optimization.repositionNodes(truck, disposals));
            });

            return optimizedTrucks;
        })*/
        .then(function (trucks) {
            trucks.forEach(function (truck) {
                truck.saveRoute();
            });
            res.json(trucks);
        });
});



module.exports = router;