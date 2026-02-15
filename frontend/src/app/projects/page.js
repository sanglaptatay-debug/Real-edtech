'use client';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import { projectVideosAPI, webProjectsAPI } from '../../utils/api';

export default function ProjectsPage() {
    const [projectVideos, setProjectVideos] = useState([]);
    const [webProjects, setWebProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [videosRes, webRes] = await Promise.all([
                projectVideosAPI.getAll(),
                webProjectsAPI.getAll()
            ]);
            setProjectVideos(videosRes.data);
            setWebProjects(webRes.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
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
                        <h1 className="text-5xl font-bold mb-4">Our Projects</h1>
                        <p className="text-xl text-blue-100">Showcasing student achievements and innovations</p>
                    </div>
                </section>

                {/* Video Gallery */}
                <section className="py-16 px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Project Videos</h2>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                        ) : projectVideos.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No project videos available yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {projectVideos.map((project, index) => (
                                    <div key={index} className="card">
                                        <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                                            <iframe
                                                className="w-full h-full"
                                                src={project.embedUrl}
                                                title={project.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                                        <p className="text-gray-600">{project.description}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Website Projects */}
                <section className="py-16 px-4 bg-gray-50">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl font-bold text-gray-900 mb-8 text-center">Web Projects</h2>

                        {loading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
                            </div>
                        ) : webProjects.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">No web projects added yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {webProjects.map((project, index) => (
                                    <div key={project._id || index} className="card hover:scale-105 transform transition-all duration-300 flex flex-col h-full">
                                        <div className="flex items-center space-x-3 mb-3">
                                            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 line-clamp-1" title={project.title}>{project.title}</h3>
                                        </div>
                                        <p className="text-gray-600 mb-4 flex-grow">{project.description}</p>

                                        <div className="flex flex-col space-y-2 mt-auto pt-4 border-t border-gray-100">
                                            {project.links && project.links.map((link, i) => (
                                                <a
                                                    key={i}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-primary-600 font-medium text-sm hover:text-primary-800 transition-colors group"
                                                >
                                                    <span className="mr-2">
                                                        {link.label.toLowerCase().includes('github') ? (
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                                        ) : (
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                                        )}
                                                    </span>
                                                    {link.label}
                                                    <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                                </a>
                                            ))}
                                            {(!project.links || project.links.length === 0) && (
                                                <span className="text-gray-400 text-sm">No links available</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main >
            <Footer />
        </>
    );
}
