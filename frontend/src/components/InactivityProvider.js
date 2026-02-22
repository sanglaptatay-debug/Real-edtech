'use client';
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useInactivityTimeout from '../hooks/useInactivityTimeout';
import InactivityWarning from '../components/InactivityWarning';
import { removeToken, getToken } from '../utils/auth';

export default function InactivityProvider({ children }) {
    const router = useRouter();
    const [showWarning, setShowWarning] = useState(false);

    // Check on every render whether user is authenticated
    const isAuthenticated =
        typeof window !== 'undefined' ? !!getToken() : false;

    const handleWarn = useCallback(() => {
        setShowWarning(true);
    }, []);

    const handleTimeout = useCallback(() => {
        setShowWarning(false);
    }, []);

    const handleActivity = useCallback(() => {
        setShowWarning(false);
    }, []);

    const { resetTimer } = useInactivityTimeout({
        isAuthenticated,
        onWarn: handleWarn,
        onTimeout: handleTimeout,
        onActivity: handleActivity,
    });

    const handleStayLoggedIn = useCallback(() => {
        setShowWarning(false);
        resetTimer();
    }, [resetTimer]);

    const handleLogOutNow = useCallback(() => {
        setShowWarning(false);
        removeToken();
        localStorage.removeItem('lastActivity');
        router.push('/login');
    }, [router]);

    return (
        <>
            {children}
            <InactivityWarning
                isVisible={showWarning}
                onStayLoggedIn={handleStayLoggedIn}
                onLogOutNow={handleLogOutNow}
            />
        </>
    );
}
