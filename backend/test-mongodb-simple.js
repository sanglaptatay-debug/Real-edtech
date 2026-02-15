// Configure DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
        return true;
    } catch (error) {
        console.error('Connection error:', error.message);
        return false;
    }
};

// Test schema
const TestSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const TestData = mongoose.model('TestData', TestSchema);

async function runTest() {
    const connected = await connectDB();
    if (!connected) {
        process.exit(1);
    }

    try {
        // Clear old data
        await TestData.deleteMany({});
        console.log('Cleared old test data');

        // Insert test records
        const records = [
            { name: 'John Doe', email: 'john@test.com', message: 'Test message 1' },
            { name: 'Jane Smith', email: 'jane@test.com', message: 'Test message 2' },
            { name: 'Bengal Edu', email: 'info@bengaledu.com', message: 'MongoDB working!' }
        ];

        const inserted = await TestData.insertMany(records);
        console.log(`\nInserted ${inserted.length} records:`);

        inserted.forEach((r, i) => {
            console.log(`${i + 1}. ${r.name} - ${r.email}`);
        });

        // Retrieve all
        const all = await TestData.find({});
        console.log(`\nTotal records in DB: ${all.length}`);

        console.log('\nSUCCESS: MongoDB is working!');

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

runTest();
