'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTheme } from '../../context/ThemeContext';
import { servicesAPI } from '../../utils/api';

export default function AboutPage() {
    const { fullSettings } = useTheme();
    const [services, setServices] = useState([]);
    const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await servicesAPI.getAll();
            setServices(response.data);
        } catch (error) {
            console.error('Error fetching services:', error);
        }
    };

    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="gradient-bg text-white py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-blue-200 mb-3 text-sm uppercase tracking-wide">A Programme of BIOROBODRAI</p>
                        <h1 className="text-5xl font-bold mb-4">About Us</h1>
                        <p className="text-xl text-blue-100">{fullSettings?.siteContent?.aboutSubtitle || "We are empowering the youth of Bengal"}</p>
                    </div>
                </section>

                {/* Vision Statement */}
                <section className="py-16 px-4 bg-white dark:bg-gray-900 transition-colors duration-300">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 md:p-12 border-l-4 border-primary-600 dark:border-primary-500 shadow-sm transition-colors duration-300">
                            <div className="flex justify-center mb-6">
                                {fullSettings?.logoUrl ? (
                                    <img
                                        src={fullSettings.logoUrl.startsWith('data:') ? fullSettings.logoUrl : `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${fullSettings.logoUrl}`}
                                        alt="Logo"
                                        className="h-24 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => setIsLogoModalOpen(true)}
                                    />
                                ) : (
                                    <img
                                        src="/default-logo.jpg"
                                        alt="Bengal Education Ventures"
                                        className="h-24 w-auto object-contain cursor-pointer hover:scale-105 transition-transform"
                                        onClick={() => setIsLogoModalOpen(true)}
                                    />
                                )}
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">Our Vision</h2>
                            <div
                                className="text-2xl text-gray-800 dark:text-gray-200 leading-relaxed text-left font-medium whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: fullSettings?.siteContent?.visionText || "We are empowering the youth of Bengal. We are charging a minimal amount to ensure the sustainability and continuity of our operations." }}
                            />
                        </div>
                    </div>
                </section>

                {/* Mission */}
                <section className="py-16 px-4 dark:bg-gray-950 transition-colors duration-300">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Mission</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {services.filter(s => s.type === 'mission').length > 0 ? (
                                services.filter(s => s.type === 'mission').map((card, index) => {
                                    const colorMap = {
                                        blue: 'bg-blue-500',
                                        green: 'bg-green-500',
                                        purple: 'bg-purple-500',
                                        red: 'bg-red-500',
                                        yellow: 'bg-yellow-500',
                                        indigo: 'bg-indigo-500'
                                    };
                                    return (
                                        <div key={card._id} className="card text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                            <div className={`w-16 h-16 ${colorMap[card.color] || 'bg-blue-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon || (index === 0 ? 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' : index === 1 ? 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' : 'M13 10V3L4 14h7v7l9-11h-7z')} />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                                            <p className="text-gray-600 dark:text-gray-300">{card.description}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                (fullSettings?.siteContent?.missionCards?.length > 0 ? fullSettings.siteContent.missionCards : [
                                    { title: 'Quality Education', description: 'Providing cutting edge, industry-relevant courses in emerging technologies', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                                    { title: 'Community Learning', description: 'Live technical skill based classes fostering collaboration and peer learning', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                                    { title: 'Affordable Access', description: 'Minimal fees to ensure sustainability while remaining accessible to all', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
                                ]).map((card, index) => (
                                    <div key={index} className="card text-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                        <div className={`w-16 h-16 ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : 'bg-purple-500'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={card.icon || (index === 0 ? 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' : index === 1 ? 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' : 'M13 10V3L4 14h7v7l9-11h-7z')} />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300">{card.description}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* What We Offer */}
                <section className="py-16 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">What We Offer</h2>
                        <div className="space-y-6">
                            {services.filter(s => s.type !== 'mission').length > 0 ? (
                                services.filter(s => s.type !== 'mission').map((service) => {
                                    const colorMap = {
                                        blue: '#2563EB',
                                        green: '#059669',
                                        purple: '#7C3AED',
                                        red: '#DC2626',
                                        yellow: '#EAB308',
                                        indigo: '#4F46E5'
                                    };
                                    const borderColorMap = {
                                        blue: '#3B82F6',
                                        green: '#10B981',
                                        purple: '#8B5CF6',
                                        red: '#EF4444',
                                        yellow: '#EAB308',
                                        indigo: '#6366F1'
                                    };
                                    return (
                                        <div key={service._id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 transition-colors duration-300" style={{ borderColor: borderColorMap[service.color] || borderColorMap.indigo }}>
                                            <h3 className={`text-xl font-bold mb-2`} style={{ color: colorMap[service.color] || colorMap.indigo }}>{service.title}</h3>
                                            <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
                                        </div>
                                    );
                                })
                            ) : (
                                <>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-colors duration-300">
                                        <h3 className="text-xl font-bold text-primary-600 mb-2">AI & Machine Learning</h3>
                                        <p className="text-gray-700 dark:text-gray-300">Discover the power of artificial intelligence and learn to build intelligent systems</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-colors duration-300">
                                        <h3 className="text-xl font-bold text-green-600 mb-2">Drone Technology</h3>
                                        <p className="text-gray-700 dark:text-gray-300">Master drone operations, programming, and real-world applications</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md transition-colors duration-300">
                                        <h3 className="text-xl font-bold text-purple-600 mb-2">3D Printing</h3>
                                        <p className="text-gray-700 dark:text-gray-300">Learn additive manufacturing, design, and prototyping techniques</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />

            {/* Logo Modal */}
            {isLogoModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-4 animate-fadeIn"
                    onClick={() => setIsLogoModalOpen(false)}
                >
                    <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        <button
                            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
                            onClick={() => setIsLogoModalOpen(false)}
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        {fullSettings?.logoUrl ? (
                            <img
                                src={fullSettings.logoUrl.startsWith('data:') ? fullSettings.logoUrl : `${process.env.NEXT_PUBLIC_API_URL.replace('/api', '')}${fullSettings.logoUrl}`}
                                alt="Logo Full Screen"
                                className="max-w-full max-h-full object-contain"
                                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                            />
                        ) : (
                            <img
                                src="/default-logo.jpg"
                                alt="Bengal Education Ventures"
                                className="max-w-full max-h-full object-contain"
                                onClick={(e) => e.stopPropagation()}
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
