'use client';

export default function CourseModal({ course, isOpen, onClose }) {
    if (!isOpen || !course) return null;

    const getCategoryColor = (category) => {
        switch (category) {
            case 'AI':
                return 'from-blue-500 to-blue-700';
            case 'Drone Technology':
                return 'from-green-500 to-green-700';
            case '3D Printing':
                return 'from-purple-500 to-purple-700';
            default:
                return 'from-gray-500 to-gray-700';
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header/Image */}
                <div className="relative">
                    {course.image ? (
                        <div className="h-64 w-full relative">
                            <img
                                src={course.image.startsWith('http') || course.image.startsWith('data:') ? course.image : `http://localhost:5000${course.image}`}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="inline-block bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-3 shadow-sm">
                                    {course.category}
                                </span>
                                <h2 className="text-3xl font-bold text-white shadow-sm leading-tight">{course.title}</h2>
                            </div>
                        </div>
                    ) : (
                        <div className={`bg-gradient-to-r ${getCategoryColor(course.category)} p-8 text-white h-48 flex flex-col justify-end`}>
                            <div>
                                <span className="inline-block bg-white bg-opacity-20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold mb-3">
                                    {course.category}
                                </span>
                                <h2 className="text-3xl font-bold leading-tight">{course.title}</h2>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-black bg-opacity-30 hover:bg-opacity-50 text-white rounded-full p-2 transition-all backdrop-blur-sm z-10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Course Summary</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">{course.summary}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        {course.googleFormLink && (
                            <a
                                href={course.googleFormLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary flex-1 text-center justify-center py-3 text-base shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                            >
                                Enroll Now
                            </a>
                        )}
                        <a
                            href={`/courses/${course._id}`}
                            className="btn-secondary flex-1 text-center justify-center py-3 text-base border-2"
                        >
                            View Full Details
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
