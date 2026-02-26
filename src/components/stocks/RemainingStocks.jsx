import React, { useState, useMemo } from 'react';
import { mockMedicines, mockCategories, getCategoryColor, getDaysUntilExpiry } from '../../data/mockData';
import Pagination from '../common/Pagination';
import Modal from '../common/Modal';

const RemainingStocks = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [viewMed, setViewMed] = useState(null);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const itemsPerPage = 10;

    // Summary calculations
    const totalMedicines = mockMedicines.length;
    const totalStock = mockMedicines.reduce((sum, m) => sum + m.stock, 0);
    const totalStockValue = mockMedicines.reduce((sum, m) => sum + m.stock * m.sellingPrice, 0);
    const lowStockCount = mockMedicines.filter((m) => m.stock > 0 && m.stock <= 10).length;
    const outOfStockCount = mockMedicines.filter((m) => m.stock === 0).length;
    const inStockCount = mockMedicines.filter((m) => m.stock > 10).length;
    const totalPurchaseValue = mockMedicines.reduce((sum, m) => sum + m.stock * m.purchasePrice, 0);

    const filtered = useMemo(() => {
        let result = [...mockMedicines];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (m) =>
                    m.name.toLowerCase().includes(term) ||
                    m.generic.toLowerCase().includes(term) ||
                    m.id.toLowerCase().includes(term) ||
                    m.batch.toLowerCase().includes(term)
            );
        }

        // Category filter
        if (categoryFilter) {
            result = result.filter((m) => m.category === categoryFilter);
        }

        // Stock filter
        if (stockFilter === 'out') result = result.filter((m) => m.stock === 0);
        else if (stockFilter === 'low') result = result.filter((m) => m.stock > 0 && m.stock <= 10);
        else if (stockFilter === 'medium') result = result.filter((m) => m.stock > 10 && m.stock <= 50);
        else if (stockFilter === 'good') result = result.filter((m) => m.stock > 50);

        // Sort
        result.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'stock':
                    comparison = a.stock - b.stock;
                    break;
                case 'value':
                    comparison = a.stock * a.sellingPrice - b.stock * b.sellingPrice;
                    break;
                case 'expiry':
                    comparison = new Date(a.expiry) - new Date(b.expiry);
                    break;
                case 'category':
                    comparison = a.category.localeCompare(b.category);
                    break;
                default:
                    comparison = 0;
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

        return result;
    }, [searchTerm, categoryFilter, stockFilter, sortBy, sortOrder]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getStockLevel = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50', percent: 0 };
        if (stock <= 10) return { label: 'Critical', color: 'bg-red-400', textColor: 'text-red-600', bgColor: 'bg-red-50', percent: (stock / 500) * 100 };
        if (stock <= 50) return { label: 'Low', color: 'bg-amber-400', textColor: 'text-amber-700', bgColor: 'bg-amber-50', percent: (stock / 500) * 100 };
        if (stock <= 200) return { label: 'Good', color: 'bg-emerald-400', textColor: 'text-emerald-700', bgColor: 'bg-emerald-50', percent: (stock / 500) * 100 };
        return { label: 'Excellent', color: 'bg-blue-400', textColor: 'text-blue-700', bgColor: 'bg-blue-50', percent: Math.min((stock / 500) * 100, 100) };
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const SortIcon = ({ field }) => (
        <span className="ml-1 opacity-50">
            {sortBy === field ? (sortOrder === 'asc' ? '↑' : '↓') : '↕'}
        </span>
    );

    // Category-wise stock summary
    const categoryStockSummary = useMemo(() => {
        const summary = {};
        mockMedicines.forEach((m) => {
            if (!summary[m.category]) summary[m.category] = { totalStock: 0, totalValue: 0, count: 0 };
            summary[m.category].totalStock += m.stock;
            summary[m.category].totalValue += m.stock * m.sellingPrice;
            summary[m.category].count += 1;
        });
        return Object.entries(summary)
            .map(([category, data]) => ({ category, ...data }))
            .sort((a, b) => b.totalValue - a.totalValue);
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Remaining Stocks</h1>
                    <p className="text-sm text-gray-500 mt-1">Complete overview of current stock levels and inventory value.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('table')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Table View"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:bg-gray-100'}`}
                        title="Card View"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                    { label: 'Total Medicines', value: totalMedicines, icon: '💊', accent: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' },
                    { label: 'Total Units', value: totalStock.toLocaleString(), icon: '📦', accent: 'border-indigo-200 bg-gradient-to-br from-indigo-50 to-white' },
                    { label: 'Stock Value', value: `₹${totalStockValue.toLocaleString()}`, icon: '💰', accent: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white' },
                    { label: 'In Stock', value: inStockCount, icon: '✅', accent: 'border-green-200 bg-gradient-to-br from-green-50 to-white' },
                    { label: 'Low Stock', value: lowStockCount, icon: '⚠️', accent: 'border-amber-200 bg-gradient-to-br from-amber-50 to-white' },
                    { label: 'Out of Stock', value: outOfStockCount, icon: '🚫', accent: 'border-red-200 bg-gradient-to-br from-red-50 to-white' },
                ].map((card) => (
                    <div key={card.label} className={`rounded-2xl border shadow-sm p-4 hover:shadow-md transition-shadow ${card.accent}`}>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-lg">{card.icon}</span>
                        </div>
                        <p className="text-xl font-bold text-gray-900">{card.value}</p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-0.5">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Stock by Category</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {categoryStockSummary.map((cat) => {
                        const catColor = getCategoryColor(cat.category);
                        return (
                            <div
                                key={cat.category}
                                className={`rounded-xl p-3 border cursor-pointer hover:shadow-md transition-all ${categoryFilter === cat.category ? 'ring-2 ring-blue-400 shadow-md' : ''
                                    }`}
                                style={{ borderColor: 'transparent' }}
                                onClick={() => {
                                    setCategoryFilter(categoryFilter === cat.category ? '' : cat.category);
                                    setCurrentPage(1);
                                }}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`w-2.5 h-2.5 rounded-full ${catColor.dot}`}></span>
                                    <span className="text-xs font-semibold text-gray-700">{cat.category}</span>
                                </div>
                                <p className="text-lg font-bold text-gray-900">{cat.totalStock} <span className="text-xs text-gray-400 font-normal">units</span></p>
                                <p className="text-xs text-gray-400">₹{cat.totalValue.toLocaleString()} value · {cat.count} items</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Main Table / Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name, generic, ID or batch..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        value={categoryFilter}
                        onChange={(e) => {
                            setCategoryFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                        <option value="">All Categories</option>
                        {mockCategories.map((c) => (
                            <option key={c.id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={stockFilter}
                        onChange={(e) => {
                            setStockFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                        <option value="">All Stock Levels</option>
                        <option value="out">Out of Stock (0)</option>
                        <option value="low">Critical (1–10)</option>
                        <option value="medium">Low (11–50)</option>
                        <option value="good">Good (50+)</option>
                    </select>
                    <div className="ml-auto text-xs text-gray-400">
                        Showing <span className="font-bold text-gray-600">{filtered.length}</span> of {totalMedicines} medicines
                    </div>
                </div>

                {viewMode === 'table' ? (
                    // TABLE VIEW
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50/80 border-b border-gray-100">
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('name')}>
                                        Medicine <SortIcon field="name" />
                                    </th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('category')}>
                                        Category <SortIcon field="category" />
                                    </th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Batch</th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('stock')}>
                                        Stock Level <SortIcon field="stock" />
                                    </th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('value')}>
                                        Value <SortIcon field="value" />
                                    </th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer select-none hover:text-gray-700" onClick={() => handleSort('expiry')}>
                                        Expiry <SortIcon field="expiry" />
                                    </th>
                                    <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {paginated.map((med) => {
                                    const stockInfo = getStockLevel(med.stock);
                                    const catColor = getCategoryColor(med.category);
                                    const daysLeft = getDaysUntilExpiry(med.expiry);
                                    return (
                                        <tr key={med.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-5 py-3.5 text-sm font-mono text-gray-400">{med.id}</td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-sm font-semibold text-gray-900">{med.name}</p>
                                                <p className="text-xs text-gray-400">{med.generic}</p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${catColor.bg} ${catColor.text}`}>{med.category}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-sm text-gray-500 font-mono">{med.batch}</td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3 min-w-[160px]">
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <span className={`text-xs font-bold ${stockInfo.textColor}`}>{med.stock} units</span>
                                                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${stockInfo.bgColor} ${stockInfo.textColor}`}>{stockInfo.label}</span>
                                                        </div>
                                                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full ${stockInfo.color} transition-all`}
                                                                style={{ width: `${Math.min(stockInfo.percent, 100)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <p className="text-sm font-bold text-gray-900">₹{(med.stock * med.sellingPrice).toLocaleString()}</p>
                                                <p className="text-xs text-gray-400">@ ₹{med.sellingPrice}/unit</p>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-sm ${daysLeft <= 30 ? 'text-red-600 font-bold' : daysLeft <= 90 ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                                                    {med.expiry}
                                                </span>
                                                {daysLeft <= 90 && <p className="text-[10px] text-red-400 mt-0.5">{daysLeft <= 0 ? 'Expired' : `${daysLeft}d left`}</p>}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <button
                                                    onClick={() => setViewMed(med)}
                                                    className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                                                    title="View Details"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {paginated.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="px-6 py-16 text-center text-gray-400">
                                            <p className="font-medium">No medicines match your filters</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    // GRID/CARD VIEW
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {paginated.map((med) => {
                            const stockInfo = getStockLevel(med.stock);
                            const catColor = getCategoryColor(med.category);
                            const daysLeft = getDaysUntilExpiry(med.expiry);
                            return (
                                <div
                                    key={med.id}
                                    className="border border-gray-100 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer hover:border-blue-200 group"
                                    onClick={() => setViewMed(med)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">{med.name}</p>
                                            <p className="text-xs text-gray-400">{med.generic}</p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${catColor.bg} ${catColor.text}`}>{med.category}</span>
                                    </div>
                                    <div className="mb-3">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={`text-lg font-bold ${stockInfo.textColor}`}>{med.stock}</span>
                                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stockInfo.bgColor} ${stockInfo.textColor}`}>{stockInfo.label}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${stockInfo.color} transition-all`}
                                                style={{ width: `${Math.min(stockInfo.percent, 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span>₹{(med.stock * med.sellingPrice).toLocaleString()}</span>
                                        <span className={daysLeft <= 30 ? 'text-red-500 font-bold' : ''}>
                                            {daysLeft <= 0 ? 'Expired' : `Exp: ${med.expiry}`}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                        {paginated.length === 0 && (
                            <div className="col-span-full py-16 text-center text-gray-400">
                                <p className="font-medium">No medicines match your filters</p>
                            </div>
                        )}
                    </div>
                )}

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>

            {/* Profit Overview */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Inventory Value Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                        <p className="text-xs text-blue-500 font-medium uppercase tracking-wider">Total Purchase Value</p>
                        <p className="text-2xl font-bold text-blue-800 mt-1">₹{totalPurchaseValue.toLocaleString()}</p>
                        <p className="text-xs text-blue-400 mt-1">Cost price of total stock</p>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                        <p className="text-xs text-emerald-500 font-medium uppercase tracking-wider">Total Selling Value</p>
                        <p className="text-2xl font-bold text-emerald-800 mt-1">₹{totalStockValue.toLocaleString()}</p>
                        <p className="text-xs text-emerald-400 mt-1">Selling price of total stock</p>
                    </div>
                    <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                        <p className="text-xs text-violet-500 font-medium uppercase tracking-wider">Potential Profit</p>
                        <p className="text-2xl font-bold text-violet-800 mt-1">₹{(totalStockValue - totalPurchaseValue).toLocaleString()}</p>
                        <p className="text-xs text-violet-400 mt-1">
                            Margin: {((((totalStockValue - totalPurchaseValue) / totalPurchaseValue) * 100) || 0).toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>

            {/* View Detail Modal */}
            <Modal isOpen={!!viewMed} onClose={() => setViewMed(null)} title="Medicine Stock Details" size="md">
                {viewMed && (() => {
                    const stockInfo = getStockLevel(viewMed.stock);
                    const catColor = getCategoryColor(viewMed.category);
                    const daysLeft = getDaysUntilExpiry(viewMed.expiry);
                    return (
                        <div className="space-y-5">
                            <div className="flex items-start gap-4">
                                <div className={`w-14 h-14 rounded-2xl ${catColor.bg} flex items-center justify-center`}>
                                    <span className="text-2xl">💊</span>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">{viewMed.name}</h3>
                                    <p className="text-sm text-gray-400">{viewMed.generic}</p>
                                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${catColor.bg} ${catColor.text}`}>{viewMed.category}</span>
                                </div>
                            </div>

                            {/* Stock Bar */}
                            <div className={`rounded-xl p-4 ${stockInfo.bgColor} border`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-sm font-bold ${stockInfo.textColor}`}>Current Stock: {viewMed.stock} units</span>
                                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stockInfo.bgColor} ${stockInfo.textColor} border`}>{stockInfo.label}</span>
                                </div>
                                <div className="w-full bg-white/60 rounded-full h-3">
                                    <div className={`h-3 rounded-full ${stockInfo.color} transition-all`} style={{ width: `${Math.min(stockInfo.percent, 100)}%` }}></div>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: 'Medicine ID', value: viewMed.id },
                                    { label: 'Batch Number', value: viewMed.batch },
                                    { label: 'Purchase Price', value: `₹${viewMed.purchasePrice}` },
                                    { label: 'Selling Price', value: `₹${viewMed.sellingPrice}` },
                                    { label: 'Total Stock Value', value: `₹${(viewMed.stock * viewMed.sellingPrice).toLocaleString()}` },
                                    { label: 'Profit per Unit', value: `₹${viewMed.sellingPrice - viewMed.purchasePrice}` },
                                    { label: 'Expiry Date', value: viewMed.expiry, highlight: daysLeft <= 30 },
                                    { label: 'Days Until Expiry', value: daysLeft <= 0 ? 'Expired' : `${daysLeft} days`, highlight: daysLeft <= 30 },
                                ].map((info) => (
                                    <div key={info.label} className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{info.label}</p>
                                        <p className={`text-sm font-semibold mt-0.5 ${info.highlight ? 'text-red-600' : 'text-gray-800'}`}>{info.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default RemainingStocks;
