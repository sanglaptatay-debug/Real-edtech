'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { settingsAPI } from '../../../utils/api';
import { isAdmin } from '../../../utils/auth';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../../context/ThemeContext';

export default function AdminSettingsPage() {
    const router = useRouter();
    const { fetchSettings } = useTheme(); // To update global theme/logo state after save
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [logoPreview, setLogoPreview] = useState('');
    const [logoFile, setLogoFile] = useState(null);

    const [formData, setFormData] = useState({
        email: '',
        tagline: '',
        phone: '',
        address: '',
        organization: '',
        youtubeLink: '',
        darkModeEnabled: true
    });

    useEffect(() => {
        if (!isAdmin()) {
            router.push('/');
            return;
        }
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const res = await settingsAPI.get();
            const data = res.data;
            if (data) {
                setFormData({
                    email: data.contactInfo?.email || '',
                    tagline: data.contactInfo?.tagline || '',
                    phone: data.contactInfo?.phone || '',
                    address: data.contactInfo?.address || '',
                    organization: data.contactInfo?.organization || '',
                    youtubeLink: data.contactInfo?.youtubeLink || '',
                    darkModeEnabled: data.darkModeEnabled
                });
                if (data.logoUrl) {
                    setLogoPreview(data.logoUrl.startsWith('data:') ? data.logoUrl : `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${data.logoUrl}`);
                }
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            setMessage('Error loading settings.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const data = new FormData();

            // Append Contact Info as JSON string
            const contactInfo = {
                email: formData.email,
                tagline: formData.tagline,
                phone: formData.phone,
                address: formData.address,
                organization: formData.organization,
                youtubeLink: formData.youtubeLink
            };
            data.append('contactInfo', JSON.stringify(contactInfo));

            // Append Dark Mode setting
            data.append('darkModeEnabled', formData.darkModeEnabled);

            // Append Logo if selected
            if (logoFile) {
                data.append('logo', logoFile);
            }

            await settingsAPI.update(data);

            setMessage('Settings updated successfully!');
            // Refresh global theme/logo context
            fetchSettings();

            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            setMessage('Error updating settings: ' + (error.response?.data?.error || error.message));
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Header */}
                <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-4xl font-bold mb-2">Site Settings</h1>
                        <p className="text-blue-100">Manage logo, contact details, and site configurations</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 px-4">
                    <div className="max-w-4xl mx-auto">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                                <div className="p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">General Settings</h2>

                                    {message && (
                                        <div className={`mb-6 p-4 rounded-lg ${message.includes('Error')
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                                            : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                                            }`}>
                                            {message}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        {/* Logo Upload Section */}
                                        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">Website Logo</h3>
                                            <div className="flex items-start gap-6">
                                                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative">
                                                    {logoPreview ? (
                                                        <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain" />
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No Logo</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        Upload New Logo
                                                    </label>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-gray-700 dark:file:text-gray-300"
                                                    />
                                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Recommended size: 200x200px. Formats: PNG, JPG, SVG. Max size: 5MB.</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info Section */}
                                        <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">Contact Information</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tagline</label>
                                                    <input
                                                        type="text"
                                                        value={formData.tagline}
                                                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                                                    <input
                                                        type="text"
                                                        value={formData.address}
                                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Organization</label>
                                                    <input
                                                        type="text"
                                                        value={formData.organization}
                                                        onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">YouTube Link</label>
                                                    <input
                                                        type="url"
                                                        value={formData.youtubeLink}
                                                        onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* System Settings */}
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-4">System Settings</h3>
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id="darkMode"
                                                    checked={formData.darkModeEnabled}
                                                    onChange={(e) => setFormData({ ...formData, darkModeEnabled: e.target.checked })}
                                                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                                />
                                                <label htmlFor="darkMode" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
                                                    Enable Dark Mode Toggle for Users
                                                    <p className="text-xs text-gray-500">If unchecked, the site will be locked to Light Mode.</p>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex gap-4 pt-4">
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {saving ? 'Saving...' : 'Save Changes'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
                <Footer />
            </main>
        </>
    );
}
