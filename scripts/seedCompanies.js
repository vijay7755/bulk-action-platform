const mongoose = require('mongoose');
const Company = require('../models/Company');

async function seedCompanies() {
    await mongoose.connect('mongodb://localhost:27017/bulk-action-platform', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const companies = [
        { name: 'Tech Corp', industry: 'Technology' },
        { name: 'Health Inc.', industry: 'Healthcare' },
        { name: 'Finance LLC', industry: 'Finance' },
        { name: 'Edu Services', industry: 'Education' },
        { name: 'Retailers Ltd.', industry: 'Retail' },
    ];

    await Company.deleteMany({});
    await Company.insertMany(companies);

    console.log('Companies seeded!');
    mongoose.disconnect();
}

seedCompanies();
