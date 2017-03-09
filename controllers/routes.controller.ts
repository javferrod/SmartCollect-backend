import {Routing} from "../helpers/routeCalculator";
const router = require('express').Router();
const GraphNode = require('../models/GraphNode');

router.get('/generate', function (req, res) {
    GraphNode.find({type: 'container'}).then(function (containers) {
        return Routing.generateInitialSolution(containers);
    }).then(function (trucks) {
        res.json(trucks);
    });
});

module.exports = router;