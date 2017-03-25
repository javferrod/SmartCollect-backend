const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
    time: Number,
    nodes: [
        {
            _id: false,
            order: Number,
            _graphNode: { type: mongoose.Schema.Types.ObjectId, ref: 'GraphNode' }
        }
    ]
});

module.exports = mongoose.model('Route', RouteSchema);

