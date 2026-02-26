import React, { useState } from 'react';
import { mockMedicines, mockSales, mockSuppliers, getLowStockMedicines, getOutOfStockMedicines, getExpiringSoonMedicines } from '../../data/mockData';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('inventory');

    const tabs = [
        { id: 'inventory', label: 'Inventory Report', icon: '📦' },
        { id: 'sales', label: 'Sales Report', icon: '💰' },
        { id: 'expiry', label: 'Expiry Report', icon: '⏰' },
        { id: 'supplier', label: 'Supplier Report', icon: '🚚' },
    ];

    const totalStock = mockMedicines.reduce((s, m) => s + m.stock, 0);
    const totalValue = mockMedicines.reduce((s, m) => s + m.sellingPrice * m.stock, 0);
    const totalRevenue = mockSales.reduce((s, x) => s + x.total, 0);
    const lowStock = getLowStockMedicines();
    const outOfStock = getOutOfStockMedicines();
    const expiringSoon = getExpiringSoonMedicines(90);

    const handleExport = (format) => {
        alert(`📄 ${format.toUpperCase()} export initiated!\n\nThis is a mock action. In production, this would download the ${activeTab} report as ${format.toUpperCase()}.`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Generate and export pharmacy reports.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => handleExport('pdf')} className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 border border-red-200 transition-colors">📄 Export PDF</button>
                    <button onClick={() => handleExport('csv')} className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 border border-emerald-200 transition-colors">📊 Export CSV</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Inventory Report */}
            {activeTab === 'inventory' && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[['Total Products', mockMedicines.length, 'from-blue-500 to-blue-600'], ['Total Stock', totalStock.toLocaleString('en-IN'), 'from-emerald-500 to-emerald-600'], ['Stock Value', `₹${totalValue.toLocaleString('en-IN')}`, 'from-violet-500 to-purple-600'], ['Low/Out Stock', `${lowStock.length + outOfStock.length}`, 'from-red-500 to-rose-600']].map(([l, v, c]) => (
                            <div key={l} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"><p className="text-sm text-gray-500">{l}</p><p className="text-2xl font-bold text-gray-900 mt-1">{v}</p><div className={`h-1 w-10 rounded-full bg-gradient-to-r ${c} mt-3`}></div></div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-bold">Stock Summary by Category</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left"><thead><tr className="bg-gray-50/80 border-b">{['Category', 'Products', 'Total Stock', 'Total Value'].map((h) => <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {['Antibiotic', 'Painkiller', 'Vitamin', 'Diabetes', 'Respiratory', 'Gastro', 'Cholesterol', 'Antihistamine'].map((cat) => {
                                        const catMeds = mockMedicines.filter((m) => m.category === cat);
                                        return (
                                            <tr key={cat} className="hover:bg-gray-50"><td className="px-5 py-3 text-sm font-semibold text-gray-900">{cat}</td><td className="px-5 py-3 text-sm text-gray-600">{catMeds.length}</td><td className="px-5 py-3 text-sm text-gray-600">{catMeds.reduce((s, m) => s + m.stock, 0)}</td><td className="px-5 py-3 text-sm font-medium text-gray-700">₹{catMeds.reduce((s, m) => s + m.sellingPrice * m.stock, 0).toLocaleString('en-IN')}</td></tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Sales Report */}
            {activeTab === 'sales' && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[['Total Revenue', `₹${totalRevenue.toLocaleString('en-IN')}`, 'from-emerald-500 to-emerald-600'], ['Total Invoices', mockSales.length, 'from-blue-500 to-blue-600'], ['Avg Transaction', `₹${Math.round(totalRevenue / mockSales.length).toLocaleString('en-IN')}`, 'from-violet-500 to-purple-600']].map(([l, v, c]) => (
                            <div key={l} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"><p className="text-sm text-gray-500">{l}</p><p className="text-2xl font-bold text-gray-900 mt-1">{v}</p><div className={`h-1 w-10 rounded-full bg-gradient-to-r ${c} mt-3`}></div></div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold mb-4">Sales by Payment Method</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {['Cash', 'UPI', 'Card'].map((method) => {
                                const methodSales = mockSales.filter((s) => s.payment === method);
                                const methodTotal = methodSales.reduce((s, x) => s + x.total, 0);
                                return (
                                    <div key={method} className="text-center p-4 rounded-xl bg-gray-50">
                                        <p className="text-2xl mb-2">{method === 'Cash' ? '💵' : method === 'UPI' ? '📱' : '💳'}</p>
                                        <p className="text-lg font-bold text-gray-900">₹{methodTotal.toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-gray-400 mt-1">{methodSales.length} transactions</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Expiry Report */}
            {activeTab === 'expiry' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-bold">{expiringSoon.length} Medicines Expiring Within 90 Days</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left"><thead><tr className="bg-gray-50/80 border-b">{['Medicine', 'Batch', 'Stock', 'Expiry', 'Value at Risk'].map((h) => <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {expiringSoon.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50"><td className="px-5 py-3 text-sm font-semibold text-gray-900">{m.name}</td><td className="px-5 py-3 text-sm font-mono text-gray-500">{m.batch}</td><td className="px-5 py-3 text-sm font-bold text-gray-700">{m.stock}</td><td className="px-5 py-3 text-sm text-red-600 font-medium">{m.expiry}</td><td className="px-5 py-3 text-sm font-bold text-red-600">₹{(m.sellingPrice * m.stock).toLocaleString('en-IN')}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Supplier Report */}
            {activeTab === 'supplier' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-bold">Supplier Summary</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left"><thead><tr className="bg-gray-50/80 border-b">{['Supplier', 'Status', 'Medicines Supplied', 'Total Orders', 'Last Order'].map((h) => <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {mockSuppliers.map((s) => {
                                    const supplied = mockMedicines.filter((m) => m.supplier === s.id).length;
                                    return <tr key={s.id} className="hover:bg-gray-50"><td className="px-5 py-3 text-sm font-semibold text-gray-900">{s.name}</td><td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : s.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{s.status}</span></td><td className="px-5 py-3 text-sm text-gray-600">{supplied}</td><td className="px-5 py-3 text-sm font-medium text-gray-700">{s.totalOrders}</td><td className="px-5 py-3 text-sm text-gray-500">{s.lastOrder}</td></tr>;
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
