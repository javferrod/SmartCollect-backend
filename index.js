const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var path = require('path');
const guid = require('./helpers/guid-generator');

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

const Container = require('./models/container');


app.listen(3000, function(){
	console.log('Listening on 3000');
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/app/index.html'));
});

app.get('/containers', function (req, res) {

    Container.find().then(function (containers) {
        res.json(containers);
    }).catch(function (error) {
        console.error(error)
    })

});

app.post('/containers', function (req, res) {
    var data = req.body;

    var token = guid.generate();

    var container = new Container({
        id: data.id,
        token: token,
        address: {
            lat: data.lat,
            long: data.long
        },
        filling: []
    });
    container.save();
    console.log(token);
    res.json({
        token: token
    });

});

app.post('/container/update/:container_id', function (req, res) {
    var containerId = req.params.container_id;
    var measures = req.body.measures;

    Container.findOne({id: containerId})
        .then(function (container) {

            measures.forEach(function(measure){
                container.appendMeasure(measure);
            });

            container.save();
            res.sendStatus(200);
        })
        .catch(function (error) {
            console.error(error);
            res.sendStatus(404);
        });
});

app.get('/container/:container_id', function (req, res) {
    var containerId = req.params.container_id;

    Container.findOne({id: containerId})
        .then(function (container) {
            res.json(container);
        })
        .catch(function (error) {
           console.error(error);
           res.sendStatus(404);
        })
});