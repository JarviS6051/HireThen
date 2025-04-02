// server.js
const dotenv = require('dotenv');

// Load environment variables first
dotenv.config();

const app = require('./app');
const { port, connectDB } = require('./config/db'); // Updated import

// Debug logs
// console.log('MONGO_URI from process.env:', process.env.MONGO_URI);
// console.log('PORT from process.env:', process.env.PORT);
// console.log('config.mongoURI:', config.mongoURI);

// Connect to database
connectDB();

// Start server
const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});