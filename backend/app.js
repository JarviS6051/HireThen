// app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');

// Create Express app
const app = express();

// Body parser middleware
app.use(express.json());

// Enable CORS
app.use(cors());

app.use(cors({
    origin: '*',  // In development, allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Morgan logger
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routes
app.use('/', routes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        success: false,
        error: 'Server Error'
    });
});

module.exports = app;