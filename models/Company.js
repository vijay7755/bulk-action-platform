const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    industry: { type: String, required: true },
    status: { type: String, default: 'active' }, // new field for status
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);