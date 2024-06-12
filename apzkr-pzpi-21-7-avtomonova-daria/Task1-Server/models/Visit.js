const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    gym: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Gym',
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    user:{
        type: mongoose.Schema.ObjectId, ref: "User",
        required: true
    }
});

const Visit = mongoose.models.Visit || mongoose.model('Visit', visitSchema);
module.exports = Visit;
