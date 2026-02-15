require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection with DNS workaround...\n');

// Use direct connection to primary shard (bypass SRV)
const uri = 'mongodb://sanglaptatay_db_user:wdWrwMUIgM7wtUNI@cluster1-shard-00-00.jjorwmz.mongodb.net:27017,cluster1-shard-00-01.jjorwmz.mongodb.net:27017,cluster1-shard-00-02.jjorwmz.mongodb.net:27017/bengal_education?ssl=true&replicaSet=atlas-m6nj9z-shard-0&authSource=admin&retryWrites=true&w=majority';

console.log('Attempting connection...');

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
})
    .then(() => {
        console.log('\n✅ SUCCESS! MongoDB connected!');
        console.log('Database:', mongoose.connection.db.databaseName);
        console.log('\nYou can now use the real backend server!');
        process.exit(0);
    })
    .catch(err => {
        console.error('\n❌ Connection failed');
        console.error('Error:', err.message);
        console.error('\nDiagnosis: Network/Firewall is blocking MongoDB Atlas');
        console.error('Solution: Check MONGODB_TROUBLESHOOTING.md');
        process.exit(1);
    });
