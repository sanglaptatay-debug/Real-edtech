'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { coursesAPI } from '../../utils/api';

export default function CoursesPage() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await coursesAPI.getAll();
                setCourses(res.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, []);

    const filtered = courses.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.category?.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

                {/* Header */}
                <section className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-16 px-4 text-center shadow-lg">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">Our Courses</h1>
                    <p className="text-primary-100 text-lg max-w-xl mx-auto mb-8">
                        Cutting-edge programmes in AI, Drone Technology, 3D Printing, Bio Technology and more.
                    </p>
                    {/* Search */}
                    <div className="max-w-md mx-auto relative">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search courses..."
                            className="w-full px-5 py-3 rounded-full text-gray-900 dark:text-white bg-white dark:bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-white pr-12"
                        />
                        <svg className="w-5 h-5 absolute right-4 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </section>

                {/* Course Grid */}
                <section className="py-14 px-4">
                    <div className="max-w-7xl mx-auto">

                        {loading ? (
                            <div className="flex justify-center py-24">
                                <div className="animate-spin rounded-full h-14 w-14 border-4 border-primary-500 border-t-transparent"></div>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="text-center py-24 text-gray-500 dark:text-gray-400">
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                                <p className="text-lg font-medium">No courses found</p>
                                {search && <p className="text-sm mt-1">Try a different search term.</p>}
                            </div>
                        ) : (
                            <>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Showing {filtered.length} course{filtered.length !== 1 ? 's' : ''}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filtered.map(course => (
                                        <Link
                                            key={course._id}
                                            href={`/courses/${course._id}`}
                                            className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 flex flex-col"
                                        >
                                            {/* Thumbnail / Colour Banner */}
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-44 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-5xl group-hover:from-primary-600 transition-colors duration-300">
                                                    🎓
                                                </div>
                                            )}

                                            <div className="p-6 flex flex-col flex-1">
                                                {/* Category badge */}
                                                {course.category && (
                                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full mb-3 w-fit">
                                                        {course.category}
                                                    </span>
                                                )}

                                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                                    {course.title}
                                                </h2>

                                                <p className="text-gray-500 dark:text-gray-400 text-sm flex-1 line-clamp-3 mb-4">
                                                    {course.description || 'Click to learn more about this course.'}
                                                </p>

                                                {/* Meta row */}
                                                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                                    <span className="flex items-center gap-1">
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        {course.duration || 'Self-paced'}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium group-hover:underline">
                                                        View Details →
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
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
