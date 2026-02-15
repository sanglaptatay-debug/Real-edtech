import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    // Admin management
    getAdmins: () => api.get('/auth/admins'),
    registerAdmin: (data) => api.post('/auth/register-admin', data),
    resetAdminPassword: (id, password) => api.put(`/auth/admins/${id}/password`, { password }),
    deleteAdmin: (id) => api.delete(`/auth/admins/${id}`),
};

// Courses API
// Courses API
export const coursesAPI = {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    create: (formData) => api.post('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/courses/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/courses/${id}`),
};

// Live Sessions API
export const liveSessionsAPI = {
    getAll: () => api.get('/live-sessions'),
    getByCourse: (courseId) => api.get(`/live-sessions/course/${courseId}`),
    create: (data) => api.post('/live-sessions', data),
    update: (id, data) => api.put(`/live-sessions/${id}`, data),
    delete: (id) => api.delete(`/live-sessions/${id}`),
};

// Resources API
export const resourcesAPI = {
    getByCourse: (courseId) => api.get(`/resources/course/${courseId}`),
    create: (data) => api.post('/resources', data),
    update: (id, data) => api.put(`/resources/${id}`, data),
    delete: (id) => api.delete(`/resources/${id}`),
};

// Gallery API
export const galleryAPI = {
    getAll: () => api.get('/gallery'),
    upload: (formData) => api.post('/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.put(`/gallery/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/gallery/${id}`),
};

// Contact API
export const contactAPI = {
    get: () => api.get('/contact'),
    update: (data) => api.put('/contact', data),
};

// Project Videos API
export const projectVideosAPI = {
    getAll: () => api.get('/project-videos'),
    create: (data) => api.post('/project-videos', data),
    update: (id, data) => api.put(`/project-videos/${id}`, data),
    delete: (id) => api.delete(`/project-videos/${id}`),
};

// Web Projects API
export const webProjectsAPI = {
    getAll: () => api.get('/web-projects'),
    create: (data) => api.post('/web-projects', data),
    update: (id, data) => api.put(`/web-projects/${id}`, data),
    delete: (id) => api.delete(`/web-projects/${id}`),
};

export const settingsAPI = {
    get: () => api.get('/settings'),
    update: (formData) => api.put('/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

export default api;
