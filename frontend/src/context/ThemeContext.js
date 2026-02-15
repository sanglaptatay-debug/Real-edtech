'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    const [logoUrl, setLogoUrl] = useState('');
    const [fullSettings, setFullSettings] = useState(null);

    useEffect(() => {
        // Load saved theme from local storage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setTheme(savedTheme);
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark');
            }
        } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setTheme('dark');
            document.documentElement.classList.add('dark');
        }

        // Fetch site settings (logo, etc.)
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/settings`);
            const data = await res.json();
            if (data) {
                if (data.logoUrl) setLogoUrl(data.logoUrl);
                if (data.darkModeEnabled === false) {
                    // Force light mode if dark mode is disabled by admin
                    setTheme('light');
                    document.documentElement.classList.remove('dark');
                }
                setFullSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, logoUrl, fetchSettings, fullSettings }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
