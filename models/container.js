var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContainerSchema = new Schema({
    id: Number,
    token: String,
    address: {
        _id: false,
        lat: Number,
        long: Number
    },
    measures: [{
        _id: false,
        timeStamp: Date,
        filling: Number
    }]
});

ContainerSchema.post('find', function (containers) {

    containers.map(function (container) {
        container.decideStatus();
    });

});

ContainerSchema.methods.appendMeasure = function (measure) {
    this.measures.append({
        timeStamp: new Date(),
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
