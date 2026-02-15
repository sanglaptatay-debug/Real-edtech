
// Configure DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const count = await User.countDocuments();
        console.log(`📊 Total Users: ${count}`);

        const admin = await User.findOne({ email: 'admin@bengaledu.com' });
        if (admin) {
            console.log('✅ Admin user found:');
            console.log('   ID:', admin._id);
            console.log('   Email:', admin.email);
            console.log('   Role:', admin.role);
            console.log('   PasswordHash length:', admin.passwordHash ? admin.passwordHash.length : 0);
        } else {
            console.log('❌ Admin user NOT found');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

checkAdmin();
