import React, { useState } from 'react';
import { mockMedicines, mockCategories, mockSuppliers, getCategoryColor, getDaysUntilExpiry } from '../../data/mockData';
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

    // Form state
    const emptyForm = { name: '', generic: '', category: '', batch: '', supplier: '', purchasePrice: '', sellingPrice: '', stock: '', expiry: '' };
    const [formData, setFormData] = useState(emptyForm);

    // Filters
    const filtered = medicines.filter((m) => {
        const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || m.generic.toLowerCase().includes(searchTerm.toLowerCase());
        const matchCategory = !categoryFilter || m.category === categoryFilter;
        const matchStock = !stockFilter ||
            (stockFilter === 'out' && m.stock === 0) ||
            (stockFilter === 'low' && m.stock > 0 && m.stock <= 10) ||
            (stockFilter === 'ok' && m.stock > 10);
        return matchSearch && matchCategory && matchStock;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const openAdd = () => { setFormData(emptyForm); setEditingMed(null); setShowForm(true); };
    const openEdit = (med) => {
        setFormData({ name: med.name, generic: med.generic, category: med.category, batch: med.batch, supplier: med.supplier, purchasePrice: med.purchasePrice, sellingPrice: med.sellingPrice, stock: med.stock, expiry: med.expiry });
        setEditingMed(med); setShowForm(true);
    };

    const handleSave = () => {
        if (!formData.name || !formData.generic || !formData.category) {
            toast.warning('Please fill in required fields'); return;
        }
        if (editingMed) {
            setMedicines(medicines.map((m) => m.id === editingMed.id ? { ...m, ...formData, purchasePrice: +formData.purchasePrice, sellingPrice: +formData.sellingPrice, stock: +formData.stock } : m));
            toast.success(`${formData.name} updated successfully!`);
        } else {
            const newId = `M${String(medicines.length + 1).padStart(3, '0')}`;
            setMedicines([...medicines, { id: newId, ...formData, purchasePrice: +formData.purchasePrice, sellingPrice: +formData.sellingPrice, stock: +formData.stock, addedDate: new Date().toISOString().split('T')[0] }]);
            toast.success(`${formData.name} added successfully!`);
        }
        setShowForm(false);
    };

    const handleDelete = () => {
        setMedicines(medicines.filter((m) => m.id !== deleteTarget.id));
        toast.success(`${deleteTarget.name} deleted!`);
        setDeleteTarget(null);
    };

    const getStockBadge = (stock) => {
        if (stock === 0) return <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-red-100 text-red-700">Out of Stock</span>;
        if (stock <= 10) return <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-amber-100 text-amber-700">{stock} left</span>;
        return <span className="text-sm font-bold text-emerald-600">{stock}</span>;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your complete medicine stock.</p>
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
                        <option value="low">Low Stock (≤10)</option>
                        <option value="ok">In Stock</option>
                    </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                {['ID', 'Name', 'Category', 'Batch', 'Stock', 'Price', 'Expiry', 'Actions'].map((h) => (
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
                                            <p className="text-xs text-gray-400">{med.generic}</p>
                                        </td>
                                        <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${catColor.bg} ${catColor.text}`}>{med.category}</span></td>
                                        <td className="px-5 py-3.5 text-sm text-gray-500 font-mono">{med.batch}</td>
                                        <td className="px-5 py-3.5">{getStockBadge(med.stock)}</td>
                                        <td className="px-5 py-3.5 text-sm font-medium text-gray-700">₹{med.sellingPrice}</td>
                                        <td className="px-5 py-3.5">
                                            <span className={`text-sm ${daysLeft <= 30 ? 'text-red-600 font-bold' : daysLeft <= 90 ? 'text-amber-600' : 'text-gray-500'}`}>{med.expiry}</span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            {canEdit && (
                                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => openEdit(med)} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors" title="Edit">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                    </button>
                                                    <button onClick={() => setDeleteTarget(med)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors" title="Delete">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                    </button>
                                                </div>
                                            )}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'Medicine Name *', key: 'name', type: 'text', placeholder: 'e.g., Amoxicillin 500mg' },
                        { label: 'Generic Name *', key: 'generic', type: 'text', placeholder: 'e.g., Amoxicillin' },
                        { label: 'Category *', key: 'category', type: 'select', options: mockCategories.map((c) => c.name) },
                        { label: 'Batch Number', key: 'batch', type: 'text', placeholder: 'e.g., BT-2024-001' },
                        { label: 'Supplier', key: 'supplier', type: 'select', options: mockSuppliers.map((s) => s.id), labels: mockSuppliers.map((s) => s.name) },
                        { label: 'Purchase Price (₹)', key: 'purchasePrice', type: 'number', placeholder: '0.00' },
                        { label: 'Selling Price (₹)', key: 'sellingPrice', type: 'number', placeholder: '0.00' },
                        { label: 'Stock Quantity', key: 'stock', type: 'number', placeholder: '0' },
                        { label: 'Expiry Date', key: 'expiry', type: 'date' },
                    ].map((field) => (
                        <div key={field.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                            {field.type === 'select' ? (
                                <select value={formData[field.key]} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400">
                                    <option value="">Select...</option>
                                    {(field.options || []).map((opt, i) => <option key={opt} value={opt}>{field.labels ? field.labels[i] : opt}</option>)}
                                </select>
                            ) : (
                                <input type={field.type} value={formData[field.key]} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} placeholder={field.placeholder} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
                            )}
                        </div>
                    ))}
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
