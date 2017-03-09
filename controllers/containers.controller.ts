import {Graph} from "../helpers/graph";
const router = require('express').Router();
const GraphNode = require('../models/GraphNode');
const guid = require('../helpers/guid-generator');

router.get('/', function (req, res) {

    GraphNode.find({type: 'container'}).then(function (containers) {
        res.json(containers);
    }).catch(function (error) {
        console.error(error)
    })

});

router.post('/', function (req, res) {
    let data = req.body;
    let token = guid.generate();

    Graph.insertNode(data.id, data.lat, data.long, token, 'container');

    res.json({
        token: token,
    });
});

router.post('/update/:container_id', function (req, res) {
    let containerId = req.params.container_id;
    let measures = req.body.measures;

    GraphNode.findOne({id: containerId})
        .then(function (container) {

            container.processMeasures(measures);
            container.save();

            res.sendStatus(200);
        })
        .catch(function (error) {
            console.error(error);
            res.sendStatus(404);
        });
});

router.get('/:container_id', function (req, res) {
    let containerId = req.params.container_id;

    GraphNode.findOne({id: containerId})
        .then(function (container) {
            res.json(container);
        })
        .catch(function (error) {
            console.error(error);
            res.sendStatus(404);
        })
});

module.exports = router;
