import {Truck} from "../models/truck";
import { expect } from 'chai';

describe("Funciones de clase Truck", function() {
    describe("Insertar un nodo despues de otro", function () {
        it("inserta un nodo despues de otro existente en la ruta", function () {
            let truck = new Truck();

            let node0 = {name: "node 0"};
            let node1 = {name: "node 1"};
            let node2 = {name: "node 2"};
            let node3 = {name: "node 3"};
            let node4 = {name: "node 4"};
            let node5 = {name: "node 5"};

            let nodes = [node0, node1, node2, node3, node4, node5];

            truck.routes = nodes;
            truck.moveAfter(node0, node4);
            expect(truck.routes).to.deep.equal([node1, node2, node3, node4, node0, node5])
        });
    });

    describe("Reemplaza un nodo con otro", function () {
        it("Reemplaza el nodo indicado por otro", function () {

            let truck = new Truck();

            let node0 = {name: "node 0"};
            let node1 = {name: "node 1"};
            let node2 = {name: "node 2"};
            let node3 = {name: "node 3"};
            let node4 = {name: "node 4"};
            let node5 = {name: "node 5"};

            let nodes = [node0, node1, node2, node3, node4, node5];

            let newNode = {name: "new node"};

            truck.routes = nodes;
            truck.replace(node4, newNode);
            expect(truck.routes).to.deep.equal([node0, node1, node2, node3, newNode, node5])
        });
    });
});
