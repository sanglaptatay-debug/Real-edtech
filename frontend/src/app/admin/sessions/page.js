'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { liveSessionsAPI, coursesAPI } from '../../../utils/api';
import { isAdmin } from '../../../utils/auth';
import { useRouter } from 'next/navigation';

export default function AdminSessionsPage() {
    const router = useRouter();
    const [sessions, setSessions] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSession, setEditingSession] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        sessionTitle: '',
        scheduledTime: '',
        gmeetLink: '',
        courseId: ''
    });

    useEffect(() => {
        if (!isAdmin()) {
            router.push('/');
            return;
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [sessionsRes, coursesRes] = await Promise.all([
                liveSessionsAPI.getAll(),
                coursesAPI.getAll()
            ]);
            setSessions(sessionsRes.data);
            setCourses(coursesRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const openCreateModal = () => {
        setEditingSession(null);
        setFormData({
            sessionTitle: '',
            scheduledTime: '',
            gmeetLink: '',
            courseId: courses[0]?._id || ''
        });
        setShowModal(true);
    };

    const openEditModal = (session) => {
        setEditingSession(session);
        setFormData({
            sessionTitle: session.sessionTitle,
            scheduledTime: new Date(session.scheduledTime).toISOString().slice(0, 16),
            gmeetLink: session.gmeetLink,
            courseId: session.courseId?._id || session.courseId
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingSession(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingSession) {
                await liveSessionsAPI.update(editingSession._id, formData);
            } else {
                await liveSessionsAPI.create(formData);
            }

            fetchData();
            closeModal();
        } catch (error) {
            alert('Error saving session: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this session?')) return;

        try {
            await liveSessionsAPI.delete(id);
            fetchData();
        } catch (error) {
            alert('Error deleting session: ' + error.message);
        }
    };

    const getCourseTitle = (courseId) => {
        // If courseId is already populated as an object
        if (courseId && courseId.title) {
            return courseId.title;
        }
        // If courseId is just an ID string, find from courses array
        const idToCheck = courseId?._id || courseId;
        const course = courses.find(c => c._id === idToCheck);
        return course?.title || 'Unknown Course';
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <section className="gradient-bg text-white py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">Manage Live Sessions</h1>
                        <p className="text-blue-100">Create, edit, and schedule live class sessions</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Sessions</h2>
                            <button
                                onClick={openCreateModal}
                                className="btn-primary"
                            >
                                + Add New Session
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                        ) : sessions.length > 0 ? (
                            <div className="grid gap-4">
                                {sessions.map((session) => (
                                    <div key={session._id} className="card">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                    {session.sessionTitle}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                                    Course: {getCourseTitle(session.courseId)}
                                                </p>
                                                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                                                    📅 {new Date(session.scheduledTime).toLocaleString('en-US', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                {session.gmeetLink && (
                                                    <a
                                                        href={session.gmeetLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm"
                                                    >
                                                        🔗 Google Meet Link
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(session)}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(session._id)}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 card">
                                <p className="text-gray-600 text-lg">No sessions scheduled yet.</p>
                                <button
                                    onClick={openCreateModal}
                                    className="btn-primary mt-4"
                                >
                                    Create First Session
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {editingSession ? 'Edit Session' : 'Create New Session'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Session Title *
                                </label>
                                <input
                                    type="text"
                                    value={formData.sessionTitle}
                                    onChange={(e) => setFormData({ ...formData, sessionTitle: e.target.value })}
                                    placeholder="e.g., Introduction to AI"
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Course *
                                </label>
                                <select
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                    className="input-field"
                                    required
                                >
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Date & Time *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.scheduledTime}
                                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Google Meet Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.gmeetLink}
                                    onChange={(e) => {
                                        let val = e.target.value;
                                        // Auto-extract URL if user pastes entire Google Meet invitation text
                                        const urlMatch = val.match(/(https?:\/\/[^\s]+)/);
                                        if (urlMatch) {
                                            val = urlMatch[0];
                                        }
                                        setFormData({ ...formData, gmeetLink: val });
                                    }}
                                    placeholder="https://meet.google.com/..."
                                    className="input-field"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-primary"
                                >
                                    {editingSession ? 'Update Session' : 'Create Session'}
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
