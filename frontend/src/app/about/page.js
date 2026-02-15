import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AboutPage() {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="gradient-bg text-white py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-blue-200 mb-3 text-sm uppercase tracking-wide">A Programme of BIOROBODRAI</p>
                        <h1 className="text-5xl font-bold mb-4">About Us</h1>
                        <p className="text-xl text-blue-100">Empowering the future of Bengal, one student at a time</p>
                    </div>
                </section>

                {/* Vision Statement */}
                <section className="py-16 px-4 bg-white">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 md:p-12 border-l-4 border-primary-600">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Vision</h2>
                            <p className="text-2xl text-gray-800 leading-relaxed text-center font-medium">
                                "Empowering the youth of Bengal for the upcoming future. We are charging a minimal amount to ensure the sustainability and continuity of our operations."
                            </p>
                        </div>
                    </div>
                </section>

                {/* Mission */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Mission</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="card text-center">
                                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Education</h3>
                                <p className="text-gray-600">Providing cutting-edge, industry-relevant courses in emerging technologies</p>
                            </div>

                            <div className="card text-center">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Community Learning</h3>
                                <p className="text-gray-600">Live cohort-based classes fostering collaboration and peer learning</p>
                            </div>

                            <div className="card text-center">
                                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Affordable Access</h3>
                                <p className="text-gray-600">Minimal fees to ensure sustainability while remaining accessible to all</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What We Offer */}
                <section className="py-16 px-4 bg-gray-50">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">What We Offer</h2>
                        <div className="space-y-6">
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-primary-600 mb-2">AI & Machine Learning</h3>
                                <p className="text-gray-700">Discover the power of artificial intelligence and learn to build intelligent systems</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-green-600 mb-2">Drone Technology</h3>
                                <p className="text-gray-700">Master drone operations, programming, and real-world applications</p>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-purple-600 mb-2">3D Printing</h3>
                                <p className="text-gray-700">Learn additive manufacturing, design, and prototyping techniques</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
