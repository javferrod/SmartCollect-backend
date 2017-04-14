const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContainerTypeSchema = new Schema({
    name: String,
    height: Number,
    width: Number,
    capacity: Number
});

module.exports = mongoose.model('ContainerType', ContainerTypeSchema);
