const router = require('express').Router();
const GraphNode = require('../models/GraphNode');

router.get('/nodes', function (req, res) {

    GraphNode.find().then(function (containers) {
        res.json(containers);
    }).catch(function (error) {
        console.error(error)
    })
});

module.exports = router;
