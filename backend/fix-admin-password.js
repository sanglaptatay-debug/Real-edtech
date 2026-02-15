
// Configure DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixAdminPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@bengaledu.com' });
        if (admin) {
            console.log('Found admin user. Updating password...');
            // Reset password - this will trigger the fixed pre-save hook
            admin.passwordHash = 'admin123';

            await admin.save();
            console.log('✅ Admin password updated successfully');

            // Verify
            const updatedAdmin = await User.findOne({ email: 'admin@bengaledu.com' });
            console.log('Updated hash length:', updatedAdmin.passwordHash.length);
        } else {
            console.log('❌ Admin user not found to update');
        }
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
    }
}

fixAdminPassword();
