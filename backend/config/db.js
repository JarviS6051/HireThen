// config/db.js
const mongoose = require('mongoose');

// Configuration object
const config = {
    port: process.env.PORT || 5000,
    mongoURI: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiration: '24h'
};



// MongoDB connection function
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Create indexes for frequently queried fields
        await Promise.all([
            mongoose.model('User').createIndexes(),
            mongoose.model('Transaction').createIndexes(),
            mongoose.model('Budget').createIndexes()
        ]);
    } catch (err) {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    }
};

// Export both config and connectDB
module.exports = {
    ...config,
    connectDB
};