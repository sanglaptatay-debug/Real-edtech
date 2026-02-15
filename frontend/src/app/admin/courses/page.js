'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { coursesAPI } from '../../../utils/api';
import { isAdmin } from '../../../utils/auth';
import { useRouter } from 'next/navigation';

export default function AdminCoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        summary: '',
        category: 'AI',
        googleFormLink: '',
    });
    const [imageFile, setImageFile] = useState(null);

    const categories = ['AI', 'Drone Technology', '3D Printing', 'Other'];

    useEffect(() => {
        if (!isAdmin()) {
            router.push('/');
            return;
        }
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await coursesAPI.getAll();
            setCourses(res.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setFormData({
            title: '',
            summary: '',
            category: 'AI',
            googleFormLink: '',
        });
        setImageFile(null);
        setShowModal(true);
    };

    const openEditModal = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            summary: course.summary,
            category: course.category,
            googleFormLink: course.googleFormLink || '',
        });
        setImageFile(null);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCourse(null);
        setImageFile(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('summary', formData.summary);
            data.append('category', formData.category);
            data.append('googleFormLink', formData.googleFormLink);
            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingCourse) {
                await coursesAPI.update(editingCourse._id, data);
            } else {
                await coursesAPI.create(data);
            }

            fetchCourses();
            closeModal();
        } catch (error) {
            alert('Error saving course: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;

        try {
            await coursesAPI.delete(id);
            fetchCourses();
        } catch (error) {
            alert('Error deleting course: ' + error.message);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50">
                {/* Header */}
                <section className="gradient-bg text-white py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">Manage Courses</h1>
                        <p className="text-blue-100">Create, edit, and remove courses</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">All Courses</h2>
                            <button
                                onClick={openCreateModal}
                                className="btn-primary"
                            >
                                + Add New Course
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                        ) : courses.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {courses.map((course) => (
                                    <div key={course._id} className="card flex flex-col h-full">
                                        {course.image && (
                                            <div className="h-48 w-full relative mb-4 rounded-lg overflow-hidden">
                                                <img
                                                    src={course.image.startsWith('http') ? course.image : `http://localhost:5000${course.image}`}
                                                    alt={course.title}
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                                    {course.category}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                {course.summary}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                            <button
                                                onClick={() => openEditModal(course)}
                                                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(course._id)}
                                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 card">
                                <p className="text-gray-600 text-lg">No courses available yet.</p>
                                <button
                                    onClick={openCreateModal}
                                    className="btn-primary mt-4"
                                >
                                    Create First Course
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {editingCourse ? 'Edit Course' : 'Create New Course'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Course Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Advanced AI & Machine Learning"
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category *
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Summary/Description *
                                </label>
                                <textarea
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    placeholder="Brief description of the course..."
                                    className="input-field min-h-[100px]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Course Image
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="block w-full text-sm text-gray-500 dark:text-gray-400
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-blue-50 file:text-blue-700
                                        hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                                />
                                {editingCourse && editingCourse.image && !imageFile && (
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Current image: {editingCourse.image.split('/').pop()}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Google Form Link (Registration)
                                </label>
                                <input
                                    type="url"
                                    value={formData.googleFormLink}
                                    onChange={(e) => setFormData({ ...formData, googleFormLink: e.target.value })}
                                    placeholder="https://docs.google.com/forms/..."
                                    className="input-field"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="flex-1 btn-primary disabled:opacity-50"
                                >
                                    {uploading ? 'Saving...' : (editingCourse ? 'Update Course' : 'Create Course')}
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
