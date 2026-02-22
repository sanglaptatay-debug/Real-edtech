'use client';
import { useEffect, useState, useRef } from 'react';

const WARNING_SECONDS = 60; // must match WARNING_BEFORE / 1000 in the hook

export default function InactivityWarning({ isVisible, onStayLoggedIn, onLogOutNow }) {
    const [secondsLeft, setSecondsLeft] = useState(WARNING_SECONDS);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isVisible) {
            setSecondsLeft(WARNING_SECONDS);
            clearInterval(intervalRef.current);
            return;
        }

        setSecondsLeft(WARNING_SECONDS);
        intervalRef.current = setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(intervalRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(intervalRef.current);
    }, [isVisible]);

    if (!isVisible) return null;

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    const timeStr = minutes > 0
        ? `${minutes}:${String(seconds).padStart(2, '0')}`
        : `${seconds}s`;

    // Progress ring
    const radius = 32;
    const circ = 2 * Math.PI * radius;
    const progress = (secondsLeft / WARNING_SECONDS) * circ;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="inactivity-title"
                aria-describedby="inactivity-desc"
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center animate-fadeIn">
                    {/* Countdown ring */}
                    <div className="flex justify-center mb-5">
                        <div className="relative w-20 h-20">
                            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                                {/* Background track */}
                                <circle
                                    cx="40" cy="40" r={radius}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    className="text-gray-200 dark:text-gray-700"
                                />
                                {/* Progress arc */}
                                <circle
                                    cx="40" cy="40" r={radius}
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="6"
                                    strokeDasharray={circ}
                                    strokeDashoffset={circ - progress}
                                    strokeLinecap="round"
                                    className={`transition-all duration-1000 ${secondsLeft <= 10
                                            ? 'text-red-500'
                                            : secondsLeft <= 30
                                                ? 'text-amber-500'
                                                : 'text-blue-500'
                                        }`}
                                />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-800 dark:text-white">
                                {timeStr}
                            </span>
                        </div>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 rounded-full flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>

                    <h2
                        id="inactivity-title"
                        className="text-xl font-bold text-gray-900 dark:text-white mb-2"
                    >
                        Session Expiring Soon
                    </h2>
                    <p
                        id="inactivity-desc"
                        className="text-sm text-gray-500 dark:text-gray-400 mb-6"
                    >
                        You&apos;ve been inactive for a while. You will be automatically
                        logged out in{' '}
                        <span className={`font-semibold ${secondsLeft <= 10 ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                            {timeStr}
                        </span>.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={onStayLoggedIn}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Stay Logged In
                        </button>
                        <button
                            onClick={onLogOutNow}
                            className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                        >
                            Log Out Now
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
