import React, { useState } from 'react';
import { mockAuditLogs } from '../../data/mockData';

const AuditLogs = () => {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? mockAuditLogs : mockAuditLogs.filter((l) => l.type === filter);

    const typeStyles = {
        inventory: { icon: '📦', color: 'bg-blue-100 text-blue-700' },
        sales: { icon: '💰', color: 'bg-emerald-100 text-emerald-700' },
        auth: { icon: '🔐', color: 'bg-violet-100 text-violet-700' },
        supplier: { icon: '🚚', color: 'bg-cyan-100 text-cyan-700' },
        system: { icon: '⚙️', color: 'bg-gray-100 text-gray-700' },
    };

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
                                const style = typeStyles[log.type] || typeStyles.system;
                                return (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3.5 text-lg">{style.icon}</td>
                                        <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${style.color}`}>{log.action}</span></td>
                                        <td className="px-5 py-3.5 text-sm text-gray-700">{log.description}</td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{log.user}</td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500">{log.role}</td>
                                        <td className="px-5 py-3.5 text-sm text-gray-400 font-mono">{log.timestamp}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
