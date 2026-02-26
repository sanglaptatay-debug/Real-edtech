'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { coursesAPI, liveSessionsAPI } from '../../utils/api';
import { getUser, isAuthenticated, isAdmin } from '../../utils/auth';

export default function MyCoursesPage() {
    const router = useRouter();
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedCourse, setExpandedCourse] = useState(null);
    const [sessionsByCourse, setSessionsByCourse] = useState({});
    const [loadingSessions, setLoadingSessions] = useState({});

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        if (isAdmin()) {
            router.push('/');
            return;
        }
        loadEnrolledCourses();
    }, []);

    const loadEnrolledCourses = async () => {
        try {
            const user = getUser();
            if (!user || !user.enrolledCourses || user.enrolledCourses.length === 0) {
                setEnrolledCourses([]);
                setLoading(false);
                return;
            }

            // Get all courses and filter by enrollment
            const res = await coursesAPI.getAll();
            const allCourses = res.data;

            // Match enrolled course IDs with full course data
            const enrolledIds = user.enrolledCourses
                .filter(e => e.flag === 'Y')
                .map(e => {
                    const id = e.courseId?._id || e.courseId;
                    return typeof id === 'string' ? id : id?.toString();
                });

            const myCourses = allCourses.filter(c => enrolledIds.includes(c._id));
            setEnrolledCourses(myCourses);
        } catch (error) {
            console.error('Error loading enrolled courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleCourse = async (courseId) => {
        if (expandedCourse === courseId) {
            setExpandedCourse(null);
            return;
        }
        setExpandedCourse(courseId);

        // Load sessions for this course if not already loaded
        if (!sessionsByCourse[courseId]) {
            setLoadingSessions(prev => ({ ...prev, [courseId]: true }));
            try {
                const res = await liveSessionsAPI.getByCourse(courseId);
                setSessionsByCourse(prev => ({ ...prev, [courseId]: res.data }));
            } catch (error) {
                console.error('Error loading sessions:', error);
                setSessionsByCourse(prev => ({ ...prev, [courseId]: [] }));
            } finally {
                setLoadingSessions(prev => ({ ...prev, [courseId]: false }));
            }
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your courses...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Header */}
                <section className="bg-gradient-to-r from-primary-600 to-indigo-700 text-white py-16 px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-4xl">🎓</span>
                            <h1 className="text-4xl font-bold">My Courses</h1>
                        </div>
                        <p className="text-blue-100 text-lg">Your enrolled courses and live class schedule</p>
                    </div>
                </section>

                {/* Content */}
                <section className="py-12 px-4">
                    <div className="max-w-5xl mx-auto">
                        {enrolledCourses.length === 0 ? (
                            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
                                <div className="text-6xl mb-4">📚</div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No courses yet</h2>
                                <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't enrolled in any courses yet. Browse our courses below!</p>
                                <Link href="/courses" className="btn-primary inline-block">
                                    Browse Courses
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {enrolledCourses.map((course) => {
                                    const isExpanded = expandedCourse === course._id;
                                    const sessions = sessionsByCourse[course._id] || [];

                                    return (
                                        <div
                                            key={course._id}
                                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden"
                                        >
                                            {/* Course Header */}
                                            <div
                                                className="flex items-center gap-4 p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                                                onClick={() => toggleCourse(course._id)}
                                            >
                                                {course.image && (
                                                    <img
                                                        src={course.image.startsWith('http') || course.image.startsWith('data:') ? course.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'}${course.image}`}
                                                        alt={course.title}
                                                        className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                                                    />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <span className="inline-block bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300 text-xs font-semibold px-3 py-1 rounded-full mb-2">
                                                        {course.category}
                                                    </span>
                                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">{course.title}</h2>
                                                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">{course.summary}</p>
                                                </div>
                                                <div className="flex items-center gap-3 flex-shrink-0">
                                                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold px-3 py-1 rounded-full">
                                                        ✓ Enrolled
                                                    </span>
                                                    <svg
                                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>

                                            {/* Expanded: Live Sessions */}
                                            {isExpanded && (
                                                <div className="border-t border-gray-100 dark:border-gray-700 px-6 pb-6 pt-5">
                                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                                                        <span>📅</span> Live Class Schedule
                                                    </h3>

                                                    {loadingSessions[course._id] ? (
                                                        <div className="flex items-center gap-2 text-gray-500 py-4">
                                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-600 border-t-transparent"></div>
                                                            <span>Loading sessions...</span>
                                                        </div>
                                                    ) : sessions.length === 0 ? (
                                                        <p className="text-gray-400 dark:text-gray-500 italic">No live sessions scheduled yet.</p>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {sessions.map((session) => {
                                                                const sessionTime = new Date(session.scheduledTime);
                                                                const isUpcoming = sessionTime > new Date();
                                                                return (
                                                                    <div
                                                                        key={session._id}
                                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 hover:border-primary-200 dark:hover:border-primary-700 transition-colors"
                                                                    >
                                                                        <div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className={`w-2 h-2 rounded-full ${isUpcoming ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                                                <h4 className="font-semibold text-gray-900 dark:text-white">{session.sessionTitle}</h4>
                                                                                {isUpcoming && (
                                                                                    <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">Upcoming</span>
                                                                                )}
                                                                            </div>
                                                                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-4">
                                                                                {sessionTime.toLocaleString('en-IN', {
                                                                                    dateStyle: 'full',
                                                                                    timeStyle: 'short'
                                                                                })}
                                                                            </p>
                                                                        </div>
                                                                        {session.gmeetLink && (
                                                                            <button
                                                                                onClick={() => router.push(`/courses/${course._id}/live-session/${session._id}`)}
                                                                                className="btn-primary text-sm whitespace-nowrap flex-shrink-0 flex items-center gap-2"
                                                                            >
                                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.869v6.262a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                                                                                </svg>
                                                                                Join Live Session
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    <div className="mt-4">
                                                        <Link
                                                            href={`/courses/${course._id}`}
                                                            className="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline"
                                                        >
                                                            View full course details →
                                                        </Link>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
