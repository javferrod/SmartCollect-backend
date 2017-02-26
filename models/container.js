var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContainerSchema = new Schema({
    id: Number,
    token: String,
    lat: Number,
    long: Number,
    measures: [{
        _id: false,
        timeStamp: Date,
        filling: Number
    }]
});

ContainerSchema.methods.appendMeasure = function (measure) {
    this.measures.append({
        timeStamp: new Date(),
        filling: measure // For the moment it will be only the filling measure
    })
};

module.exports = mongoose.model('Container', ContainerSchema);
