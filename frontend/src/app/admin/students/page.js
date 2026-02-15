'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { isAdmin } from '../../../utils/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// API helper since we don't have a dedicated one for students yet
const studentsAPI = {
    getAll: async () => {
        const token = localStorage.getItem('token');
        return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/students`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    create: async (data) => {
        const token = localStorage.getItem('token');
        return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/students`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    update: async (id, data) => {
        const token = localStorage.getItem('token');
        return axios.put(`${process.env.NEXT_PUBLIC_API_URL}/students/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    delete: async (id) => {
        const token = localStorage.getItem('token');
        return axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/students/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default function AdminStudentsPage() {
    const router = useRouter();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        if (!isAdmin()) {
            router.push('/');
            return;
        }
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await studentsAPI.getAll();
            setStudents(res.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingStudent(null);
        setFormData({
            fullName: '',
            email: '',
            password: ''
        });
        setShowModal(true);
    };

    const openEditModal = (student) => {
        setEditingStudent(student);
        setFormData({
            fullName: student.fullName,
            email: student.email,
            password: '' // Leave empty to keep unchanged
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingStudent(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (editingStudent) {
                const updateData = {
                    fullName: formData.fullName,
                    email: formData.email
                };
                if (formData.password) {
                    updateData.password = formData.password;
                }
                await studentsAPI.update(editingStudent._id, updateData);
            } else {
                await studentsAPI.create(formData);
            }

            fetchStudents();
            closeModal();
        } catch (error) {
            alert('Error saving student: ' + (error.response?.data?.error || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this student? This action cannot be undone.')) return;

        try {
            await studentsAPI.delete(id);
            fetchStudents();
        } catch (error) {
            alert('Error deleting student: ' + error.message);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Header */}
                <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-4 shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">Manage Students</h1>
                        <p className="text-blue-100">View registered students and manage their accounts</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Students</h2>
                            <button
                                onClick={openCreateModal}
                                className="btn-primary flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Add New Student
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                        ) : students.length > 0 ? (
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider">
                                                <th className="px-6 py-4 font-semibold">Name</th>
                                                <th className="px-6 py-4 font-semibold">Email</th>
                                                <th className="px-6 py-4 font-semibold">Joined Date</th>
                                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {students.map((student) => (
                                                <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-300 font-bold mr-3">
                                                                {student.fullName.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="font-medium text-gray-900 dark:text-white">{student.fullName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{student.email}</td>
                                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                                                        {new Date(student.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => openEditModal(student)}
                                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(student._id)}
                                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                                <div className="text-gray-400 dark:text-gray-500 mb-4">
                                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
                                <p className="text-gray-500 dark:text-gray-400">Get started by adding a new student.</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {editingStudent ? 'Edit Student' : 'Add New Student'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    placeholder="John Doe"
                                    className="input-field w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="john@example.com"
                                    className="input-field w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Password {editingStudent && <span className="text-gray-500 font-normal">(Leave blank to keep current)</span>}
                                </label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={editingStudent ? "••••••••" : "Enter password"}
                                    className="input-field w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required={!editingStudent}
                                    minLength={6}
                                />
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 btn-primary"
                                >
                                    {saving ? 'Saving...' : (editingStudent ? 'Update Details' : 'Create Student')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}
