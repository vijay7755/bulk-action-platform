const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require("express-rate-limit");
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


const limitTime = 10 * 60 * 1000;
// rate limiter
const bulkActionLimiter = rateLimit({
    windowMs: limitTime,
    max: (req, res) => {
        if (req?.user?.isAdmin) { // we can configure absed on privilage user
            return 500;
        }
        return 150;
    },
    handler: function (req, res /*, next */) {
        // we can implement more customized logic here like validation based user privilage, etc
        // next() or send response as below
        const timeRemaining = (limitTime - (Date.now() % limitTime)) / 1000;
        res.status(this.statusCode).json({
            message: `Too many requests from this IP, please try again after ${Math.ceil(timeRemaining / 60)} minutes.`
        });
    },
    onLimitReached: function (req, res, options) {
        console.warn(`Rate limit exceeded for ${req.ip}`);
    }
});


// Routes
app.use('/bulk-actions', bulkActionLimiter, bulkActions);
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