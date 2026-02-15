require('dotenv').config();
const mongoose = require('mongoose');

// Simple direct connection test
console.log('Testing MongoDB connection...');
console.log('Connection string:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hide password in logs

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ MongoDB connection failed:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    });
