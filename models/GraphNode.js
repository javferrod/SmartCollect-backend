SAMPLES_PER_CONECTION = 24;

const mongoose = require('mongoose');
const dateHelper = require('../helpers/dates');

const Schema = mongoose.Schema;

const GraphNodeSchema = new Schema({
    id: Number,
    token: String,
    last_seen: Date,
    type: String,
    address: {
        _id: false,
        lat: Number,
        long: Number,
        friendlyName: String
    },
    measures: [{
        _id: false,
        timestamp: Date,
        filling: Number
    }],
    routes: [
        {
            _id: false,
            _container: { type: mongoose.Schema.Types.ObjectId, ref: 'Container' },
            distance: Number,
            friendlyDistance: String,
            duration: Number,
            friendlyDuration: String
        }
    ]
});

GraphNodeSchema.methods.timeTo = function (destination) {

    var route = this.distances.find(function(address){
        return address._container === destination._id;
    });

    return route.duration;
};

GraphNodeSchema.methods.getLatLng = function(){
    return this.address.lat + ', ' + this.address.long
};

GraphNodeSchema.methods.processMeasures = function(measures){
    var today = new Date();
    this.last_seen = today;

    measures.forEach(function(measure){
        var hoursSinceMeasure = SAMPLES_PER_CONECTION - measure.index;
        var timestamp = dateHelper.substractHours(today, hoursSinceMeasure);

        this.appendMeasure(measure.filling, timestamp);
    }.bind(this));
};


GraphNodeSchema.methods.appendMeasure = function(filling, timestamp) {

    this.measures.push({
        timestamp: timestamp,
        filling: filling // For the moment it will be only the filling measure
    })
};


//TODO esto va para angular
GraphNodeSchema.methods.decideStatus = function () {

    var isDisconnected = this.measures.length === 0;

    if(isDisconnected)
        this._doc.status = 'disconnected';
    else
        this.decideIfFailureOrSuccess();
};

//TODO mejorar esta comprobación de "salud" del contenedor
GraphNodeSchema.methods.decideIfFailureOrSuccess = function () {
   var today = new Date();
   var days = dateHelper.daysBetween(this.last_seen, today);

   if(days <= 2)
       this._doc.status = 'success';
   else
      this._doc.status = 'failure'
};


module.exports = mongoose.model('GraphNode', GraphNodeSchema);
