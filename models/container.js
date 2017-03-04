SAMPLES_PER_CONECTION = 24;

var mongoose = require('mongoose');
var dateHelper = require('../helpers/dates');

var Schema = mongoose.Schema;

var ContainerSchema = new Schema({
    id: Number,
    token: String,
    last_seen: Date,
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
    distances: [
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

ContainerSchema.post('find', function (containers) {

    containers.map(function (container) {
        container.decideStatus();
    });

});

ContainerSchema.post('findOne', function (container) {

    container.decideStatus();

});


ContainerSchema.methods.getLatLng = function(){
    return this.address.lat + ', ' + this.address.long
};

ContainerSchema.methods.processMeasures = function(measures){
    var today = new Date();
    this.last_seen = today;

    measures.forEach(function(measure){
        var hoursSinceMeasure = SAMPLES_PER_CONECTION - measure.index;
        var timestamp = dateHelper.substractHours(today, hoursSinceMeasure);

        this.appendMeasure(measure.filling, timestamp);
    }.bind(this));
};


ContainerSchema.methods.appendMeasure = function(filling, timestamp) {

    this.measures.push({
        timestamp: timestamp,
        filling: filling // For the moment it will be only the filling measure
    })
};

ContainerSchema.methods.decideStatus = function () {

    var isDisconnected = this.measures.length === 0;

    if(isDisconnected)
        this._doc.status = 'disconnected';
    else
        this.decideIfFailureOrSuccess();
};

//TODO mejorar esta comprobación de "salud" del contenedor
ContainerSchema.methods.decideIfFailureOrSuccess = function () {
   var today = new Date();
   var days = dateHelper.daysBetween(this.last_seen, today);

   if(days <= 2)
       this._doc.status = 'success';
   else
      this._doc.status = 'failure'
};


module.exports = mongoose.model('Container', ContainerSchema);
