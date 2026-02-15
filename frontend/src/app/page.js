'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CourseTile from '../components/CourseTile';
import CourseModal from '../components/CourseModal';
import { coursesAPI } from '../utils/api';
import { isAuthenticated } from '../utils/auth';

import { useTheme } from '../context/ThemeContext';

export default function Home() {
    const router = useRouter();
    const { fullSettings } = useTheme();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isAuthChecking, setIsAuthChecking] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            if (!isAuthenticated()) {
                router.push('/login');
            } else {
                setIsAuthChecking(false);
                fetchCourses();
            }
        };
        checkAuth();
    }, [router]);

    const fetchCourses = async () => {
        try {
            const response = await coursesAPI.getAll();
            setCourses(response.data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCourseClick = (course) => {
        setSelectedCourse(course);
        setModalOpen(true);
    };

    if (isAuthChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                {/* Hero Section */}
                <section className="gradient-bg text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <p className="text-blue-200 mb-4 text-sm uppercase tracking-wide animate-fade-in">A Programme of BIOROBODRAI</p>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Empowering Bengal's Future
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto animate-fade-in">
                            Live, cohort-based learning in AI, Drone Technology, and 3D Printing
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                            <a href="#courses" className="btn-primary bg-white text-primary-600 hover:bg-gray-100 border border-transparent">
                                Explore Courses
                            </a>
                            <a href="/about" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                                Learn More
                            </a>
                        </div>
                    </div>
                </section>

                {/* Courses Section */}
                <section id="courses" className="py-16 px-4 transition-colors duration-300">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Courses</h2>
                            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Choose from our cutting-edge courses designed for the future of technology
                            </p>
                        </div>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading courses...</p>
                            </div>
                        ) : courses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <CourseTile
                                        key={course._id}
                                        course={course}
                                        onClick={() => handleCourseClick(course)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-600 dark:text-gray-400 text-lg">No courses available at the moment.</p>
                                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Check back soon for exciting new courses!</p>
                                {/* Debug info - remove in production if not needed */}
                                <p className="text-xs text-gray-400 mt-4">Debug: Courses fetched: {courses ? courses.length : 'undefined'}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Vision Section */}
                <section className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-16 px-4 transition-colors duration-300">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 transition-colors duration-300">
                            <svg className="w-16 h-16 text-primary-600 dark:text-primary-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Vision</h2>
                            <div
                                className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-wrap text-left"
                                dangerouslySetInnerHTML={{ __html: fullSettings?.siteContent?.visionText || "We are empowering the youth of Bengal. We are charging a minimal amount to ensure the sustainability and continuity of our operations." }}
                            />
                            <a href="/about" className="btn-primary">
                                Learn About Us
                            </a>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
            <CourseModal
                course={selectedCourse}
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}
