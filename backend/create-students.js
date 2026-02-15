// Configure DNS servers
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// User Schema (matching your auth model)
const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);

async function createStudents() {
    const connected = await connectDB();
    if (!connected) {
        process.exit(1);
    }

    try {
        console.log('📝 Creating student users...\n');

        // Student data
        const students = [
            {
                fullName: 'Rahul Kumar',
                email: 'rahul@student.com',
                password: 'student123',
                role: 'student'
            },
            {
                fullName: 'Priya Sharma',
                email: 'priya@student.com',
                password: 'student123',
                role: 'student'
            },
            {
                fullName: 'Amit Patel',
                email: 'amit@student.com',
                password: 'student123',
                role: 'student'
            },
            {
                fullName: 'Sneha Das',
                email: 'sneha@student.com',
                password: 'student123',
                role: 'student'
            },
            {
                fullName: 'Arjun Singh',
                email: 'arjun@student.com',
                password: 'student123',
                role: 'student'
            }
        ];

        // Hash passwords and insert
        for (const student of students) {
            try {
                // Check if user already exists
                const existing = await User.findOne({ email: student.email });
                if (existing) {
                    console.log(`⚠️  ${student.fullName} (${student.email}) already exists - skipped`);
                    continue;
                }

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(student.password, salt);

                // Create user
                const newUser = new User({
                    fullName: student.fullName,
                    email: student.email,
                    password: hashedPassword,
                    role: student.role
                });

                await newUser.save();
                console.log(`✅ Created: ${student.fullName} (${student.email})`);
                console.log(`   Password: ${student.password}`);
                console.log(`   Role: ${student.role}\n`);

            } catch (error) {
                console.error(`❌ Error creating ${student.fullName}:`, error.message);
            }
        }

        // Display all users
        console.log('\n📊 All users in database:\n');
        const allUsers = await User.find({}).select('-password');
        console.log(`Total users: ${allUsers.length}\n`);

        allUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.fullName}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Created: ${user.createdAt.toLocaleString()}\n`);
        });

        console.log('✅ Student creation complete!\n');
        console.log('📝 Login credentials:');
        console.log('   Email: rahul@student.com (or any student email above)');
        console.log('   Password: student123\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);
    }
}

createStudents();
