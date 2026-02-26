import React, { useState } from 'react';
import { mockMedicines, mockCategories, mockSuppliers, getCategoryColor, getDaysUntilExpiry, getStockDisplay } from '../../data/mockData';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import Pagination from '../common/Pagination';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const Inventory = () => {
    const [medicines, setMedicines] = useState([...mockMedicines]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [stockFilter, setStockFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showForm, setShowForm] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const itemsPerPage = 8;
    const toast = useToast();
    const { user } = useAuth();
    const canEdit = user?.role !== 'Pharmacist';

    // Form state — includes tablet-specific fields
    const emptyForm = {
        name: '', generic: '', category: '', batch: '', supplier: '',
        purchasePrice: '', sellingPrice: '', stock: '', expiry: '',
        medicineType: 'Tablet', tabletsPerStrip: '10', stripPrice: '', looseTabletPrice: '',
        allowLooseSale: true, lowStockThreshold: '20',
    };
    const [formData, setFormData] = useState(emptyForm);

    // Filters
    const filtered = medicines.filter((m) => {
        const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.generic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = !categoryFilter || m.category === categoryFilter;
        const matchStock = !stockFilter ||
            (stockFilter === 'out' && m.stock === 0) ||
            (stockFilter === 'low' && m.stock > 0 && m.stock <= (m.lowStockThreshold || 10)) ||
            (stockFilter === 'ok' && m.stock > (m.lowStockThreshold || 10));
        return matchSearch && matchCategory && matchStock;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const openAdd = () => { setFormData(emptyForm); setEditingMed(null); setShowForm(true); };
    const openEdit = (med) => {
        setFormData({
            name: med.name, generic: med.generic, category: med.category, batch: med.batch,
            supplier: med.supplier, purchasePrice: med.purchasePrice, sellingPrice: med.sellingPrice,
            stock: med.stock, expiry: med.expiry,
            medicineType: med.medicineType || 'Tablet',
            tabletsPerStrip: med.tabletsPerStrip || 10,
            stripPrice: med.stripPrice || med.sellingPrice,
            looseTabletPrice: med.looseTabletPrice || '',
            allowLooseSale: med.allowLooseSale !== undefined ? med.allowLooseSale : true,
            lowStockThreshold: med.lowStockThreshold || 20,
        });
        setEditingMed(med); setShowForm(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.generic || !formData.category) {
            toast.warning('Please fill in required fields'); return;
        }
        if (formData.medicineType === 'Tablet' && (!formData.tabletsPerStrip || +formData.tabletsPerStrip < 1)) {
            toast.warning('Tablets Per Strip must be at least 1'); return;
        }
        if (formData.medicineType === 'Tablet' && !formData.stripPrice) {
            toast.warning('Strip Selling Price is required'); return;
        }
        if (formData.allowLooseSale && formData.medicineType === 'Tablet' && !formData.looseTabletPrice) {
            toast.warning('Loose Tablet Price is required when loose sale is allowed'); return;
        }

        const medData = {
            ...formData,
            purchasePrice: +formData.purchasePrice,
            sellingPrice: +formData.stripPrice || +formData.sellingPrice,
            stock: +formData.stock,
            tabletsPerStrip: +formData.tabletsPerStrip,
            stripPrice: +formData.stripPrice || +formData.sellingPrice,
            looseTabletPrice: +formData.looseTabletPrice || 0,
            lowStockThreshold: +formData.lowStockThreshold || 20,
        };

        if (editingMed) {
            setMedicines(medicines.map((m) => m.id === editingMed.id ? { ...m, ...medData } : m));
            toast.success(`${formData.name} updated successfully!`);
        } else {
            const newId = `M${String(medicines.length + 1).padStart(3, '0')}`;
            setMedicines([...medicines, { id: newId, ...medData, addedDate: new Date().toISOString().split('T')[0] }]);
            toast.success(`${formData.name} added successfully!`);
        }
        setShowForm(false);
    };

    const handleDelete = () => {
        setMedicines(medicines.filter((m) => m.id !== deleteTarget.id));
        toast.success(`${deleteTarget.name} deleted!`);
        setDeleteTarget(null);
    };

    // ──── Print Helpers ────
    const buildPrintStyles = () => `
        <style>
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 24px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; }
            .header h1 { font-size: 20px; color: #1e40af; }
            .header .meta { font-size: 11px; color: #64748b; text-align: right; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #f1f5f9; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px; padding: 8px 10px; text-align: left; border-bottom: 2px solid #e2e8f0; }
            td { padding: 7px 10px; border-bottom: 1px solid #f1f5f9; }
            tr:nth-child(even) { background: #f8fafc; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 6px; font-size: 10px; font-weight: 700; }
            .badge-ok { background: #dcfce7; color: #15803d; }
            .badge-low { background: #fef3c7; color: #b45309; }
            .badge-out { background: #fee2e2; color: #dc2626; }
            .summary { margin-top: 20px; border-top: 2px solid #e2e8f0; padding-top: 14px; }
            .summary h3 { font-size: 14px; margin-bottom: 8px; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
            .summary-card { padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
            .summary-card .val { font-size: 18px; font-weight: 800; }
            .summary-card .lbl { font-size: 10px; color: #64748b; margin-top: 2px; }
            .cat-table { margin-top: 12px; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
    `;

    const getStockClass = (med) => {
        if (med.stock === 0) return 'badge-out';
        if (med.stock <= (med.lowStockThreshold || 10)) return 'badge-low';
        return 'badge-ok';
    };
    const getStockLabel = (med) => {
        if (med.stock === 0) return 'Out of Stock';
        if (med.stock <= (med.lowStockThreshold || 10)) return 'Low Stock';
        return 'In Stock';
    };

    const buildMedRow = (med) => {
        const isTab = med.medicineType === 'Tablet' && med.tabletsPerStrip > 1;
        const stockInfo = isTab
            ? `${med.stock} tablets<br><span style="font-size:9px;color:#94a3b8">${Math.floor(med.stock / med.tabletsPerStrip)} strips + ${med.stock % med.tabletsPerStrip} loose</span>`
            : `${med.stock} units`;
        return `<tr>
            <td>${med.id}</td>
            <td><strong>${med.name}</strong><br><span style="font-size:10px;color:#94a3b8">${med.generic}</span></td>
            <td>${med.medicineType || 'Tablet'}${isTab ? `<br><span style="font-size:9px;color:#94a3b8">${med.tabletsPerStrip}/strip</span>` : ''}</td>
            <td>${med.category}</td>
            <td>${med.batch || '—'}</td>
            <td>${stockInfo} <span class="badge ${getStockClass(med)}">${getStockLabel(med)}</span></td>
            <td>₹${med.stripPrice || med.sellingPrice}${med.allowLooseSale && med.looseTabletPrice ? `<br><span style="font-size:9px;color:#94a3b8">₹${med.looseTabletPrice}/tablet</span>` : ''}</td>
            <td style="${getDaysUntilExpiry(med.expiry) <= 30 ? 'color:#dc2626;font-weight:700' : ''}">${med.expiry}</td>
        </tr>`;
    };

    const handlePrintSingle = (med) => {
        const win = window.open('', '_blank');
        win.document.write(`<html><head><title>Medicine — ${med.name}</title>${buildPrintStyles()}</head><body>
            <div class="header">
                <h1>💊 Medicine Details</h1>
                <div class="meta">Printed: ${new Date().toLocaleString('en-IN')}<br>PharmaCare Management System</div>
            </div>
            <table>
                <thead><tr>${['ID', 'Name', 'Type', 'Category', 'Batch', 'Stock', 'Price', 'Expiry'].map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${buildMedRow(med)}</tbody>
            </table>
            <div class="footer">Generated by PharmaCare Management System</div>
        </body></html>`);
        win.document.close();
        win.focus();
        win.print();
    };

    const handlePrintAll = () => {
        const data = filtered; // print whatever is currently filtered

        // Category summary
        const catMap = {};
        data.forEach((m) => {
            if (!catMap[m.category]) catMap[m.category] = { count: 0, totalStock: 0, value: 0 };
            catMap[m.category].count++;
            catMap[m.category].totalStock += m.stock;
            catMap[m.category].value += m.stock * (m.looseTabletPrice || m.sellingPrice || 0);
        });
        const catRows = Object.entries(catMap).map(([cat, d]) =>
            `<tr><td><strong>${cat}</strong></td><td>${d.count}</td><td>${d.totalStock.toLocaleString('en-IN')}</td><td>₹${d.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>`
        ).join('');

        // Stock summary
        const totalStock = data.reduce((s, m) => s + m.stock, 0);
        const outOfStock = data.filter(m => m.stock === 0).length;
        const lowStock = data.filter(m => m.stock > 0 && m.stock <= (m.lowStockThreshold || 10)).length;
        const inStock = data.filter(m => m.stock > (m.lowStockThreshold || 10)).length;
        const totalValue = data.reduce((s, m) => s + m.stock * (m.looseTabletPrice || m.sellingPrice || 0), 0);

        const win = window.open('', '_blank');
        win.document.write(`<html><head><title>All Medicines Report</title>${buildPrintStyles()}</head><body>
            <div class="header">
                <h1>💊 Medicine Inventory Report</h1>
                <div class="meta">Total: ${data.length} medicines · ${totalStock.toLocaleString('en-IN')} units<br>Printed: ${new Date().toLocaleString('en-IN')}<br>PharmaCare Management System</div>
            </div>

            <!-- Stock Voice Summary -->
            <div class="summary-grid" style="margin-bottom:16px">
                <div class="summary-card" style="background:#dcfce7"><div class="val" style="color:#15803d">${inStock}</div><div class="lbl">In Stock</div></div>
                <div class="summary-card" style="background:#fef3c7"><div class="val" style="color:#b45309">${lowStock}</div><div class="lbl">Low Stock</div></div>
                <div class="summary-card" style="background:#fee2e2"><div class="val" style="color:#dc2626">${outOfStock}</div><div class="lbl">Out of Stock</div></div>
            </div>

            <!-- All Medicines Table -->
            <table>
                <thead><tr>${['ID', 'Name', 'Type', 'Category', 'Batch', 'Stock', 'Price', 'Expiry'].map(h => `<th>${h}</th>`).join('')}</tr></thead>
                <tbody>${data.map(m => buildMedRow(m)).join('')}</tbody>
            </table>

            <!-- Category Voice Summary -->
            <div class="summary">
                <h3>📊 Category-Wise Summary</h3>
                <table class="cat-table">
                    <thead><tr><th>Category</th><th>Medicines</th><th>Total Stock</th><th>Stock Value</th></tr></thead>
                    <tbody>${catRows}
                        <tr style="font-weight:700;border-top:2px solid #cbd5e1">
                            <td>Total</td><td>${data.length}</td><td>${totalStock.toLocaleString('en-IN')}</td><td>₹${totalValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="footer">Generated by PharmaCare Management System</div>
        </body></html>`);
        win.document.close();
        win.focus();
        win.print();
    };

    const getStockBadge = (med) => {
        const stock = med.stock;
        const threshold = med.lowStockThreshold || 10;
        const isTablet = med.medicineType === 'Tablet' && med.tabletsPerStrip > 1;
        const stockDisplay = isTablet ? getStockDisplay(stock, med.tabletsPerStrip) : null;

        if (stock === 0) return <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-red-100 text-red-700">Out of Stock</span>;
        if (stock <= threshold) return (
            <div>
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-700">{stock} tablets</span>
                {isTablet && <p className="text-[10px] text-gray-400 mt-0.5">{stockDisplay?.strips}s + {stockDisplay?.loose}t</p>}
            </div>
        );
        return (
            <div>
                <span className="text-sm font-bold text-emerald-600">{stock} {isTablet ? 'tablets' : 'units'}</span>
                {isTablet && <p className="text-[10px] text-gray-400 mt-0.5">{stockDisplay?.strips} strips + {stockDisplay?.loose} loose</p>}
            </div>
        );
    };

    const isTabletType = formData.medicineType === 'Tablet';

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your complete medicine stock. <span className="text-blue-500 font-medium">Stock is stored in tablets.</span></p>
                </div>
                {canEdit && (
                    <button onClick={openAdd} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-blue-500/20 transition-all active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Medicine
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <input type="text" placeholder="Search medicines..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                        <option value="">All Categories</option>
                        {mockCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <select value={stockFilter} onChange={(e) => { setStockFilter(e.target.value); setCurrentPage(1); }} className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                        <option value="">All Stock</option>
                        <option value="out">Out of Stock</option>
                        <option value="low">Low Stock</option>
                        <option value="ok">In Stock</option>
                    </select>
                    <button onClick={handlePrintAll} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95 ml-auto">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print All
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                {['ID', 'Name', 'Type', 'Category', 'Stock (Tablets)', 'Strip Price', 'Expiry', 'Actions'].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginated.map((med) => {
                                const catColor = getCategoryColor(med.category);
                                const daysLeft = getDaysUntilExpiry(med.expiry);
                                return (
                                    <tr key={med.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="px-5 py-3.5 text-sm font-mono text-gray-400">{med.id}</td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-semibold text-gray-900">{med.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-xs text-gray-400">{med.generic}</p>
                                                {med.allowLooseSale && med.medicineType === 'Tablet' && (
                                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-violet-100 text-violet-600">Loose Sale</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${med.medicineType === 'Tablet' ? 'bg-cyan-50 text-cyan-700' : med.medicineType === 'Syrup' ? 'bg-pink-50 text-pink-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {med.medicineType || 'Tablet'}
                                            </span>
                                            {med.medicineType === 'Tablet' && med.tabletsPerStrip > 1 && (
                                                <p className="text-[10px] text-gray-400 mt-0.5">{med.tabletsPerStrip}/strip</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${catColor.bg} ${catColor.text}`}>{med.category}</span></td>
                                        <td className="px-5 py-3.5">{getStockBadge(med)}</td>
                                        <td className="px-5 py-3.5">
                                            <p className="text-sm font-medium text-gray-700">₹{med.stripPrice || med.sellingPrice}</p>
                                            {med.allowLooseSale && med.looseTabletPrice > 0 && (
                                                <p className="text-[10px] text-gray-400">₹{med.looseTabletPrice}/tablet</p>
                                            )}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-sm ${daysLeft <= 30 ? 'text-red-600 font-bold' : daysLeft <= 90 ? 'text-amber-600' : 'text-gray-500'}`}>{med.expiry}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handlePrintSingle(med)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors" title="Print">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                                </button>
                                                {canEdit && (
                                                    <>
                                                        <button onClick={() => openEdit(med)} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors" title="Edit">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        </button>
                                                        <button onClick={() => setDeleteTarget(med)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors" title="Delete">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {paginated.length === 0 && (
                                <tr><td colSpan="8" className="px-6 py-16 text-center text-gray-400"><p className="font-medium">No medicines found</p></td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>

            {/* Add / Edit Modal */}
            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingMed ? 'Edit Medicine' : 'Add New Medicine'} size="lg">
                <div className="space-y-5">
                    {/* Basic Info */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Basic Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Medicine Name *</label>
                                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Amoxicillin 500mg" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Generic Name *</label>
                                <input type="text" value={formData.generic} onChange={(e) => setFormData({ ...formData, generic: e.target.value })} placeholder="e.g., Amoxicillin" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                                    <option value="">Select...</option>
                                    {mockCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Medicine Type *</label>
                                <select value={formData.medicineType} onChange={(e) => setFormData({ ...formData, medicineType: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                                    <option value="Tablet">Tablet</option>
                                    <option value="Syrup">Syrup</option>
                                    <option value="Capsule">Capsule</option>
                                    <option value="Injection">Injection</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Tablet-Specific Fields */}
                    {isTabletType && (
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                Strip & Tablet Configuration
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Tablets Per Strip *</label>
                                    <input type="number" min="1" value={formData.tabletsPerStrip} onChange={(e) => setFormData({ ...formData, tabletsPerStrip: e.target.value })} placeholder="e.g., 10" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400" />
                                    <p className="text-[10px] text-gray-400 mt-1">Common: 10, 15, 20</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Strip Selling Price (₹) *</label>
                                    <input type="number" min="0" step="0.01" value={formData.stripPrice} onChange={(e) => setFormData({ ...formData, stripPrice: e.target.value })} placeholder="e.g., 150.00" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Loose Tablet Price (₹) {formData.allowLooseSale && '*'}
                                    </label>
                                    <input
                                        type="number" min="0" step="0.01"
                                        value={formData.looseTabletPrice}
                                        onChange={(e) => setFormData({ ...formData, looseTabletPrice: e.target.value })}
                                        placeholder="e.g., 16.00"
                                        disabled={!formData.allowLooseSale}
                                        className={`w-full px-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 ${!formData.allowLooseSale ? 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed' : 'border-gray-200'}`}
                                    />
                                </div>
                            </div>
                            {/* Allow Loose Sale Toggle */}
                            <div className="mt-4 flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.allowLooseSale}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            allowLooseSale: e.target.checked,
                                            looseTabletPrice: e.target.checked ? formData.looseTabletPrice : '',
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-violet-600"></div>
                                </label>
                                <div>
                                    <p className="text-sm font-semibold text-violet-800">Allow Loose Sale</p>
                                    <p className="text-xs text-violet-500">Enable selling individual tablets at POS</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pricing & Stock */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Pricing, Stock & Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Batch Number</label>
                                <input type="text" value={formData.batch} onChange={(e) => setFormData({ ...formData, batch: e.target.value })} placeholder="e.g., BT-2024-001" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier</label>
                                <select value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                                    <option value="">Select...</option>
                                    {mockSuppliers.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Purchase Price (₹)</label>
                                <input type="number" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} placeholder="0.00" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Stock (in Tablets) {isTabletType ? '' : '/ Units'}
                                </label>
                                <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} placeholder="0" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                                {isTabletType && +formData.stock > 0 && +formData.tabletsPerStrip > 0 && (
                                    <p className="text-[10px] text-blue-500 mt-1 font-medium">
                                        = {Math.floor(+formData.stock / +formData.tabletsPerStrip)} strips + {+formData.stock % +formData.tabletsPerStrip} loose tablets
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Low Stock Threshold (tablets)</label>
                                <input type="number" min="1" value={formData.lowStockThreshold} onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })} placeholder="20" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date</label>
                                <input type="date" value={formData.expiry} onChange={(e) => setFormData({ ...formData, expiry: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors">{editingMed ? 'Update Medicine' : 'Add Medicine'}</button>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Medicine" message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`} />
        </div>
    );
};

export default Inventory;
