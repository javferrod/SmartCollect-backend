import {InitialSolver} from "../helpers/initialSolver";
import {LocalOptimization} from "../optimization/local.optimization";
import {InterRouteOptimization} from "../optimization/interRoute.optimization";
import {RouteContext} from "../optimization/routesContext";
const router = require('express').Router();
const GraphNode = require('../models/GraphNode');
const Route = require('../models/Route');
const Promise = require('bluebird');

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

    Route.remove({}).then(function () {

        Promise.all([getContainers(), getDisposals(), getDepot()])
            .then(RouteContext.makeNew)
            .then(InitialSolver.generateInitialSolution)
            .then(LocalOptimization.optimize)
            .then(InterRouteOptimization.optimize)
            .then(function (routeContext) {
                routeContext.getTrucks().forEach(function (truck) {
                    truck.saveRoute();
                });
                res.json(routeContext.getTrucks());
    });

});


    /*

    getContainers()
        .then(function (containersList) {
            containers = containersList;
            return getDisposals();
        })
        .then(function (disposalsList) {
            disposals = disposalsList;
            return getDepot();
        })
        .then(function (depotObject) {
            depot = depotObject;

            initialSolver = new InitialSolver(containers, disposals, depot);
            localOptimization = new LocalOptimization(disposals);
            interRouteOptimization = new InterRouteOptimization();
        })
        .then(initialSolver.generateInitialSolution)

    getDisposals()
        .then(function (disposals) {
            localOptimization = new LocalOptimization(disposals);

            return Route.remove({});
        })
        .then(function () {
            return GraphNode.find({type: 'container'});
        })
        .then(function (containers) {
        })
        .then(function(trucks){
            return localOptimization.optimize(trucks);
        })

        .then(function (trucks) {
            trucks.forEach(function (truck) {
                truck.saveRoute();
            });
            res.json(trucks);
        });*/
});

function getDepot() {
    return GraphNode.findOne({type: 'depot'});
}

function getDisposals(){
    return GraphNode.find({type: 'disposal'});
}

function getContainers(){
    return GraphNode.find({type: 'container'});
}
module.exports = router;

