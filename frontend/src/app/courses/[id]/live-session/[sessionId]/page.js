'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../../../components/Navbar';
import Footer from '../../../../../components/Footer';
import { liveSessionsAPI } from '../../../../../utils/api';
import { isAuthenticated } from '../../../../../utils/auth';

export default function LiveSessionPage() {
    const params = useParams();
    const router = useRouter();
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [iframeError, setIframeError] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        fetchSessionData();
    }, [params.sessionId]);

    const fetchSessionData = async () => {
        try {
            const response = await liveSessionsAPI.getById(params.sessionId);
            setSession(response.data);
        } catch (error) {
            console.error('Error fetching session data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading live session...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!session) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Session Not Found</h1>
                        <button onClick={() => router.back()} className="text-primary-600 hover:text-primary-700 font-medium">Go Back</button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-8">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Header Controls */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{session.sessionTitle}</h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Scheduled: {new Date(session.scheduledTime).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' })}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push(`/courses/${params.id}`)}
                            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
                        >
                            Return to Course
                        </button>
                    </div>

                    {/* Google Meet Iframe Container */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {iframeError ? (
                            <div className="p-12 text-center h-[700px] flex flex-col justify-center items-center">
                                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Display Blocked by Google Meet</h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                                    Google Meet sometimes restricts embedding for certain domains or ad-blockers. You can still join the class directly.
                                </p>
                                <a
                                    href={session.gmeetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                >
                                    Open Google Meet in New Tab
                                </a>
                            </div>
                        ) : (
                            <div className="relative w-full h-[700px] bg-gray-900 rounded-lg overflow-hidden">
                                <iframe
                                    src={session.gmeetLink}
                                    title={`Live Session: ${session.sessionTitle}`}
                                    className="w-full h-full border-0"
                                    allow="camera; microphone; fullscreen; speaker; display-capture"
                                    allowFullScreen
                                    onError={() => setIframeError(true)}
                                ></iframe>
                            </div>
                        )}
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>Having trouble with the video? <a href={session.gmeetLink} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">Open in a new tab</a></span>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
