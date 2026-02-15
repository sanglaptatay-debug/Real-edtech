require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing standard (non-SRV) MongoDB connection...\n');

// Standard connection string without SRV (what Compass uses)
const uri = 'mongodb://sanglaptatay_db_user:wdWrwMUIgM7wtUNI@ac-r8s5kub-shard-00-00.jjorwmz.mongodb.net:27017,ac-r8s5kub-shard-00-01.jjorwmz.mongodb.net:27017,ac-r8s5kub-shard-00-02.jjorwmz.mongodb.net:27017/bengal_education?ssl=true&replicaSet=atlas-abc123-shard-0&authSource=admin&retryWrites=true&w=majority';

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
})
    .then(() => {
        console.log('✅ SUCCESS! MongoDB connected using standard connection string!');
        console.log('Database:', mongoose.connection.db.databaseName);
        console.log('\nCompass connected, so this should work too.');
        process.exit(0);
    })
    .catch(err => {
        console.error('❌ Standard connection failed');
        console.error('Error:', err.message);

        console.log('\n💡 Since Compass works, try getting the connection string from Compass:');
        console.log('   1. In Compass, click the connected cluster');
        console.log('   2. Look for connection details or export connection string');
        console.log('   3. Use that exact string in the .env file');

        process.exit(1);
    });
