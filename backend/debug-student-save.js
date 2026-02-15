// Configure DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

async function debugStudentSave() {
    try {
        console.log('🔌 Connecting to MongoDB...');
        console.log('   URI:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected successfully');

        // Log database name
        console.log('   Database:', mongoose.connection.name);

        // List collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('\n📂 Collections in database:');
        collections.forEach(c => console.log(`   - ${c.name}`));

        // Create a test student
        const testEmail = `debug.student.${Date.now()}@test.com`;
        console.log(`\n📝 Attempting to save test student: ${testEmail}`);

        const student = new Student({
            fullName: 'Debug Student',
            email: testEmail,
            password: 'password123'
        });

        const savedStudent = await student.save();
        console.log('✅ Student saved successfully!');
        console.log('   ID:', savedStudent._id);
        console.log('   Collection:', Student.collection.name);

        // Verify it exists
        const found = await Student.findOne({ _id: savedStudent._id });
        if (found) {
            console.log('✅ Verified: Student found in database query');
        } else {
            console.error('❌ Error: Saved student not found in immediate query');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit(0);
    }
}

debugStudentSave();
