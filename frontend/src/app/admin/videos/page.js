'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { projectVideosAPI } from '../../../utils/api';
import { isAdmin } from '../../../utils/auth';
import { useRouter } from 'next/navigation';

export default function AdminVideosPage() {
    const router = useRouter();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        embedUrl: ''
    });

    useEffect(() => {
        if (!isAdmin()) {
            router.push('/');
            return;
        }
        fetchVideos();
    }, []);

    const fetchVideos = async () => {
        try {
            const response = await projectVideosAPI.getAll();
            setVideos(response.data);
        } catch (error) {
            console.error('Error fetching videos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            if (editingId) {
                await projectVideosAPI.update(editingId, formData);
                setMessage('Video updated successfully!');
                setEditingId(null);
            } else {
                await projectVideosAPI.create(formData);
                setMessage('Video added successfully!');
            }

            setFormData({ title: '', description: '', embedUrl: '' });
            fetchVideos();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error saving video: ' + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (video) => {
        setEditingId(video._id);
        setFormData({
            title: video.title,
            description: video.description,
            embedUrl: video.embedUrl
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        try {
            await projectVideosAPI.delete(id);
            setMessage('Video deleted successfully!');
            fetchVideos();
            setShowDeleteConfirm(null);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error deleting video: ' + error.message);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', embedUrl: '' });
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Header */}
                <section className="gradient-bg text-white py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">Manage Project Videos</h1>
                        <p className="text-blue-100">Add, edit, or delete project videos displayed on the Projects page</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                        ) : (
                            <>
                                {/* Add/Edit Form */}
                                <div className="card mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                        {editingId ? 'Edit Video' : 'Add New Video'}
                                    </h2>

                                    {message && (
                                        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error')
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                                            {message}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Video Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="AI Robot Demo"
                                                className="input-field"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Description *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Student-built AI-powered robot"
                                                className="input-field"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                YouTube Embed URL *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.embedUrl}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    let newUrl = val;

                                                    // Check if it's an iframe tag
                                                    if (val.includes('<iframe')) {
                                                        const srcMatch = val.match(/src=["']([^"']+)["']/);
                                                        if (srcMatch && srcMatch[1]) {
                                                            newUrl = srcMatch[1];
                                                        }
                                                    }
                                                    // Check if it's a standard YouTube URL
                                                    else if (val.includes('youtube.com/watch?v=')) {
                                                        const videoId = val.split('v=')[1]?.split('&')[0];
                                                        if (videoId) {
                                                            newUrl = `https://www.youtube.com/embed/${videoId}`;
                                                        }
                                                    }
                                                    // Check if it's a youtu.be URL
                                                    else if (val.includes('youtu.be/')) {
                                                        const videoId = val.split('youtu.be/')[1]?.split('?')[0];
                                                        if (videoId) {
                                                            newUrl = `https://www.youtube.com/embed/${videoId}`;
                                                        }
                                                    }

                                                    setFormData({ ...formData, embedUrl: newUrl });
                                                }}
                                                placeholder="Paste YouTube URL or Embed Code"
                                                className="input-field"
                                                required
                                            />
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Supports standard YouTube URLs, short links, or direct Embed Code
                                            </p>
                                        </div>

                                        {/* Preview */}
                                        {formData.embedUrl && (
                                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Preview</h3>
                                                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                    <iframe
                                                        className="w-full h-full"
                                                        src={formData.embedUrl}
                                                        title="Preview"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {saving ? 'Saving...' : (editingId ? 'Update Video' : 'Add Video')}
                                            </button>
                                            {editingId && (
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Videos List */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Current Videos ({videos.length})</h2>

                                    {videos.length === 0 ? (
                                        <div className="card text-center py-12">
                                            <p className="text-gray-500 dark:text-gray-400">No videos yet. Add your first video above!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {videos.map((video) => (
                                                <div key={video._id} className="card">
                                                    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
                                                        <iframe
                                                            className="w-full h-full"
                                                            src={video.embedUrl}
                                                            title={video.title}
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                            allowFullScreen
                                                        ></iframe>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{video.title}</h3>
                                                    <p className="text-gray-600 dark:text-gray-300 mb-4">{video.description}</p>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(video)}
                                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setShowDeleteConfirm(video._id)}
                                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>

                                                    {/* Delete Confirmation Modal */}
                                                    {showDeleteConfirm === video._id && (
                                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
                                                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                                                    Are you sure you want to delete "{video.title}"? This action cannot be undone.
                                                                </p>
                                                                <div className="flex gap-4">
                                                                    <button
                                                                        onClick={() => handleDelete(video._id)}
                                                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setShowDeleteConfirm(null)}
                                                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
