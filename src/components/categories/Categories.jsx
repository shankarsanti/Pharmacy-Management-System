import React, { useState } from 'react';
import { mockCategories, mockMedicines } from '../../data/mockData';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const Categories = () => {
    const [categories, setCategories] = useState([...mockCategories]);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const toast = useToast();
    const { user } = useAuth();
    const canEdit = user?.role !== 'Pharmacist';

    const colorMap = { blue: 'from-blue-500 to-blue-600', orange: 'from-orange-500 to-orange-600', amber: 'from-amber-500 to-amber-600', teal: 'from-teal-500 to-teal-600', indigo: 'from-indigo-500 to-indigo-600', green: 'from-green-500 to-green-600', rose: 'from-rose-500 to-rose-600', purple: 'from-purple-500 to-purple-600' };
    const bgMap = { blue: 'bg-blue-50 text-blue-700', orange: 'bg-orange-50 text-orange-700', amber: 'bg-amber-50 text-amber-700', teal: 'bg-teal-50 text-teal-700', indigo: 'bg-indigo-50 text-indigo-700', green: 'bg-green-50 text-green-700', rose: 'bg-rose-50 text-rose-700', purple: 'bg-purple-50 text-purple-700' };
    const colors = ['blue', 'orange', 'amber', 'teal', 'indigo', 'green', 'rose', 'purple'];

    const openAdd = () => { setFormData({ name: '', description: '' }); setEditing(null); setShowForm(true); };
    const openEdit = (cat) => { setFormData({ name: cat.name, description: cat.description }); setEditing(cat); setShowForm(true); };

    const handleSave = () => {
        if (!formData.name) { toast.warning('Category name is required'); return; }
        if (editing) {
            setCategories(categories.map((c) => c.id === editing.id ? { ...c, ...formData } : c));
            toast.success(`${formData.name} updated!`);
        } else {
            const newCat = { id: `C${String(categories.length + 1).padStart(3, '0')}`, ...formData, count: 0, color: colors[categories.length % colors.length] };
            setCategories([...categories, newCat]);
            toast.success(`${formData.name} added!`);
        }
        setShowForm(false);
    };

    const handleDelete = () => {
        setCategories(categories.filter((c) => c.id !== deleteTarget.id));
        toast.success(`${deleteTarget.name} deleted!`);
        setDeleteTarget(null);
    };

    const getMedicineCount = (catName) => mockMedicines.filter((m) => m.category === catName).length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Organize medicines by categories.</p>
                </div>
                {canEdit && (
                    <button onClick={openAdd} className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-violet-500/20 transition-all active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Category
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {categories.map((cat) => {
                    const medCount = getMedicineCount(cat.name);
                    return (
                        <div key={cat.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all group">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[cat.color] || 'from-gray-500 to-gray-600'} flex items-center justify-center shadow-lg`}>
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                                </div>
                                {canEdit && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(cat)} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                        <button onClick={() => setDeleteTarget(cat)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">{cat.name}</h3>
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{cat.description}</p>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${bgMap[cat.color] || 'bg-gray-100 text-gray-700'}`}>{medCount} medicines</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Category' : 'Add Category'} size="sm">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category Name *</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Antibiotic" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                        <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" placeholder="Brief description..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium shadow-sm">{editing ? 'Update' : 'Add Category'}</button>
                </div>
            </Modal>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Category" message={`Delete "${deleteTarget?.name}"? Medicines in this category won't be affected.`} />
        </div>
    );
};

export default Categories;
