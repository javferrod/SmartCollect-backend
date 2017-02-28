var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContainerSchema = new Schema({
    id: Number,
    token: String,
    last_seen: Date,
    address: {
        _id: false,
        lat: Number,
        long: Number
    },
    measures: [{
        _id: false,
        timestamp: Date,
        filling: Number
    }]
});

ContainerSchema.post('find', function (containers) {

    containers.map(function (container) {
        container.decideStatus();
    });

});

ContainerSchema.post('findOne', function (container) {

    container.decideStatus();

});

ContainerSchema.methods.appendMeasure = function (measure) {
    var today = new Date();

    this.last_seen = today;
    this.measures.push({
        timestamp: today, //todo Hay que cambiar esto, debería de calcularse en función de las muestras que se reciban.
        filling: measure // For the moment it will be only the filling measure
    })
};

ContainerSchema.methods.decideStatus = function () {
    if(this.measures.length == 0)
        this._doc.status = 'disconnected';
    else
        this._doc.status = 'success';
    //TODO realizar comprobación de "salud" del contenedor
};


module.exports = mongoose.model('Container', ContainerSchema);
