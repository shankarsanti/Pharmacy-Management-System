import React, { useState } from 'react';
import { mockMedicines, getDaysUntilExpiry, getCategoryColor } from '../../data/mockData';

const ExpiryManagement = () => {
    const [filter, setFilter] = useState('all');

    const withExpiry = mockMedicines.map((m) => ({ ...m, daysLeft: getDaysUntilExpiry(m.expiry) }));
    const sorted = [...withExpiry].sort((a, b) => a.daysLeft - b.daysLeft);

    const filtered = filter === 'expired' ? sorted.filter((m) => m.daysLeft <= 0)
        : filter === '30' ? sorted.filter((m) => m.daysLeft > 0 && m.daysLeft <= 30)
            : filter === '60' ? sorted.filter((m) => m.daysLeft > 0 && m.daysLeft <= 60)
                : filter === '90' ? sorted.filter((m) => m.daysLeft > 0 && m.daysLeft <= 90)
                    : sorted;

    const expired = sorted.filter((m) => m.daysLeft <= 0).length;
    const within30 = sorted.filter((m) => m.daysLeft > 0 && m.daysLeft <= 30).length;
    const within60 = sorted.filter((m) => m.daysLeft > 30 && m.daysLeft <= 60).length;
    const within90 = sorted.filter((m) => m.daysLeft > 60 && m.daysLeft <= 90).length;

    const getExpiryBadge = (days) => {
        if (days <= 0) return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 border border-red-200">Expired</span>;
        if (days <= 30) return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-100">{days} days</span>;
        if (days <= 60) return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">{days} days</span>;
        if (days <= 90) return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-yellow-50 text-yellow-600 border border-yellow-100">{days} days</span>;
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">{days} days</span>;
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Expiry Tracker</h1>
                <p className="text-sm text-gray-500 mt-1">Monitor medicine expiry dates and take timely action.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Expired', count: expired, color: 'bg-red-500', ring: 'ring-red-200' },
                    { label: 'Within 30 Days', count: within30, color: 'bg-orange-500', ring: 'ring-orange-200' },
                    { label: '30–60 Days', count: within60, color: 'bg-amber-500', ring: 'ring-amber-200' },
                    { label: '60–90 Days', count: within90, color: 'bg-yellow-500', ring: 'ring-yellow-200' },
                ].map((item) => (
                    <div key={item.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-center">
                        <div className={`w-12 h-12 rounded-full ${item.color} mx-auto flex items-center justify-center text-white text-lg font-bold ring-4 ${item.ring}`}>{item.count}</div>
                        <p className="text-sm font-medium text-gray-700 mt-3">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {[['all', 'All'], ['expired', 'Expired'], ['30', '≤ 30 Days'], ['60', '≤ 60 Days'], ['90', '≤ 90 Days']].map(([val, label]) => (
                    <button key={val} onClick={() => setFilter(val)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === val ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{label}</button>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-50/80 border-b border-gray-100">
                            {['ID', 'Medicine', 'Category', 'Batch', 'Stock', 'Expiry Date', 'Days Left', 'Status'].map((h) => <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((med) => {
                                const catColor = getCategoryColor(med.category);
                                return (
                                    <tr key={med.id} className={`transition-colors ${med.daysLeft <= 0 ? 'bg-red-50/30' : med.daysLeft <= 30 ? 'bg-orange-50/20' : 'hover:bg-gray-50'}`}>
                                        <td className="px-5 py-3.5 text-sm font-mono text-gray-400">{med.id}</td>
                                        <td className="px-5 py-3.5"><p className="text-sm font-semibold text-gray-900">{med.name}</p><p className="text-xs text-gray-400">{med.generic}</p></td>
                                        <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${catColor.bg} ${catColor.text}`}>{med.category}</span></td>
                                        <td className="px-5 py-3.5 text-sm font-mono text-gray-500">{med.batch}</td>
                                        <td className="px-5 py-3.5 text-sm font-bold text-gray-700">{med.stock}</td>
                                        <td className="px-5 py-3.5 text-sm text-gray-600">{med.expiry}</td>
                                        <td className="px-5 py-3.5 text-sm font-bold">{med.daysLeft}</td>
                                        <td className="px-5 py-3.5">{getExpiryBadge(med.daysLeft)}</td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && <tr><td colSpan="8" className="px-6 py-16 text-center text-gray-400">No medicines in this range</td></tr>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ExpiryManagement;
