// Configure DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1);
    }
};

// Define a simple test schema
const TestSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const TestData = mongoose.model('TestData', TestSchema);

// Insert test data
async function insertTestData() {
    try {
        await connectDB();

        console.log('\n📝 Inserting test data...\n');

        const testRecords = [
            {
                name: 'John Doe',
                email: 'john@example.com',
                message: 'This is a test message from MongoDB!'
            },
            {
                name: 'Jane Smith',
                email: 'jane@example.com',
                message: 'Testing MongoDB connection with sample data'
            },
            {
                name: 'Bengal Education',
                email: 'info@bengaledu.com',
                message: 'MongoDB is working perfectly! 🎉'
            }
        ];

        // Clear existing test data
        await TestData.deleteMany({});
        console.log('🗑️  Cleared existing test data\n');

        // Insert new test data
        const inserted = await TestData.insertMany(testRecords);
        console.log(`✅ Successfully inserted ${inserted.length} test records:\n`);

        inserted.forEach((record, index) => {
            console.log(`${index + 1}. ${record.name} (${record.email})`);
            console.log(`   Message: ${record.message}`);
            console.log(`   ID: ${record._id}`);
            console.log(`   Created: ${record.createdAt}\n`);
        });

        // Retrieve and display all data
        console.log('\n📊 Retrieving all test data from MongoDB:\n');
        const allData = await TestData.find({});
        console.log(`Found ${allData.length} records in database\n`);

        allData.forEach((record, index) => {
            console.log(`Record ${index + 1}:`);
            console.log(JSON.stringify(record, null, 2));
            console.log('---\n');
        });

        console.log('✅ Test completed successfully!');
        console.log('🎉 MongoDB is working and data is being stored correctly!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);
    }
}

// Run the test
insertTestData();
