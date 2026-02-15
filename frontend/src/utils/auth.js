export const setToken = (token) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
    }
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
    }
    return null;
};

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const setUser = (user) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
    return null;
};

export const isAuthenticated = () => {
    return !!getToken();
};

export const isAdmin = () => {
    const user = getUser();
    return user && user.role === 'Admin';
};

export const isEnrolledInCourse = (courseId) => {
    const user = getUser();
    if (!user || !user.enrolledCourses) return false;
    return user.enrolledCourses.includes(courseId);
};
