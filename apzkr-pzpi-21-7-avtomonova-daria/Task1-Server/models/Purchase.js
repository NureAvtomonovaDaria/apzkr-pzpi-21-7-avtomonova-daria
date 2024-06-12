const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
    subscription: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
});

const Purchase = mongoose.models.Purchase || mongoose.model('Purchase', purchaseSchema);
module.exports = Purchase;

