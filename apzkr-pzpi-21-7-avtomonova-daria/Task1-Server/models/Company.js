const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
});

const Company = mongoose.models.Company || mongoose.model('Company', companySchema);
module.exports = Company;
