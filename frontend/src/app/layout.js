import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { ContactProvider } from '../contexts/ContactContext';
import { ThemeProvider } from '../context/ThemeContext';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
    title: 'Bengal Education Ventures - Empowering Bengal Youth',
    description: 'Live technical skill based EdTech platform specializing in AI, Drone Technology, and 3D Printing courses for the youth of Bengal.',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" className={inter.variable}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body>
                <ContactProvider>
                    <ThemeProvider>
                        {children}
                    </ThemeProvider>
                </ContactProvider>
            </body>
        </html>
    );
}
