import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center max-w-md px-6">
            <div className="text-8xl font-black text-gray-200 mb-4">404</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
            <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
            <Link to="/" className="inline-flex px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all">
                Back to Dashboard
            </Link>
        </div>
    </div>
);

export const UnauthorizedPage = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center max-w-md px-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-500 mb-6">You don't have permission to access this page. Please contact your administrator.</p>
            <Link to="/" className="inline-flex px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all">
                Back to Dashboard
            </Link>
        </div>
    </div>
);
