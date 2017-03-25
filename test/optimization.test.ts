import { expect } from 'chai';
import {RouteContext} from "../optimization/routesContext";
import {InitialSolver} from "../helpers/initialSolver";
import {LocalOptimization} from "../optimization/local.optimization";
import {InterRouteOptimization} from "../optimization/interRoute.optimization";

const Promise = require('bluebird');
const GraphNode = require('../models/GraphNode');

const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/test');

describe("Funciones de optimización y de generación de rutas", function() {

  describe("Realiza la solución inicial de las rutas", function () {
    it("Genera la solución inicial, que es válida si contiene rutas que pasan por todos los contenedores solo una vez", function () {


      return Promise.all([getContainers(), getDisposals(), getDepot()])
          .then(RouteContext.makeNew)
          .then(InitialSolver.generateInitialSolution)
          .then(checkIfAllContainersAreInRoute);

    });
  });
  describe("Realiza la optimización local de las rutas", function () {
    it(" Optimiza las rutas iniciales de manera local, que es válida si contiene rutas que pasan por todos los contenedores solo una vez", function () {


      return Promise.all([getContainers(), getDisposals(), getDepot()])
          .then(RouteContext.makeNew)
          .then(InitialSolver.generateInitialSolution)
          .then(LocalOptimization.optimize)
          .then(checkIfAllContainersAreInRoute);

    });
  });
  describe("Realiza la optimización inter ruta de las rutas", function () {
    it(" Optimiza las rutas intercambiando nodos entre rutas, que es válida si contiene rutas que pasan por todos los contenedores solo una vez", function () {


      return Promise.all([getContainers(), getDisposals(), getDepot()])
          .then(RouteContext.makeNew)
          .then(InitialSolver.generateInitialSolution)
          .then(LocalOptimization.optimize)
          .then(InterRouteOptimization.optimize)
          .then(checkIfAllContainersAreInRoute);
    });
  })
});

function checkIfAllContainersAreInRoute(routeContext){
  let allContainersInRoute = [];
  let allContainers = routeContext.getContainers();

  routeContext.getTrucks().forEach(function(truck){

    let containers = truck.routes.filter(function (node) {
      return node.type == 'container';
    });
    allContainersInRoute = allContainersInRoute.concat(containers);

  });
  expect(allContainersInRoute).to.have.lengthOf(allContainers.length).and.have.members(allContainers);
}

// DATABASE HELPERS

function getDepot() {
  return GraphNode.findOne({type: 'depot'});
}

function getDisposals(){
  return GraphNode.find({type: 'disposal'});
}

function getContainers(){
  return GraphNode.find({type: 'container'});
}
