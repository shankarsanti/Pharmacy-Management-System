import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../../services/api';
import ConfirmDialog from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [showClearAll, setShowClearAll] = useState(false);
    const toast = useToast();

    // Fetch notifications on mount
    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await notificationsAPI.getAll();
            setNotifications(response.data.notifications || []);
        } catch (error) {
            console.error('Error fetching notifications:', error);
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const filtered = filter === 'all' ? notifications
        : filter === 'unread' ? notifications.filter((n) => !n.is_read)
            : notifications.filter((n) => n.type === filter);

    const markAsRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(notifications.map((n) => n.id === id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    };

    const markAllRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(notifications.map((n) => ({ ...n, is_read: true })));
            toast.success('All notifications marked as read');
        } catch (error) {
            console.error('Error marking all as read:', error);
            toast.error('Failed to mark all as read');
        }
    };

    const unreadCount = notifications.filter((n) => !n.is_read).length;
    const readCount = notifications.filter((n) => n.is_read).length;

    const handleDelete = async (id) => {
        try {
            await notificationsAPI.delete(id);
            setNotifications(notifications.filter((n) => n.id !== id));
            setDeleteTarget(null);
            toast.success('Notification deleted');
        } catch (error) {
            console.error('Error deleting notification:', error);
            toast.error('Failed to delete notification');
        }
    };

    const handleClearAll = async () => {
        try {
            // Delete all notifications one by one
            await Promise.all(notifications.map(n => notificationsAPI.delete(n.id)));
            setNotifications([]);
            setShowClearAll(false);
            toast.success('All notifications cleared');
        } catch (error) {
            console.error('Error clearing all:', error);
            toast.error('Failed to clear all notifications');
        }
    };

    const handleClearRead = async () => {
        try {
            const readNotifications = notifications.filter((n) => n.is_read);
            await Promise.all(readNotifications.map(n => notificationsAPI.delete(n.id)));
            setNotifications(notifications.filter((n) => !n.is_read));
            toast.success(`${readCount} read notifications cleared`);
        } catch (error) {
            console.error('Error clearing read:', error);
            toast.error('Failed to clear read notifications');
        }
    };

    const handleGenerateNotifications = async () => {
        try {
            await notificationsAPI.generate();
            await fetchNotifications();
            toast.success('Notifications generated successfully');
        } catch (error) {
            console.error('Error generating notifications:', error);
            toast.error('Failed to generate notifications');
        }
    };

    const typeStyles = {
        low_stock: { icon: '📦', bg: 'bg-amber-50 border-amber-200' },
        out_of_stock: { icon: '🚫', bg: 'bg-red-50 border-red-200' },
        expiry: { icon: '⏰', bg: 'bg-blue-50 border-blue-200' },
        system: { icon: '⚙️', bg: 'bg-gray-50 border-gray-200' },
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return date.toLocaleDateString('en-IN');
    };

    return (
        <div className="space-y-6">
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-500">Loading notifications...</p>
                    </div>
                </div>
            ) : (
                <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-sm text-gray-500 mt-1">{unreadCount} unread alerts · {notifications.length} total</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <button onClick={handleGenerateNotifications} className="inline-flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Generate
                    </button>
                    {unreadCount > 0 && (
                        <button onClick={markAllRead} className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                            Mark all read
                        </button>
                    )}
                    {readCount > 0 && (
                        <button onClick={handleClearRead} className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Clear Read
                        </button>
                    )}
                    {notifications.length > 0 && (
                        <button onClick={() => setShowClearAll(true)} className="inline-flex items-center gap-1.5 text-sm text-red-600 hover:text-red-700 font-medium hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {[['all', 'All'], ['unread', 'Unread'], ['low_stock', 'Low Stock'], ['out_of_stock', 'Out of Stock'], ['expiry', 'Expiry']].map(([val, label]) => (
                    <button key={val} onClick={() => setFilter(val)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === val ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{label}</button>
                ))}
            </div>

            {/* Notification Cards */}
            <div className="space-y-3">
                {filtered.map((n) => {
                    const style = typeStyles[n.type] || typeStyles.low_stock;
                    return (
                        <div key={n.id} onClick={() => markAsRead(n.id)} className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm group ${!n.is_read ? style.bg : 'bg-white border-gray-100'}`}>
                            <span className="text-2xl mt-0.5">{style.icon}</span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className={`text-sm font-bold ${!n.is_read ? 'text-gray-900' : 'text-gray-600'}`}>{n.title}</h3>
                                    {!n.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                                </div>
                                <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1.5">{formatDate(n.created_at)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${n.severity === 'critical' ? 'bg-red-100 text-red-700' : n.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{n.severity}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(n); }}
                                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Delete notification"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-4xl mb-3">🔔</p>
                        <p className="font-medium">No notifications</p>
                        <p className="text-sm mt-1">You're all caught up!</p>
                    </div>
                )}
            </div>

            {/* Delete Single Notification */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={() => handleDelete(deleteTarget?.id)}
                title="Delete Notification"
                message={`Delete "${deleteTarget?.title}" notification? This cannot be undone.`}
            />

            {/* Clear All Confirmation */}
            <ConfirmDialog
                isOpen={showClearAll}
                onClose={() => setShowClearAll(false)}
                onConfirm={handleClearAll}
                title="Clear All Notifications"
                message={`Are you sure you want to delete all ${notifications.length} notifications? This cannot be undone.`}
            />
                </>
            )}
        </div>
    );
};

export default Notifications;
