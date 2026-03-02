import React from 'react';
import { useAuth } from '../../context/AuthContext';

const RoleGuard = ({ roles, children, fallback }) => {
    const { hasRole } = useAuth();

    if (!hasRole(roles)) {
        return fallback || (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
                <p className="text-gray-500 text-sm">You don't have permission to view this page.</p>
                <p className="text-gray-400 text-xs mt-1">Required role: {Array.isArray(roles) ? roles.join(', ') : roles}</p>
            </div>
        );
    }

    return children;
};

export default RoleGuard;
