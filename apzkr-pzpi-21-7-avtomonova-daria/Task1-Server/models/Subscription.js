const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: { type: Number, required: true},
    coach: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    duration: Number,
    action: String
});

const Subscription = mongoose.models.Subscription || mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;