import React, { createContext, useContext, useState } from 'react';
import { mockUsers } from '../data/mockData';

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

    const login = (email, password) => {
        const found = mockUsers.find(
            (u) => u.email === email && u.password === password
        );
        if (found) {
            const userData = { id: found.id, name: found.name, email: found.email, role: found.role, avatar: found.avatar };
            setUser(userData);
            localStorage.setItem('pharmacare_user', JSON.stringify(userData));
            return { success: true, user: userData };
        }
        return { success: false, message: 'Invalid email or password' };
    };

    const logout = () => {
        setUser(null);
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
