'use client';
import { useEffect, useRef, useCallback } from 'react';
import { removeToken } from '../utils/auth';
import { useRouter } from 'next/navigation';

const TIMEOUT_DURATION = 15 * 60 * 1000;   // 15 minutes in ms
const WARNING_BEFORE = 1 * 60 * 1000;   // warn 1 minute before logout
const WARNING_AT = TIMEOUT_DURATION - WARNING_BEFORE; // 14 minutes

const ACTIVITY_EVENTS = [
    'mousemove', 'mousedown', 'keydown',
    'click', 'scroll', 'touchstart', 'touchmove',
];

/**
 * useInactivityTimeout
 *
 * @param {boolean}  isAuthenticated  - shows whether user is logged in
 * @param {Function} onWarn           - called when 1-minute warning should show
 * @param {Function} onTimeout        - called when session expires (after 15 min)
 * @param {Function} onActivity       - called when user activity is detected while warning is showing
 */
export default function useInactivityTimeout({
    isAuthenticated,
    onWarn,
    onTimeout,
    onActivity,
}) {
    const router = useRouter();
    const warnTimer = useRef(null);
    const logoutTimer = useRef(null);
    const isWarning = useRef(false);

    const clearTimers = useCallback(() => {
        if (warnTimer.current) clearTimeout(warnTimer.current);
        if (logoutTimer.current) clearTimeout(logoutTimer.current);
    }, []);

    const logout = useCallback(() => {
        clearTimers();
        removeToken();
        localStorage.removeItem('lastActivity');
        router.push('/login');
        onTimeout?.();
    }, [clearTimers, router, onTimeout]);

    const resetTimer = useCallback(() => {
        if (!isAuthenticated) return;

        // If warning modal is currently showing, notify the parent
        if (isWarning.current) {
            isWarning.current = false;
            onActivity?.();
        }

        clearTimers();

        // Store last activity timestamp (survives page refresh)
        localStorage.setItem('lastActivity', Date.now().toString());

        // Show warning after 14 minutes
        warnTimer.current = setTimeout(() => {
            isWarning.current = true;
            onWarn?.();

            // Auto-logout 1 minute after warning
            logoutTimer.current = setTimeout(() => {
                logout();
            }, WARNING_BEFORE);
        }, WARNING_AT);
    }, [isAuthenticated, clearTimers, logout, onWarn, onActivity]);

    // On mount (or when auth state changes), check if the session already expired
    useEffect(() => {
        if (!isAuthenticated) {
            clearTimers();
            return;
        }

        const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0', 10);
        const elapsed = Date.now() - lastActivity;

        if (lastActivity && elapsed >= TIMEOUT_DURATION) {
            // Session expired while tab was closed / user was away
            logout();
            return;
        }

        // Resume timers with remaining time after a refresh
        if (lastActivity && elapsed < TIMEOUT_DURATION) {
            const remaining = TIMEOUT_DURATION - elapsed;
            if (remaining <= WARNING_BEFORE) {
                // Already in the warning window
                isWarning.current = true;
                onWarn?.();
                logoutTimer.current = setTimeout(logout, remaining);
            } else {
                const timeUntilWarn = remaining - WARNING_BEFORE;
                localStorage.setItem('lastActivity', (Date.now() - elapsed).toString());
                warnTimer.current = setTimeout(() => {
                    isWarning.current = true;
                    onWarn?.();
                    logoutTimer.current = setTimeout(logout, WARNING_BEFORE);
                }, timeUntilWarn);
            }
            return;
        }

        // Fresh session start
        resetTimer();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    // Attach / detach activity listeners
    useEffect(() => {
        if (!isAuthenticated) return;

        const handler = () => resetTimer();
        ACTIVITY_EVENTS.forEach((event) =>
            window.addEventListener(event, handler, { passive: true })
        );

        return () => {
            ACTIVITY_EVENTS.forEach((event) =>
                window.removeEventListener(event, handler)
            );
            clearTimers();
        };
    }, [isAuthenticated, resetTimer, clearTimers]);

    return { resetTimer };
}
