'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CourseTile from '../../components/CourseTile';
import { coursesAPI } from '../../utils/api';

export default function CoursesPage() {
    const router = useRouter();
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
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filtered.map(course => (
                                        <CourseTile
                                            key={course._id}
                                            course={course}
                                            onClick={() => router.push(`/courses/${course._id}`)}
                                        />
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
