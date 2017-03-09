import {Graph} from "./helpers/graph";
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

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


app.listen(3000, function(){
	console.log('Listening on 3000');
});

// ANGULAR ---

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/app/index.html'));
});

// CONTAINERS ---

app.use('/container', require('./controllers/containers.controller'));

// NODES ---

app.use('/node', require('./controllers/nodes.controller'));

// ROUTES ---

app.use('/route', require('./controllers/routes.controller'));

// DISPOSAL ---

app.use('/disposal', require('./controllers/disposals.controller'));

// HACKS ---

app.get('/fake_disposal', function (req, res) {
    Graph.insertNode(666, 42.229021, -8.719507, 11, 'disposal');
});

app.get('/depot', function (req, res) {
    Graph.insertNode(666,42.231627 ,-8.720580, 11, 'depot');
});

// HELPERS ---

