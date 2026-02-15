// Configure DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB connected\n');
        return true;
    } catch (error) {
        console.error('❌ Connection error:', error.message);
        return false;
    }
};

// User Schema
const UserSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    role: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function viewUsers() {
    const connected = await connectDB();
    if (!connected) {
        process.exit(1);
    }

    try {
        console.log('👥 Fetching all users from MongoDB...\n');

        const users = await User.find({}).select('-password');

        if (users.length === 0) {
            console.log('📭 No users found in database\n');
        } else {
            console.log(`📊 Total users: ${users.length}\n`);
            console.log('='.repeat(60));

            users.forEach((user, index) => {
                console.log(`\n${index + 1}. ${user.fullName}`);
                console.log(`   📧 Email: ${user.email}`);
                console.log(`   👤 Role: ${user.role}`);
                console.log(`   🆔 ID: ${user._id}`);
                console.log(`   📅 Created: ${user.createdAt.toLocaleString()}`);
            });

            console.log('\n' + '='.repeat(60));

            // Count by role
            const students = users.filter(u => u.role === 'student').length;
            const admins = users.filter(u => u.role === 'admin').length;

            console.log(`\n📈 Summary:`);
            console.log(`   Students: ${students}`);
            console.log(`   Admins: ${admins}`);
            console.log(`   Total: ${users.length}\n`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);
    }
}

// Auto-refresh every 3 seconds if --watch flag is provided
const watchMode = process.argv.includes('--watch');

if (watchMode) {
    console.log('👀 Watch mode enabled - refreshing every 3 seconds...\n');
    setInterval(viewUsers, 3000);
} else {
    viewUsers();
}
