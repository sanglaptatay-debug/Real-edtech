'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { webProjectsAPI } from '../../../utils/api';
import { isAdmin } from '../../../utils/auth';
import { useRouter } from 'next/navigation';

export default function AdminWebProjectsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        links: [{ label: '', url: '' }]
    });

    useEffect(() => {
        if (!isAdmin()) {
            router.push('/');
            return;
        }
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await webProjectsAPI.getAll();
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...formData.links];
        newLinks[index][field] = value;
        setFormData({ ...formData, links: newLinks });
    };

    const addLink = () => {
        setFormData({
            ...formData,
            links: [...formData.links, { label: '', url: '' }]
        });
    };

    const removeLink = (index) => {
        const newLinks = formData.links.filter((_, i) => i !== index);
        setFormData({ ...formData, links: newLinks });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        // Filter out empty links
        const validLinks = formData.links.filter(link => link.label && link.url);
        const dataToSave = { ...formData, links: validLinks };

        try {
            if (editingId) {
                await webProjectsAPI.update(editingId, dataToSave);
                setMessage('Project updated successfully!');
                setEditingId(null);
            } else {
                await webProjectsAPI.create(dataToSave);
                setMessage('Project added successfully!');
            }

            setFormData({ title: '', description: '', links: [{ label: '', url: '' }] });
            fetchProjects();
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error saving project: ' + (error.response?.data?.error || error.message));
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (project) => {
        setEditingId(project._id);
        setFormData({
            title: project.title,
            description: project.description,
            links: project.links.length > 0 ? project.links : [{ label: '', url: '' }]
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        try {
            await webProjectsAPI.delete(id);
            setMessage('Project deleted successfully!');
            fetchProjects();
            setShowDeleteConfirm(null);
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error deleting project: ' + error.message);
        }
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({ title: '', description: '', links: [{ label: '', url: '' }] });
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
                {/* Header */}
                <section className="gradient-bg text-white py-12 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">Manage Web Projects</h1>
                        <p className="text-blue-100">Add web projects with custom links (GitHub, Drive, Live Demo, etc.)</p>
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
                                        {editingId ? 'Edit Project' : 'Add New Project'}
                                    </h2>

                                    {message && (
                                        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error')
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {message}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Project Title *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g., EduTech Platform via AI"
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
                                                placeholder="e.g., Full-stack learning management system"
                                                className="input-field"
                                                required
                                            />
                                        </div>

                                        {/* Dynamic Links */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Project Links
                                            </label>
                                            <div className="space-y-3">
                                                {formData.links.map((link, index) => (
                                                    <div key={index} className="flex gap-3 items-start">
                                                        <div className="flex-1">
                                                            <input
                                                                type="text"
                                                                value={link.label}
                                                                onChange={(e) => handleLinkChange(index, 'label', e.target.value)}
                                                                placeholder="Label (e.g., GitHub)"
                                                                className="input-field"
                                                            />
                                                        </div>
                                                        <div className="flex-[2]">
                                                            <input
                                                                type="url"
                                                                value={link.url}
                                                                onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                                                placeholder="URL"
                                                                className="input-field"
                                                            />
                                                        </div>
                                                        {formData.links.length > 1 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => removeLink(index)}
                                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                                                title="Remove Link"
                                                            >
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addLink}
                                                className="mt-3 text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center gap-1"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Add Another Link
                                            </button>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {saving ? 'Saving...' : (editingId ? 'Update Project' : 'Add Project')}
                                            </button>
                                            {editingId && (
                                                <button
                                                    type="button"
                                                    onClick={cancelEdit}
                                                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Projects List */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Current Web Projects ({projects.length})</h2>

                                    {projects.length === 0 ? (
                                        <div className="card text-center py-12">
                                            <p className="text-gray-500">No web projects yet. Add your first project above!</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {projects.map((project) => (
                                                <div key={project._id} className="card">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                            </svg>
                                                        </div>
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">{project.title}</h3>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 mb-4 h-12 overflow-hidden">{project.description}</p>

                                                    <div className="flex flex-wrap gap-2 mb-4">
                                                        {project.links.map((link, i) => (
                                                            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                {link.label}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(project)}
                                                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => setShowDeleteConfirm(project._id)}
                                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>

                                                    {/* Delete Confirmation Modal */}
                                                    {showDeleteConfirm === project._id && (
                                                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                                            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4">
                                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Delete</h3>
                                                                <p className="text-gray-600 dark:text-gray-300 mb-6">
                                                                    Are you sure you want to delete "{project.title}"? This action cannot be undone.
                                                                </p>
                                                                <div className="flex gap-4">
                                                                    <button
                                                                        onClick={() => handleDelete(project._id)}
                                                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                                                    >
                                                                        Delete
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setShowDeleteConfirm(null)}
                                                                        className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
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
