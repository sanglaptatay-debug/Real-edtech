'use client';

export default function CourseTile({ course, onClick }) {
    const getCategoryStyles = (category) => {
        switch (category) {
            case 'AI':
                return {
                    bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800',
                    border: 'border-blue-300 dark:border-blue-700',
                    icon: 'bg-blue-500 dark:bg-blue-600',
                    hover: 'hover:shadow-blue-200 dark:hover:shadow-none',
                };
            case 'Drone Technology':
                return {
                    bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800',
                    border: 'border-green-300 dark:border-green-700',
                    icon: 'bg-green-500 dark:bg-green-600',
                    hover: 'hover:shadow-green-200 dark:hover:shadow-none',
                };
            case '3D Printing':
                return {
                    bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800',
                    border: 'border-purple-300 dark:border-purple-700',
                    icon: 'bg-purple-500 dark:bg-purple-600',
                    hover: 'hover:shadow-purple-200 dark:hover:shadow-none',
                };
            default:
                return {
                    bg: 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700',
                    border: 'border-gray-300 dark:border-gray-600',
                    icon: 'bg-gray-500 dark:bg-gray-600',
                    hover: 'hover:shadow-gray-200 dark:hover:shadow-none',
                };
        }
    };

    const styles = getCategoryStyles(course.category);

    return (
        <div
            onClick={onClick}
            className={`${styles.bg} border-2 ${styles.border} rounded-xl p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${styles.hover} animate-fade-in`}
        >
            <div className="flex items-start space-x-4">
                <div className={`${styles.icon} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{course.title}</h3>
                    <p className="text-gray-600 dark:text-gray-200 text-sm mb-3 line-clamp-2">{course.summary}</p>
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase">{course.category}</span>
                        <span className="text-primary-600 dark:text-white font-medium text-sm hover:underline">Learn More →</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
