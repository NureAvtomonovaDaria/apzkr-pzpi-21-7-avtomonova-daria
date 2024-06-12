const mongoose = require('mongoose');

const gymSchema = new mongoose.Schema({
    address: {type: String, required: true},
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' , required: true},
    zones: [{ type: String, enum: ['Gym', 'Pool', 'Boxing', 'Yoga'] }],
    trainersList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trainer' }],
    coachesList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    subscriptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Subscription' }]
});

const Gym = mongoose.models.Gym || mongoose.model('Gym', gymSchema);
module.exports = Gym;
