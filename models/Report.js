const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReportSchema = new Schema({
    email: String,
    name: String,
    body: String,
    type: String,
    createdAt: Date,
    seen: Boolean,
    container: { type: mongoose.Schema.Types.ObjectId, ref: 'GraphNode' }
});

ReportSchema.pre('save', function(next) {
    if(this.isNew){
        this.createdAt = new Date();
        this.seen = false;
    }

    next();
});


module.exports = mongoose.model('Report', ReportSchema);
