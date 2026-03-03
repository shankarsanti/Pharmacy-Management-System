import React, { createContext, useContext, useState } from 'react';
import { authAPI } from '../services/api';
import { auditLog } from '../utils/auditLogger';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('pharmacare_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const { token, user: userData } = response.data;
            
            setUser(userData);
            localStorage.setItem('pharmacare_token', token);
            localStorage.setItem('pharmacare_user', JSON.stringify(userData));
            
            // Log the login action
            auditLog.login(userData.name);
            
            return { success: true, user: userData };
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            return { success: false, message };
        }
    };

    const logout = () => {
        // Log the logout action before clearing user data
        if (user) {
            auditLog.logout(user.name);
        }
        
        setUser(null);
        localStorage.removeItem('pharmacare_token');
        localStorage.removeItem('pharmacare_user');
    };

    const hasRole = (roles) => {
        if (!user) return false;
        if (typeof roles === 'string') return user.role === roles;
        return roles.includes(user.role);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, hasRole, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};
