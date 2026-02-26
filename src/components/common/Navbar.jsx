import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user } = useAuth();

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30">
            <div className="px-6 flex justify-between h-16 items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">Online</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-700">{user?.name || 'Super Admin'}</p>
                            <p className="text-xs text-gray-400">{user?.role || 'Admin'}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20">
                            {user?.avatar || 'SA'}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
