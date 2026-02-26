'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { coursesAPI, liveSessionsAPI, resourcesAPI } from '../../../utils/api';
import { getUser, isAuthenticated, isEnrolledInCourse } from '../../../utils/auth';

export default function CourseDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [course, setCourse] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [enrolling, setEnrolling] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            const userData = getUser();
            setUser(userData);
        }
        fetchCourseData();
    }, [params.id]);

    useEffect(() => {
        if (course && user) {
            setIsEnrolled(isEnrolledInCourse(course._id));
        }
    }, [course, user]);

    const handleEnroll = async () => {
        if (!isAuthenticated()) {
            // Store current path to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
            router.push('/login');
            return;
        }

        setEnrolling(true);
        try {
            const response = await coursesAPI.enroll(params.id);
            // Update local user data
            const userData = { ...user, enrolledCourses: response.data.enrolledCourses };
            setUser(userData);

            // Also update the stored user in localStorage
            import('../../../utils/auth').then(({ setUser: saveUser }) => {
                saveUser(userData);
            });

            setIsEnrolled(true);
            alert('Successfully enrolled in the course!');
        } catch (error) {
            console.error('Enrollment error:', error);
            alert(error.response?.data?.error || 'Failed to enroll in the course. Please try again.');
        } finally {
            setEnrolling(false);
        }
    };

    const fetchCourseData = async () => {
        try {
            const courseResponse = await coursesAPI.getById(params.id);
            setCourse(courseResponse.data);

            const sessionsResponse = await liveSessionsAPI.getByCourse(params.id);
            setSessions(sessionsResponse.data);

            if (isAuthenticated()) {
                try {
                    const resourcesResponse = await resourcesAPI.getByCourse(params.id);
                    setResources(resourcesResponse.data);
                } catch (error) {
                    console.log('Cannot access resources:', error);
                }
            }
        } catch (error) {
            console.error('Error fetching course data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading course details...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!course) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Course Not Found</h1>
                        <a href="/" className="text-primary-600 hover:text-primary-700 font-medium">Return to Home</a>
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
                {/* Course Header */}
                <section className="relative">
                    {course.image ? (
                        <div className="relative h-[400px] w-full">
                            <img
                                src={course.image.startsWith('http') || course.image.startsWith('data:') ? course.image : `http://localhost:5000${course.image}`}
                                alt={course.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="max-w-4xl w-full px-4 text-center">
                                    <span className="inline-block bg-primary-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg">
                                        {course.category}
                                    </span>
                                    <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">{course.title}</h1>
                                    <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto drop-shadow-md leading-relaxed mb-8">{course.summary}</p>
                                    {!isEnrolled && (
                                        <button
                                            onClick={handleEnroll}
                                            disabled={enrolling}
                                            className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-full shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                                        >
                                            {enrolling ? 'Enrolling...' : 'Enroll Now to Join Live Sessions'}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="gradient-bg text-white py-20 px-4">
                            <div className="max-w-4xl mx-auto text-center">
                                <span className="inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
                                    {course.category}
                                </span>
                                <h1 className="text-5xl font-bold mb-4">{course.title}</h1>
                                <p className="text-xl text-blue-100 mb-8">{course.summary}</p>
                                {!isEnrolled && (
                                    <button
                                        onClick={handleEnroll}
                                        disabled={enrolling}
                                        className="inline-block bg-white text-primary-600 font-bold px-8 py-4 rounded-full shadow-xl hover:bg-gray-50 transition-all transform hover:-translate-y-1 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                                    >
                                        {enrolling ? 'Enrolling...' : 'Enroll Now to Join Live Sessions'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </section>

                <div className="max-w-4xl mx-auto px-4 py-12">
                    {/* Enrollment Status */}
                    {isEnrolled && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
                            <p className="text-green-700 font-medium">✓ You are enrolled in this course</p>
                        </div>
                    )}

                    {/* Live Sessions Schedule */}
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Live Class Schedule</h2>
                        {sessions.length > 0 ? (
                            <div className="space-y-4">
                                {sessions.map((session) => (
                                    <div key={session._id} className="card">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{session.sessionTitle}</h3>
                                                <p className="text-gray-600">
                                                    {new Date(session.scheduledTime).toLocaleString('en-IN', {
                                                        dateStyle: 'full',
                                                        timeStyle: 'short'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                        {isEnrolled && session.gmeetLink ? (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <button
                                                    onClick={() => router.push(`/courses/${params.id}/live-session/${session._id}`)}
                                                    className="btn-primary inline-block"
                                                >
                                                    Join Live Session
                                                </button>
                                            </div>
                                        ) : !isEnrolled ? (
                                            <div className="mt-4 pt-4 border-t border-gray-200">
                                                <button
                                                    onClick={handleEnroll}
                                                    disabled={enrolling}
                                                    className="btn-primary inline-block text-center cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                                                >
                                                    {enrolling ? 'Enrolling...' : 'Enroll to Join'}
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">No live sessions scheduled yet.</p>
                        )}
                    </section>

                    {/* Resources - Only for Enrolled Students */}
                    {isEnrolled && (
                        <section className="mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Course Resources</h2>
                            {resources.length > 0 ? (
                                <div className="space-y-3">
                                    {resources.map((resource) => (
                                        <a
                                            key={resource._id}
                                            href={resource.resourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block card hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{resource.resourceName}</h3>
                                                    <p className="text-sm text-primary-600">Click to download →</p>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600">No resources available yet.</p>
                            )}
                        </section>
                    )}

                    {/* Enrollment CTA */}
                    {!isEnrolled && (
                        <section className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 text-center mt-12 mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
                            <p className="text-gray-700 mb-6">Enroll now to access live sessions and course materials</p>
                            <button
                                onClick={handleEnroll}
                                disabled={enrolling}
                                className="btn-primary inline-block cursor-pointer disabled:opacity-75 disabled:cursor-wait"
                            >
                                {enrolling ? 'Enrolling...' : 'Enroll in This Course'}
                            </button>
                        </section>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
