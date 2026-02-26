import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { mockNotifications } from '../../data/mockData';

const Navbar = () => {
    const { user } = useAuth();
    const [showNotifs, setShowNotifs] = useState(false);
    const unreadCount = mockNotifications.filter((n) => !n.read).length;

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30">
            <div className="px-6 flex justify-between h-16 items-center">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">Online</span>
                </div>

                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifs(!showNotifs)}
                            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{unreadCount}</span>
                            )}
                        </button>

                        {/* Notification Dropdown */}
                        {showNotifs && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setShowNotifs(false)}></div>
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                                        <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
                                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                        {mockNotifications.slice(0, 5).map((n) => (
                                            <div key={n.id} className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/30' : ''}`}>
                                                <div className="flex gap-3">
                                                    <span className="text-lg mt-0.5">
                                                        {n.severity === 'critical' ? '🔴' : n.severity === 'warning' ? '🟡' : '🔵'}
                                                    </span>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900">{n.title}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                                                        <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <a href="/notifications" className="block px-4 py-3 text-center text-sm text-blue-600 font-medium border-t border-gray-100 hover:bg-gray-50">
                                        View All Notifications
                                    </a>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="w-px h-8 bg-gray-200"></div>

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
