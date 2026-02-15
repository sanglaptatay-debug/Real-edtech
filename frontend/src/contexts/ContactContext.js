'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI } from '../utils/api';

const ContactContext = createContext();

export function ContactProvider({ children }) {
    const [contactInfo, setContactInfo] = useState({
        email: 'info@bengaledu.com',
        tagline: 'Building future-ready skills',
        phone: '+91 1234567890',
        address: 'West Bengal, India',
        organization: 'BIOROBODRAI',
        youtubeLink: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    });

    useEffect(() => {
        fetchContactInfo();
    }, []);

    const fetchContactInfo = async () => {
        try {
            const response = await settingsAPI.get();
            if (response.data && response.data.contactInfo) {
                setContactInfo(response.data.contactInfo);
            }
        } catch (error) {
            console.error('Error fetching contact info:', error);
        }
    };

    const updateContactInfo = async (newData) => {
        // Legacy support - simply refetch
        await fetchContactInfo();
    };

    return (
        <ContactContext.Provider value={{ contactInfo, updateContactInfo, refreshContactInfo: fetchContactInfo }}>
            {children}
        </ContactContext.Provider>
    );
}

export function useContact() {
    const context = useContext(ContactContext);
    if (!context) {
        throw new Error('useContact must be used within ContactProvider');
    }
    return context;
}
