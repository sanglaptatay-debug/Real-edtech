'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { galleryAPI } from '../../utils/api';
import { isAdmin } from '../../utils/auth';

export default function GalleryPage() {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAdminUser, setIsAdminUser] = useState(false);

    // Upload form state
    const [uploadFile, setUploadFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');

    // Replace image state
    const [replaceModal, setReplaceModal] = useState(null); // {imageId, caption}
    const [replaceFile, setReplaceFile] = useState(null);
    const [replacePreview, setReplacePreview] = useState('');

    useEffect(() => {
        setIsAdminUser(isAdmin());
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const response = await galleryAPI.getAll();
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching gallery:', error);
        } finally {
            setLoading(false);
        }
    };

    const openLightbox = (image, index) => {
        setSelectedImage({ ...image, index });
    };

    const closeLightbox = () => {
        setSelectedImage(null);
    };

    const showNext = () => {
        if (selectedImage && selectedImage.index < images.length - 1) {
            const nextIndex = selectedImage.index + 1;
            setSelectedImage({ ...images[nextIndex], index: nextIndex });
        }
    };

    const showPrevious = () => {
        if (selectedImage && selectedImage.index > 0) {
            const prevIndex = selectedImage.index - 1;
            setSelectedImage({ ...images[prevIndex], index: prevIndex });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setUploadMessage('File size must be less than 5MB');
                return;
            }
            setUploadFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setUploadMessage('');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!uploadFile) {
            setUploadMessage('Please select an image');
            return;
        }

        setUploading(true);
        setUploadMessage('');

        const formData = new FormData();
        formData.append('image', uploadFile);
        formData.append('caption', caption);

        try {
            await galleryAPI.upload(formData);
            setUploadMessage('Image uploaded successfully!');
            setUploadFile(null);
            setCaption('');
            setPreviewUrl('');
            fetchGallery(); // Refresh gallery

            setTimeout(() => setUploadMessage(''), 3000);
        } catch (error) {
            setUploadMessage('Upload failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploading(false);
        }
    };

    const openReplaceModal = (image) => {
        setReplaceModal({ imageId: image._id, caption: image.caption });
        setReplaceFile(null);
        setReplacePreview('');
    };

    const closeReplaceModal = () => {
        setReplaceModal(null);
        setReplaceFile(null);
        setReplacePreview('');
    };

    const handleReplaceFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('File size must be less than 5MB');
                return;
            }
            setReplaceFile(file);
            setReplacePreview(URL.createObjectURL(file));
        }
    };

    const handleReplace = async (e) => {
        e.preventDefault();
        if (!replaceFile) {
            alert('Please select an image');
            return;
        }

        setUploading(true);

        const formData = new FormData();
        formData.append('image', replaceFile);
        formData.append('caption', replaceModal.caption);

        console.log('🔄 Attempting to replace image:', replaceModal.imageId);


        try {
            await galleryAPI.update(replaceModal.imageId, formData);
            setUploadMessage('Image replaced successfully!');
            fetchGallery();
            closeReplaceModal();
            setTimeout(() => setUploadMessage(''), 3000);
        } catch (error) {
            alert('Replace failed: ' + (error.response?.data?.error || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (imageId) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await galleryAPI.delete(imageId);
            setUploadMessage('Image deleted successfully');
            fetchGallery();
            setTimeout(() => setUploadMessage(''), 3000);
        } catch (error) {
            alert('Delete failed: ' + (error.response?.data?.error || error.message));
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="gradient-bg text-white py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-blue-200 mb-3 text-sm uppercase tracking-wide">A Programme of BIOROBODRAI</p>
                        <h1 className="text-5xl font-bold mb-4">Seminar Gallery</h1>
                        <p className="text-xl text-blue-100">Moments from our workshops, seminars, and student achievements</p>
                    </div>
                </section>

                {/* Admin Upload Section */}
                {isAdminUser && (
                    <section className="py-12 px-4 bg-gray-50 border-b-2 border-gray-200">
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-lg p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
                                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                                        Admin Only
                                    </span>
                                </div>

                                {uploadMessage && (
                                    <div className={`mb-4 p-4 rounded-lg ${uploadMessage.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                        {uploadMessage}
                                    </div>
                                )}

                                <form onSubmit={handleUpload} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 p-2"
                                        />
                                        <p className="mt-1 text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                                    </div>

                                    {previewUrl && (
                                        <div className="relative">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full max-h-64 object-contain rounded-lg border-2 border-gray-200"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Caption (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={caption}
                                            onChange={(e) => setCaption(e.target.value)}
                                            placeholder="Enter image caption..."
                                            className="input-field"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={uploading || !uploadFile}
                                        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Uploading...
                                            </span>
                                        ) : 'Upload Image'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </section>
                )}

                {/* Gallery Grid */}
                <section className="py-16 px-4">
                    <div className="max-w-7xl mx-auto">
                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                                <p className="mt-4 text-gray-600">Loading gallery...</p>
                            </div>
                        ) : images.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {images.map((image, index) => (
                                    <div
                                        key={image._id}
                                        onClick={() => openLightbox(image, index)}
                                        className="group relative aspect-square overflow-hidden rounded-xl cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
                                    >
                                        <img
                                            src={image.imageUrl.startsWith('data:') ? image.imageUrl : `http://localhost:5000${image.imageUrl}`}
                                            alt={image.caption || 'Gallery image'}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />

                                        {/* Admin Actions */}
                                        {isAdminUser && (
                                            <div className="absolute top-2 right-2 flex gap-2 z-10">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openReplaceModal(image);
                                                    }}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-lg"
                                                    title="Replace Image"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(image._id);
                                                    }}
                                                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg shadow-lg"
                                                    title="Delete Image"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}

                                        {image.caption && (
                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                                <p className="text-sm">{image.caption}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 text-lg">No images in the gallery yet.</p>
                                <p className="text-gray-500 text-sm mt-2">Check back soon for photos from our seminars!</p>
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
                    onClick={closeLightbox}
                >
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-10"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {selectedImage.index > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); showPrevious(); }}
                            className="absolute left-4 text-white hover:text-gray-300 p-2 bg-black bg-opacity-50 rounded-full"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    <div onClick={(e) => e.stopPropagation()} className="max-w-5xl max-h-[90vh]">
                        <img
                            src={selectedImage.imageUrl.startsWith('data:') ? selectedImage.imageUrl : `http://localhost:5000${selectedImage.imageUrl}`}
                            alt={selectedImage.caption || 'Gallery image'}
                            className="max-w-full max-h-[80vh] object-contain rounded-lg"
                        />
                        {selectedImage.caption && (
                            <p className="text-white text-center mt-4 text-lg">{selectedImage.caption}</p>
                        )}
                    </div>

                    {selectedImage.index < images.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); showNext(); }}
                            className="absolute right-4 text-white hover:text-gray-300 p-2 bg-black bg-opacity-50 rounded-full"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>
            )}

            {/* Replace Image Modal */}
            {replaceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-gray-900">Replace Image</h3>
                            <button
                                onClick={closeReplaceModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleReplace} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select New Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleReplaceFileChange}
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 p-2"
                                    required
                                />
                                <p className="mt-1 text-sm text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                            </div>

                            {replacePreview && (
                                <div className="relative">
                                    <img
                                        src={replacePreview}
                                        alt="Preview"
                                        className="w-full max-h-64 object-contain rounded-lg border-2 border-gray-200"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Caption
                                </label>
                                <input
                                    type="text"
                                    value={replaceModal.caption}
                                    onChange={(e) => setReplaceModal({ ...replaceModal, caption: e.target.value })}
                                    placeholder="Enter image caption..."
                                    className="input-field"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={closeReplaceModal}
                                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading || !replaceFile}
                                    className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {uploading ? 'Replacing...' : 'Replace Image'}
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
