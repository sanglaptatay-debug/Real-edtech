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
            className={`bg-white dark:bg-gray-800 border-2 ${styles.border} rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl ${styles.hover} animate-fade-in flex flex-col h-full`}
        >
            {course.image ? (
                <div className="h-48 w-full relative overflow-hidden">
                    <img
                        src={course.image.startsWith('http') || course.image.startsWith('data:') ? course.image : `http://localhost:5000${course.image}`}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                    <div className="absolute top-2 right-2">
                        <span className="text-xs font-bold bg-white dark:bg-gray-900 bg-opacity-90 px-3 py-1 rounded-full shadow-md text-gray-800 dark:text-gray-100">
                            {course.category}
                        </span>
                    </div>
                </div>
            ) : (
                <div className={`${styles.bg} h-48 w-full flex items-center justify-center p-6 relative`}>
                    <div className={`${styles.icon} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg`}>
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div className="absolute top-4 right-4">
                        <span className={`text-xs font-bold bg-white bg-opacity-60 px-3 py-1 rounded-full shadow-sm`}>
                            {course.category}
                        </span>
                    </div>
                </div>
            )}

            <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-1">{course.summary}</p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-primary-600 dark:text-primary-400 font-medium text-sm flex items-center group-hover:underline">
                        Learn More
                        <svg className="w-4 h-4 ml-1 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </span>
                </div>
            </div>
        </div>
    );
}
