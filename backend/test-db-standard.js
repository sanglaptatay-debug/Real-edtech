require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection with detailed logging...\n');

// Try with standard connection string (non-SRV)
const uri = 'mongodb://sanglaptatay_db_user:Fghj%401987@cluster1-shard-00-00.jjorwmz.mongodb.net:27017,cluster1-shard-00-01.jjorwmz.mongodb.net:27017,cluster1-shard-00-02.jjorwmz.mongodb.net:27017/bengal_education?ssl=true&replicaSet=atlas-abc123-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(uri)
    .then(() => {
        console.log('✅ MongoDB connected successfully!');
        console.log('Database:', mongoose.connection.db.databaseName);
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('Error code:', err.code);
        console.error('\nFull error:', err);
        process.exit(1);
    });

// Timeout after 15 seconds
setTimeout(() => {
    console.log('\n⏱️  Connection timeout - check firewall/network settings');
    process.exit(1);
}, 15000);
