const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const Trainer = mongoose.models.Trainer || mongoose.model('Trainer', trainerSchema);
module.exports = Trainer;
