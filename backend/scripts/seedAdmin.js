require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        // Connect to database
        await connectDB();

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@bengaledu.com' });

        if (existingAdmin) {
            console.log('⚠️  Admin user already exists');
            console.log('📧 Email:', existingAdmin.email);
            console.log('👤 Role:', existingAdmin.role);
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            fullName: 'Bengal Admin',
            email: 'admin@bengaledu.com',
            passwordHash: 'Admin@123', // Will be hashed by pre-save hook
            role: 'Admin'
        });

        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email: admin@bengaledu.com');
        console.log('🔑 Password: Admin@123');
        console.log('👤 Role: Admin');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        process.exit(1);
    }
};

seedAdmin();
