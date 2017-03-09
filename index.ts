import {Routing} from "./helpers/routing";
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const guid = require('./helpers/guid-generator');

const distance = require('./helpers/distance');

const app = express();

//STATIC FILES ------
app.use(express.static('app'));

// BODY PARSER SETUP ------
app.use(bodyParser.json());

// ENABLING CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// DATABASE SETUP ------
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');

const GraphNode = require('./models/GraphNode');

app.listen(3000, function(){
	console.log('Listening on 3000');
});

// ANGULAR ---

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/app/index.html'));
});

// CONTAINERS ---

app.get('/containers', function (req, res) {

    GraphNode.find({type: 'containers'}).then(function (containers) {
        res.json(containers);
    }).catch(function (error) {
        console.error(error)
    })

});

app.post('/containers', function (req, res) {
    let data = req.body;
    let token = guid.generate();

    insertNode(data.id, data.lat, data.long, token, 'container');

    res.json({
        token: token,
    });
});

app.post('/container/update/:container_id', function (req, res) {
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

app.get('/container/:container_id', function (req, res) {
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

// NODES ---

app.get('/nodes', function (req, res) {

    GraphNode.find().then(function (containers) {
        res.json(containers);
    }).catch(function (error) {
        console.error(error)
    })
});


// ROUTES ---

app.get('/generate_routes', function (req, res) {
    GraphNode.find({type: 'container'}).then(function (containers) {
        return Routing.generateInitialSolution(containers);
    }).then(function (trucks) {
        res.json(trucks);
    });
});

// HACKS ---

app.get('/disposal', function (req, res) {
    insertNode(666, 42.229021, -8.719507, 11, 'disposal');
});

app.get('/depot', function (req, res) {
    insertNode(666,42.231627 ,-8.720580, 11, 'depot');
});

// HELPERS ---

function insertNode(id, lat, lng, token, type){

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
                return distance.setDistances(newNode, nodes);
            else
                return newNode;
        })
        .then(function (newNode) {
            newNode.save();
            return newNode;
        });
}