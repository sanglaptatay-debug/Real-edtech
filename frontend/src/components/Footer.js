'use client';
import Link from 'next/link';
import { useContact } from '../contexts/ContactContext';

export default function Footer() {
    const { contactInfo } = useContact();

    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">Bengal Education Ventures</h3>
                        <p className="text-gray-300 mb-4">
                            {contactInfo.tagline}
                        </p>
                        {contactInfo.organization && (
                            <p className="text-sm text-gray-400">
                                A Programme of {contactInfo.organization}
                            </p>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="/" className="hover:text-primary-400">Home</a></li>
                            <li><a href="/about" className="hover:text-primary-400">About Us</a></li>
                            <li><a href="/projects" className="hover:text-primary-400">Projects</a></li>
                            <li><a href="/gallery" className="hover:text-primary-400">Gallery</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contact</h4>
                        <p className="text-sm mb-2">Email: {contactInfo.email}</p>
                        <p className="text-sm">{contactInfo.tagline}</p>
                        {contactInfo.phone && <p className="text-sm mt-2">Phone: {contactInfo.phone}</p>}
                        {contactInfo.address && <p className="text-sm mt-1">{contactInfo.address}</p>}
                    </div>
                </div>
            </div>
        </footer>
    );
}
