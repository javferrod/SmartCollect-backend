const GraphNode = require('../models/GraphNode');
const distanceCalculator = require('./distanceCalculator');

export class Graph{

    static insertNode(id, lat, lng, token, type){
        let newNode = new GraphNode({
            id: id,
            token: token,
            type: type,
            address: {
                lat: lat,
                long: lng
            },
            measures: [],
            routes: []
        });

        return GraphNode.find()
            .then(function (nodes) {
                if(nodes.length !== 0)
                    return distanceCalculator.setDistances(newNode, nodes);
                else
                    return newNode;
            })
            .then(function (newNode) {
                newNode.save();
                return newNode;
            });
    }
}
