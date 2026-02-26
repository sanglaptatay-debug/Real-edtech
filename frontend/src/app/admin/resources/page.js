'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { coursesAPI } from '../../../utils/api';
import { isAdmin } from '../../../utils/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// API helper for resources
const resourcesAPI = {
    getAllByCourse: async (courseId) => {
        const token = localStorage.getItem('token');
        return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/resources/course/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    create: async (data) => {
        const token = localStorage.getItem('token');
        return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/resources`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    update: async (id, data) => {
        const token = localStorage.getItem('token');
        return axios.put(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
    },
    delete: async (id) => {
        const token = localStorage.getItem('token');
        return axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/resources/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
    }
};

export default function AdminResourcesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingResource, setEditingResource] = useState(null);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({ resourceName: '', resourceUrl: '' });

    useEffect(() => {
        if (!isAdmin()) { router.push('/'); return; }
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await coursesAPI.getAll();
            setCourses(res.data);
            if (res.data.length > 0) setSelectedCourse(res.data[0]._id);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    useEffect(() => {
        if (selectedCourse) fetchResources(selectedCourse);
    }, [selectedCourse]);

    const fetchResources = async (courseId) => {
        setLoading(true);
        try {
            const res = await resourcesAPI.getAllByCourse(courseId);
            setResources(res.data);
        } catch (error) {
            console.error('Error fetching resources:', error);
            setResources([]);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        if (!selectedCourse) { alert('Please select a course first.'); return; }
        setEditingResource(null);
        setFormData({ resourceName: '', resourceUrl: '' });
        setShowModal(true);
    };

    const openEditModal = (resource) => {
        setEditingResource(resource);
        setFormData({ resourceName: resource.resourceName, resourceUrl: resource.resourceUrl });
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingResource(null); };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = { courseId: selectedCourse, ...formData };
            if (editingResource) {
                await resourcesAPI.update(editingResource._id, payload);
            } else {
                await resourcesAPI.create(payload);
            }
            fetchResources(selectedCourse);
            closeModal();
        } catch (error) {
            alert('Error saving resource: ' + (error.response?.data?.error || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this resource?')) return;
        try {
            await resourcesAPI.delete(id);
            fetchResources(selectedCourse);
        } catch (error) {
            alert('Error deleting resource: ' + error.message);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                <section className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white py-12 px-4 shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">Manage Resources</h1>
                        <p className="text-teal-100">Upload and organize study materials for your courses</p>
                    </div>
                </section>

                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">

                        {/* Course Selector */}
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 mb-8 flex flex-col md:flex-row md:items-center gap-4">
                            <label className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap">Select Course:</label>
                            <select
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                className="input-field max-w-md w-full"
                            >
                                <option value="" disabled>-- Choose a course --</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course._id}>{course.title}</option>
                                ))}
                            </select>
                            {selectedCourse && (
                                <button onClick={openCreateModal} className="btn-primary flex items-center gap-2 md:ml-auto">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Resource
                                </button>
                            )}
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
                            </div>
                        ) : !selectedCourse ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-gray-500 dark:text-gray-400">Please select a course to view and manage its resources.</p>
                            </div>
                        ) : resources.length > 0 ? (
                            <div className="grid gap-4">
                                {resources.map((resource) => (
                                    <div key={resource._id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-teal-50 dark:bg-teal-900/30 rounded-lg flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{resource.resourceName}</h3>
                                                <a
                                                    href={resource.resourceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-sm text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    View Resource
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 ml-auto">
                                            <button
                                                onClick={() => openEditModal(resource)}
                                                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >Edit</button>
                                            <button
                                                onClick={() => handleDelete(resource._id)}
                                                className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
                                <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No resources yet</h3>
                                <p className="text-gray-500 dark:text-gray-400">Add a Google Drive, PDF link or any resource URL to get started.</p>
                                <button onClick={openCreateModal} className="btn-primary mt-4">Add First Resource</button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {editingResource ? 'Edit Resource' : 'Add New Resource'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resource Name *</label>
                                <input
                                    type="text"
                                    value={formData.resourceName}
                                    onChange={(e) => setFormData({ ...formData, resourceName: e.target.value })}
                                    placeholder="e.g., Week 1 Slides, Lab Manual"
                                    className="input-field w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Resource URL *</label>
                                <input
                                    type="url"
                                    value={formData.resourceUrl}
                                    onChange={(e) => setFormData({ ...formData, resourceUrl: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                    className="input-field w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Paste a Google Drive, Dropbox, YouTube, or any direct link.</p>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600">
                                    Cancel
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 btn-primary bg-teal-600 hover:bg-teal-700">
                                    {saving ? 'Saving...' : (editingResource ? 'Update' : 'Add Resource')}
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
