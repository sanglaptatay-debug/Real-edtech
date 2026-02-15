const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// Get all students (Admin only)
router.get('/', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const students = await Student.find().select('-password').sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Server error while fetching students' });
    }
});

// Create new student (Admin only - Manual registration)
router.post('/', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ error: 'Student with this email already exists' });
        }

        const student = new Student({
            fullName,
            email,
            password
        });

        await student.save();

        res.status(201).json({
            message: 'Student created successfully',
            student: {
                _id: student._id,
                fullName: student.fullName,
                email: student.email,
                createdAt: student.createdAt
            }
        });
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(500).json({ error: 'Server error while creating student' });
    }
});

// Update student (Admin only)
router.put('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        student.fullName = fullName || student.fullName;
        student.email = email || student.email;
        if (password && password.trim() !== '') {
            student.password = password;
        }

        await student.save();

        res.json({
            message: 'Student updated successfully',
            student: {
                _id: student._id,
                fullName: student.fullName,
                email: student.email,
                updatedAt: student.updatedAt
            }
        });
    } catch (error) {
        console.error('Error updating student:', error);
        res.status(500).json({ error: 'Server error while updating student' });
    }
});

// Delete student (Admin only)
router.delete('/:id', auth, roleCheck('Admin'), async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error('Error deleting student:', error);
        res.status(500).json({ error: 'Server error while deleting student' });
    }
});

module.exports = router;
