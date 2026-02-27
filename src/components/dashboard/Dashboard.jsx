import React from 'react';
import { Link } from 'react-router-dom';
import { mockMedicines, mockSales, getLowStockMedicines, getOutOfStockMedicines, getExpiringSoonMedicines, getTodaysSales, getTodaysRevenue, getDaysUntilExpiry, getTodaysProfit, getThisMonthProfit, getThisMonthRevenue, getProfitMargin, getTodaysCost, getThisMonthCost } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
    const todaysSales = getTodaysSales();
    const todaysRevenue = getTodaysRevenue();
    const lowStock = getLowStockMedicines();
    const outOfStock = getOutOfStockMedicines();
    const expiringSoon = getExpiringSoonMedicines(60);
    const totalMedicines = mockMedicines.reduce((s, m) => s + m.stock, 0);
    const { user } = useAuth();
    const canEdit = user?.role !== 'Pharmacist';

    // Profit calculations
    const todaysProfit = getTodaysProfit();
    const todaysCost = getTodaysCost();
    const monthProfit = getThisMonthProfit();
    const monthRevenue = getThisMonthRevenue();
    const monthCost = getThisMonthCost();
    const monthMargin = getProfitMargin(monthProfit, monthRevenue);
    const todayMargin = getProfitMargin(todaysProfit, todaysRevenue);

    const stats = [
        { title: 'Total Medicines', value: totalMedicines.toLocaleString('en-IN'), change: `${mockMedicines.length} products`, color: 'from-blue-500 to-blue-600', iconBg: 'bg-blue-100 text-blue-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg> },
        { title: 'Sales Today', value: `₹${todaysRevenue.toLocaleString('en-IN')}`, change: `${todaysSales.length} invoices`, color: 'from-emerald-500 to-emerald-600', iconBg: 'bg-emerald-100 text-emerald-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { title: 'Low Stock Alerts', value: lowStock.length + outOfStock.length, change: `${outOfStock.length} out of stock`, color: 'from-red-500 to-rose-600', iconBg: 'bg-red-100 text-red-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
        { title: 'Expiring Soon', value: expiringSoon.length, change: 'Within 60 days', color: 'from-amber-500 to-orange-500', iconBg: 'bg-amber-100 text-amber-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
        { title: 'Total Revenue', value: `₹${mockSales.reduce((s, x) => s + x.total, 0).toLocaleString('en-IN')}`, change: 'All time', color: 'from-violet-500 to-purple-600', iconBg: 'bg-violet-100 text-violet-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
        { title: 'Active Suppliers', value: '4', change: '1 pending', color: 'from-cyan-500 to-teal-500', iconBg: 'bg-cyan-100 text-cyan-600', icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
    ];

    // Get medicines that need attention
    const alertMedicines = [
        ...outOfStock.map((m) => ({ ...m, issue: 'Out of Stock', severity: 'critical' })),
        ...lowStock.map((m) => ({ ...m, issue: 'Low Stock', severity: 'warning' })),
        ...expiringSoon.map((m) => ({ ...m, issue: `Expires in ${getDaysUntilExpiry(m.expiry)} days`, severity: getDaysUntilExpiry(m.expiry) <= 30 ? 'warning' : 'info' })),
    ].slice(0, 8);

    // Simple bar chart data for weekly sales
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyData = [4200, 3800, 5100, 4600, 6200, 3200, 5500];
    const maxSale = Math.max(...weeklyData);

    return (
        <div className="space-y-6">
            {/* Header with Quick Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening at your pharmacy.</p>
                </div>
                {canEdit && (
                    <div className="flex gap-3">
                        <Link to="/inventory" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                            Add Medicine
                        </Link>
                        <Link to="/pos" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl text-sm font-medium text-white shadow-sm shadow-blue-500/20 transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                            New Bill
                        </Link>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300 group">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                <p className="text-xs text-gray-400 mt-1">{stat.change}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>{stat.icon}</div>
                        </div>
                        <div className={`h-1 w-10 rounded-full bg-gradient-to-r ${stat.color} mt-3`}></div>
                    </div>
                ))}
            </div>

            {/* 📊 Profit Overview Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 bg-emerald-500/20 rounded-xl">
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Profit Overview</h2>
                        <p className="text-xs text-slate-400">Revenue vs Cost analysis</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left — Today's Breakdown */}
                    <div className="bg-slate-800/60 rounded-xl border border-slate-700/40 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Today</h3>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${Number(todayMargin) >= 30 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                {todayMargin}% Margin
                            </span>
                        </div>
                        <div className="space-y-4">
                            {/* Revenue row */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-400"></span>
                                        <span className="text-xs font-medium text-slate-400">Revenue</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">₹{todaysRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            {/* Cost row */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span>
                                        <span className="text-xs font-medium text-slate-400">Cost (COGS)</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">₹{todaysCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-1000" style={{ width: `${todaysRevenue > 0 ? (todaysCost / todaysRevenue * 100) : 0}%` }}></div>
                                </div>
                            </div>
                            {/* Profit row */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
                                        <span className="text-xs font-medium text-slate-400">Profit</span>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">₹{todaysProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${todaysRevenue > 0 ? (todaysProfit / todaysRevenue * 100) : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-700/30 flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" /></svg>
                            <span className="text-[11px] text-slate-500">{todaysSales.length} invoice(s) today</span>
                        </div>
                    </div>

                    {/* Right — This Month Breakdown */}
                    <div className="bg-slate-800/60 rounded-xl border border-slate-700/40 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">This Month (Feb)</h3>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${Number(monthMargin) >= 30 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                                {monthMargin}% Margin
                            </span>
                        </div>
                        <div className="space-y-4">
                            {/* Revenue row */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-blue-400"></span>
                                        <span className="text-xs font-medium text-slate-400">Revenue</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">₹{monthRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            {/* Cost row */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-rose-400"></span>
                                        <span className="text-xs font-medium text-slate-400">Cost (COGS)</span>
                                    </div>
                                    <span className="text-sm font-bold text-white">₹{monthCost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-rose-500 to-rose-400 rounded-full transition-all duration-1000" style={{ width: `${monthRevenue > 0 ? (monthCost / monthRevenue * 100) : 0}%` }}></div>
                                </div>
                            </div>
                            {/* Profit row */}
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
                                        <span className="text-xs font-medium text-slate-400">Profit</span>
                                    </div>
                                    <span className="text-sm font-bold text-emerald-400">₹{monthProfit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                                <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${monthRevenue > 0 ? (monthProfit / monthRevenue * 100) : 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-700/30 flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            <span className="text-[11px] text-slate-500">{mockSales.filter(s => s.date.startsWith('2026-02')).length} invoice(s) this month</span>
                        </div>
                    </div>
                </div>

                {/* Profit Margin Gauge — bottom row */}
                <div className="mt-5 bg-slate-800/60 rounded-xl border border-slate-700/40 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">Overall Profit Margin</span>
                            </div>
                            <p className="text-3xl font-bold text-white">{monthMargin}%</p>
                        </div>
                        <div className="flex-1 max-w-md">
                            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${Number(monthMargin) >= 40 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                                            Number(monthMargin) >= 25 ? 'bg-gradient-to-r from-cyan-500 to-cyan-400' :
                                                'bg-gradient-to-r from-amber-500 to-amber-400'
                                        }`}
                                    style={{ width: `${Math.min(Number(monthMargin), 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                                <span className="text-[10px] text-slate-500">0%</span>
                                <span className="text-[10px] text-slate-500">25%</span>
                                <span className="text-[10px] text-slate-500">50%</span>
                                <span className="text-[10px] text-slate-500">75%</span>
                                <span className="text-[10px] text-slate-500">100%</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-sm bg-blue-400"></span>
                                    <span className="text-slate-400">Revenue</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-sm bg-rose-400"></span>
                                    <span className="text-slate-400">Cost</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-sm bg-emerald-400"></span>
                                    <span className="text-slate-400">Profit</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Weekly Sales Chart */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Weekly Sales</h2>
                    <p className="text-xs text-gray-400 mb-6">Revenue overview for this week</p>
                    <div className="flex items-end gap-3 h-48">
                        {weekDays.map((day, i) => (
                            <div key={day} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-xs font-medium text-gray-600">₹{(weeklyData[i] / 1000).toFixed(1)}k</span>
                                <div className="w-full rounded-t-lg bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500 hover:from-blue-600 hover:to-blue-500" style={{ height: `${(weeklyData[i] / maxSale) * 100}%`, minHeight: '8px' }}></div>
                                <span className="text-xs text-gray-500">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Distribution */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Stock by Category</h2>
                    <p className="text-xs text-gray-400 mb-4">Medicine distribution</p>
                    <div className="space-y-3">
                        {[
                            { name: 'Antibiotic', count: 225, total: totalMedicines, color: 'bg-blue-500' },
                            { name: 'Painkiller', count: 355, total: totalMedicines, color: 'bg-orange-500' },
                            { name: 'Vitamin', count: 500, total: totalMedicines, color: 'bg-green-500' },
                            { name: 'Diabetes', count: 203, total: totalMedicines, color: 'bg-amber-500' },
                            { name: 'Gastro', count: 255, total: totalMedicines, color: 'bg-indigo-500' },
                            { name: 'Respiratory', count: 268, total: totalMedicines, color: 'bg-teal-500' },
                        ].map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600 font-medium">{cat.name}</span>
                                    <span className="text-gray-400">{cat.count}</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${cat.color} rounded-full transition-all duration-700`} style={{ width: `${(cat.count / 600) * 100}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Sales & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Sales */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">Recent Sales</h2>
                        <Link to="/sales" className="text-sm text-blue-600 hover:underline font-medium">View All →</Link>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {todaysSales.slice(0, 4).map((sale) => (
                            <div key={sale.id} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{sale.id}</p>
                                    <p className="text-xs text-gray-400">{sale.time} · {sale.customer}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-900">₹{sale.total.toLocaleString('en-IN')}</p>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${sale.payment === 'Cash' ? 'bg-emerald-100 text-emerald-700' : sale.payment === 'UPI' ? 'bg-violet-100 text-violet-700' : 'bg-blue-100 text-blue-700'}`}>{sale.payment}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alerts Panel */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900">⚠️ Alerts</h2>
                        {canEdit && <Link to="/notifications" className="text-sm text-blue-600 hover:underline font-medium">View All →</Link>}
                    </div>
                    <div className="divide-y divide-gray-50">
                        {alertMedicines.slice(0, 5).map((med, i) => (
                            <div key={i} className="px-6 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${med.severity === 'critical' ? 'bg-red-500' : med.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{med.name}</p>
                                        <p className="text-xs text-gray-400">{med.issue}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${med.severity === 'critical' ? 'bg-red-100 text-red-700' : med.severity === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                    Stock: {med.stock}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
