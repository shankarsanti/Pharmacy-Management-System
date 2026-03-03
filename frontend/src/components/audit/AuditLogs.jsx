import React, { useState, useEffect } from 'react';
import { auditLogsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const toast = useToast();

    useEffect(() => {
        const abortController = new AbortController();
        fetchLogs(abortController.signal);
        
        return () => {
            abortController.abort();
        };
    }, [filter]);

    const fetchLogs = async (signal) => {
        try {
            setLoading(true);
            const params = filter !== 'all' ? { type: filter } : {};
            const response = await auditLogsAPI.getAll(params);
            
            if (signal?.aborted) return;
            
            setLogs(response.data.logs || []);
        } catch (error) {
            if (error.name === 'CanceledError' || signal?.aborted) return;
            console.error('Failed to fetch audit logs:', error);
            toast.error('Failed to load audit logs');
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    };

    const filtered = logs;

    const typeStyles = {
        inventory: { icon: '📦', color: 'bg-blue-100 text-blue-700' },
        sales: { icon: '💰', color: 'bg-emerald-100 text-emerald-700' },
        auth: { icon: '🔐', color: 'bg-violet-100 text-violet-700' },
        supplier: { icon: '🚚', color: 'bg-cyan-100 text-cyan-700' },
        system: { icon: '⚙️', color: 'bg-gray-100 text-gray-700' },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading audit logs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                <p className="text-sm text-gray-500 mt-1">Track all system activities and user actions.</p>
            </div>

            <div className="flex gap-2 flex-wrap">
                {[['all', 'All'], ['inventory', 'Inventory'], ['sales', 'Sales'], ['auth', 'Auth'], ['supplier', 'Supplier'], ['system', 'System']].map(([val, label]) => (
                    <button key={val} onClick={() => setFilter(val)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === val ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{label}</button>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-50/80 border-b border-gray-100">
                            {['', 'Action', 'Description', 'User', 'Role', 'Timestamp'].map((h) => <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((log) => {
                                const style = typeStyles[log.log_type] || typeStyles.system;
                                const timestamp = new Date(log.created_at).toLocaleString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                });
                                return (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 text-lg">{style.icon}</td>
                                        <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${style.color}`}>{log.action}</span></td>
                                        <td className="px-5 py-3.5 text-sm text-gray-700">{log.description}</td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{log.user_name || 'System'}</td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500">{log.user_role || '—'}</td>
                                        <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{timestamp}</td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center text-gray-400">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="font-medium">No audit logs found</p>
                                        <p className="text-sm mt-1">System activities will appear here</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
