const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// BODY PARSER SETUP ------
app.use(bodyParser.urlencoded({
  extended: true
}));

// DATABASE SETUP ------
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');

const Container = require('./models/container');


app.listen(3000, function(){
	console.log('Listening on 3000');
});

app.get('/', function(req, res){
	res.send('It is working :)');
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

    var container = new Container({
        id: data.id,
        token: data.token,
        lat: data.lat,
        long: data.long,
        filling: []
    });
    container.save();

    res.sendStatus(200);
});

app.post('/containers/update/:container_id', function (req, res) {
    var containerId = req.params.container_id;
    var measures = req.body.measures;

    Container.findOne({id: containerId}).then(function (container) {

        measures.forEach(function(measure){
            container.appendMeasure(measure);
        });

        container.save();

        res.sendStatus(200);
    }).catch(function (error) {
        console.error(error);

        res.sendStatus(404);
    });
});
