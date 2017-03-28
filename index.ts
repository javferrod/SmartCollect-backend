import {Graph} from "./helpers/graph";
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const Promise = require('bluebird');
const app = express();
const https = require('https');
const fs = require('fs');


// DATABASE SETUP ------
mongoose.Promise = Promise;


if(process.env.ENV === 'production')
    setUpProductionServer(app);
else
    setUpDevelopServer(app);

//STATIC FILES ------
app.use(express.static('app'));

// BODY PARSER SETUP ------
app.use(bodyParser.json());


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

// REPORTS ---

app.use('/report', require('./controllers/reports.controller'));

// HACKS ---

app.get('/fake_disposal', function (req, res) {
    Graph.insertNode(666, 42.229021, -8.719507, 11, 'disposal');
});

app.get('/depot', function (req, res) {
    Graph.insertNode(666,42.231627 ,-8.720580, 11, 'depot');
});

// HELPERS ---

function setUpDevelopServer(app){

// ENABLING CORS
    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    });


    app.listen(3000, function(){
        console.log('Develop server listening on 3000');
    });
    mongoose.connect('mongodb://localhost/test');
}

function setUpProductionServer(app){
    https.createServer({
        cert: fs.readFileSync('./ssl/fullchain.pem'),
        key: fs.readFileSync('./ssl/privkey.pem')
    }, app).listen(443);

    mongoose.connect('mongodb://mongo/test');
}