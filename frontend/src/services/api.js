import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('pharmacare_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('pharmacare_token');
            localStorage.removeItem('pharmacare_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (email, password) => api.post('/auth/login', { email, password }),
    getMe: () => api.get('/auth/me'),
    changePassword: (currentPassword, newPassword) => 
        api.put('/auth/change-password', { currentPassword, newPassword }),
};

// Users API
export const usersAPI = {
    getAll: () => api.get('/users'),
    create: (userData) => api.post('/users', userData),
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
};

// Categories API
export const categoriesAPI = {
    getAll: () => api.get('/categories'),
    create: (categoryData) => api.post('/categories', categoryData),
    update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Suppliers API
export const suppliersAPI = {
    getAll: () => api.get('/suppliers'),
    create: (supplierData) => api.post('/suppliers', supplierData),
    update: (id, supplierData) => api.put(`/suppliers/${id}`, supplierData),
    delete: (id) => api.delete(`/suppliers/${id}`),
};

// Medicines API
export const medicinesAPI = {
    getAll: () => api.get('/medicines'),
    getById: (id) => api.get(`/medicines/${id}`),
    create: (medicineData) => api.post('/medicines', medicineData),
    update: (id, medicineData) => api.put(`/medicines/${id}`, medicineData),
    delete: (id) => api.delete(`/medicines/${id}`),
    getLowStock: () => api.get('/medicines/alerts/low-stock'),
    getOutOfStock: () => api.get('/medicines/alerts/out-of-stock'),
    getExpiring: (days = 90) => api.get(`/medicines/alerts/expiring?days=${days}`),
};

// Sales API
export const salesAPI = {
    getAll: (params) => api.get('/sales', { params }),
    getById: (id) => api.get(`/sales/${id}`),
    create: (saleData) => api.post('/sales', saleData),
    getStats: () => api.get('/sales/stats/dashboard'),
};

// Stock Entries API
export const stockEntriesAPI = {
    getAll: () => api.get('/stock-entries'),
    getById: (id) => api.get(`/stock-entries/${id}`),
    create: (stockEntryData) => api.post('/stock-entries', stockEntryData),
    delete: (id) => api.delete(`/stock-entries/${id}`),
};

// Notifications API
export const notificationsAPI = {
    getAll: () => api.get('/notifications'),
    markAsRead: (id) => api.put(`/notifications/${id}/read`),
    markAllAsRead: () => api.put('/notifications/read-all'),
    delete: (id) => api.delete(`/notifications/${id}`),
    generate: () => api.post('/notifications/generate'),
};

// Audit Logs API
export const auditLogsAPI = {
    getAll: (params) => api.get('/audit-logs', { params }),
    create: (logData) => api.post('/audit-logs', logData),
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
};

// Settings API
export const settingsAPI = {
    getAll: () => api.get('/settings'),
    update: (settings) => api.put('/settings', settings),
    getByKey: (key) => api.get(`/settings/${key}`),
};

// Customer Requests API
export const customerRequestsAPI = {
    getAll: () => api.get('/customer-requests'),
    create: (requestData) => api.post('/customer-requests', requestData),
    update: (id, requestData) => api.put(`/customer-requests/${id}`, requestData),
    delete: (id) => api.delete(`/customer-requests/${id}`),
};

// Doctors API
export const doctorsAPI = {
    getAll: () => api.get('/doctors'),
    create: (doctorData) => api.post('/doctors', doctorData),
    update: (id, doctorData) => api.put(`/doctors/${id}`, doctorData),
    delete: (id) => api.delete(`/doctors/${id}`),
};

export default api;
