const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bulkActions = require('./routes/bulkActions');
const contacts = require('./routes/contacts');
const dbConfig = require('./config/db');

// Initialize the app
const app = express();

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));

// Connect to MongoDB
mongoose.connect(dbConfig.url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Routes
app.use('/bulk-actions', bulkActions);
app.use('/contacts', contacts);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});