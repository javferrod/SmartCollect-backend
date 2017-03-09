import {Graph} from "../helpers/graph";
const router = require('express').Router();
const GraphNode = require('../models/GraphNode');
const guid = require('../helpers/guid-generator');

router.get('/', function (req, res) {
    GraphNode.find({type: 'disposal'}).then(function (disposals) {
       res.json(disposals);
    })
});

router.post('/', function(req, res){
    let data = req.body;

    Graph.insertNode(data.id, data.lat, data.long, '', 'disposal')
        .then(function () {
            res.sendStatus(200);
        });
});

module.exports = router;