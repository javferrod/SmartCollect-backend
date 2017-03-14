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
            _container: { type: mongoose.Schema.Types.ObjectId, ref: 'GraphNode' },
            distance: Number,
            friendlyDistance: String,
            duration: Number,
            friendlyDuration: String
        }
    ]
});

GraphNodeSchema.methods.timeTo = function (destination) {

    var route = this.routes.find(function(address){
        if(address === undefined)
            console.log(container);

        return address._container.equals(destination._id);
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

GraphNodeSchema.methods.getLoad = function () {
    return 10; //TODO implementar
};


module.exports = mongoose.model('GraphNode', GraphNodeSchema);
