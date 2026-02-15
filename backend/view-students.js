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

// Student Schema
const StudentSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    enrolledCourses: Array,
    createdAt: { type: Date, default: Date.now },
    lastLogin: Date
});

const Student = mongoose.model('Student', StudentSchema);

async function viewStudents() {
    const connected = await connectDB();
    if (!connected) {
        process.exit(1);
    }

    try {
        console.log('👨‍🎓 Fetching all students from MongoDB...\n');

        const students = await Student.find({}).select('-password');

        if (students.length === 0) {
            console.log('📭 No students found in database\n');
        } else {
            console.log(`📊 Total students: ${students.length}\n`);
            console.log('='.repeat(70));

            students.forEach((student, index) => {
                console.log(`\n${index + 1}. ${student.fullName}`);
                console.log(`   📧 Email: ${student.email}`);
                console.log(`   🆔 ID: ${student._id}`);
                console.log(`   📅 Registered: ${student.createdAt.toLocaleString()}`);
                if (student.lastLogin) {
                    console.log(`   🔐 Last Login: ${student.lastLogin.toLocaleString()}`);
                }
                if (student.enrolledCourses && student.enrolledCourses.length > 0) {
                    console.log(`   📚 Enrolled Courses: ${student.enrolledCourses.length}`);
                }
            });

            console.log('\n' + '='.repeat(70));
            console.log(`\n📈 Total Students: ${students.length}\n`);
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed');
        process.exit(0);
    }
}

viewStudents();
