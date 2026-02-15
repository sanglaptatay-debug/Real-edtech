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
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={`bg-gradient-to-r ${getCategoryColor(course.category)} p-6 text-white`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-xs font-semibold bg-white bg-opacity-30 px-3 py-1 rounded-full">
                                {course.category}
                            </span>
                            <h2 className="text-3xl font-bold mt-3">{course.title}</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Course Summary</h3>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{course.summary}</p>
                    </div>

                    {course.googleFormLink && (
                        <div className="pt-4">
                            <a
                                href={course.googleFormLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-primary w-full text-center block"
                            >
                                Get Started - Enroll Now
                            </a>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                        <a href={`/courses/${course._id}`} className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                            View Full Course Details →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
