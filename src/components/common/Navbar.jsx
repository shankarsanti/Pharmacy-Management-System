import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const Navbar = () => {
    const { user } = useAuth();
    const { settings, updateSettings } = useSettings();
    const isDark = settings.theme === 'dark';

    const toggleTheme = () => {
        updateSettings({ theme: isDark ? 'light' : 'dark' });
    };

    return (
        <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-gray-200/60 dark:border-slate-700/60 sticky top-0 z-30 transition-colors duration-300">
            <div className="px-6 flex justify-between h-16 items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Admin Panel</h1>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-medium">Online</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="relative w-14 h-7 rounded-full bg-gray-200 dark:bg-slate-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/30 group"
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        <div className={`absolute top-0.5 w-6 h-6 rounded-full shadow-md transition-all duration-300 flex items-center justify-center text-xs ${isDark ? 'left-7.5 bg-slate-800' : 'left-0.5 bg-white'}`}>
                            {isDark ? '🌙' : '☀️'}
                        </div>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">{user?.name || 'Super Admin'}</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500">{user?.role || 'Admin'}</p>
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
