'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAdmin } from '../utils/auth';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
    const router = useRouter();
    const { theme, toggleTheme, logoUrl } = useTheme();
    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            const userData = localStorage.getItem('user');
            if (token && userData) {
                setUser(JSON.parse(userData));
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/');
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Link href="/">
                            {logoUrl ? (
                                <img
                                    src={logoUrl.startsWith('data:') ? logoUrl : `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${logoUrl}`}
                                    alt="Logo"
                                    className="h-10 w-auto object-contain cursor-pointer"
                                />
                            ) : (
                                <img
                                    src="/default-logo.jpg"
                                    alt="Bengal Education Ventures"
                                    className="h-10 w-auto object-contain cursor-pointer"
                                />
                            )}
                        </Link>
                        <Link href="/">
                            <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block cursor-pointer">Bengal Education Ventures</span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Home</Link>
                        <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">About</Link>
                        <Link href="/projects" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Projects</Link>
                        <Link href="/gallery" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Gallery</Link>
                    </div>

                    {/* Right Side: Theme Toggle & Auth */}
                    <div className="hidden md:flex items-center space-x-4">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {mounted && theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        {user ? (
                            <>
                                {mounted && isAdmin() ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                                            className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                                        >
                                            <span>Hi, {user.fullName}</span>
                                            <span className="px-2 py-1 bg-accent-500 text-white text-xs rounded-full">Admin</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {adminDropdownOpen && (
                                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                                                <Link href="/admin/sessions" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setAdminDropdownOpen(false)}>📅 Manage Sessions</Link>
                                                <Link href="/admin/courses" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setAdminDropdownOpen(false)}>📚 Manage Courses</Link>
                                                <Link href="/admin/users" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setAdminDropdownOpen(false)}>👥 Manage Admins</Link>
                                                <Link href="/admin/students" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setAdminDropdownOpen(false)}>🎓 Manage Students</Link>
                                                <Link href="/admin/resources" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setAdminDropdownOpen(false)}>📂 Manage Resources</Link>
                                                <Link href="/admin/videos" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setAdminDropdownOpen(false)}>🎬 Manage Videos</Link>
                                                <Link href="/admin/web-projects" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setAdminDropdownOpen(false)}>🌐 Manage Web Projects</Link>
                                                <Link href="/admin/contact" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700" onClick={() => setAdminDropdownOpen(false)}>⚙️ Site Settings</Link>
                                                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                                                <button onClick={() => { handleLogout(); setAdminDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700">🚪 Logout</button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <span className="text-sm text-gray-600 dark:text-gray-300">Hi, {user.fullName}</span>
                                        <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium">Login</Link>
                                <Link href="/register" className="btn-primary text-sm">Get Started</Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                        >
                            {mounted && theme === 'dark' ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                            )}
                        </button>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <div className="px-4 pt-2 pb-4 space-y-3">
                        <Link href="/" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">Home</Link>
                        <Link href="/about" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">About</Link>
                        <Link href="/projects" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">Projects</Link>
                        <Link href="/gallery" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">Gallery</Link>
                        {user ? (
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {user.fullName}
                                    {isAdmin() && <span className="ml-2 px-2 py-1 bg-accent-500 text-white text-xs rounded-full">Admin</span>}
                                </p>
                                {isAdmin() && (
                                    <>
                                        <Link href="/admin/courses" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">📚 Manage Courses</Link>
                                        <Link href="/admin/sessions" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">📅 Manage Sessions</Link>
                                        <Link href="/admin/contact" className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600">⚙️ Site Settings</Link>
                                    </>
                                )}
                                <button onClick={handleLogout} className="btn-secondary w-full text-sm mt-2">Logout</button>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                <Link href="/login" className="btn-secondary text-sm text-center">Login</Link>
                                <Link href="/register" className="btn-primary text-sm text-center">Get Started</Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
