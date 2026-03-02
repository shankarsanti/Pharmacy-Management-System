import React, { useState } from 'react';
import { mockSuppliers, mockMedicines } from '../../data/mockData';
import Modal from '../common/Modal';
import ConfirmDialog from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([...mockSuppliers]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [detailSupplier, setDetailSupplier] = useState(null);
    const emptyForm = { name: '', contact: '', phone: '', email: '', address: '', company: '', status: 'Active' };
    const [formData, setFormData] = useState(emptyForm);
    const toast = useToast();
    const { user } = useAuth();
    const canEdit = user?.role !== 'Pharmacist';

    const filtered = suppliers.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.contact.toLowerCase().includes(searchTerm.toLowerCase()));

    const statusStyles = { Active: 'bg-emerald-100 text-emerald-700', Inactive: 'bg-gray-100 text-gray-500', Pending: 'bg-amber-100 text-amber-700' };

    const openAdd = () => { setFormData(emptyForm); setEditing(null); setShowForm(true); };
    const openEdit = (s) => { setFormData({ name: s.name, contact: s.contact, phone: s.phone, email: s.email, address: s.address, company: s.company, status: s.status }); setEditing(s); setShowForm(true); };

    const handleSave = () => {
        if (!formData.name || !formData.contact) { toast.warning('Please fill required fields'); return; }
        if (editing) {
            setSuppliers(suppliers.map((s) => s.id === editing.id ? { ...s, ...formData } : s));
            toast.success(`${formData.name} updated!`);
        } else {
            setSuppliers([...suppliers, { id: `S${String(suppliers.length + 1).padStart(3, '0')}`, ...formData, lastOrder: '-', totalOrders: 0 }]);
            toast.success(`${formData.name} added!`);
        }
        setShowForm(false);
    };

    const handleDelete = () => {
        setSuppliers(suppliers.filter((s) => s.id !== deleteTarget.id));
        toast.success(`${deleteTarget.name} deleted!`);
        setDeleteTarget(null);
    };

    const getSuppliedMedicines = (supplierId) => mockMedicines.filter((m) => m.supplier === supplierId);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Supplier Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your medicine suppliers and track orders.</p>
                </div>
                {canEdit && (
                    <button onClick={openAdd} className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md transition-all active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        Add Supplier
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="relative w-full max-w-md">
                        <input type="text" placeholder="Search suppliers..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-50/80 border-b border-gray-100">
                            {['ID', 'Company', 'Contact', 'Phone', 'Email', 'Status', 'Orders', 'Actions'].map((h) => <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((s) => (
                                <tr key={s.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-5 py-3.5 text-sm font-mono text-gray-400">{s.id}</td>
                                    <td className="px-5 py-3.5">
                                        <button onClick={() => setDetailSupplier(s)} className="text-sm font-semibold text-gray-900 hover:text-blue-600">{s.name}</button>
                                        <p className="text-xs text-gray-400">{s.company}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{s.contact}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{s.phone}</td>
                                    <td className="px-5 py-3.5 text-sm text-blue-600">{s.email}</td>
                                    <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${statusStyles[s.status]}`}>{s.status}</span></td>
                                    <td className="px-5 py-3.5 text-sm font-medium text-gray-700">{s.totalOrders}</td>
                                    <td className="px-5 py-3.5">
                                        {canEdit && (
                                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                                                <button onClick={() => setDeleteTarget(s)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-600"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 text-sm text-gray-500">Showing {filtered.length} of {suppliers.length} suppliers</div>
            </div>

            {/* Supplier Detail Modal */}
            <Modal isOpen={!!detailSupplier} onClose={() => setDetailSupplier(null)} title={`Supplier: ${detailSupplier?.name}`} size="lg">
                {detailSupplier && (
                    <div>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {[['Contact', detailSupplier.contact], ['Phone', detailSupplier.phone], ['Email', detailSupplier.email], ['Address', detailSupplier.address], ['Status', detailSupplier.status], ['Last Order', detailSupplier.lastOrder]].map(([l, v]) => (
                                <div key={l}><p className="text-xs text-gray-400 font-medium">{l}</p><p className="text-sm font-semibold text-gray-900">{v}</p></div>
                            ))}
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-3">Supplied Medicines</h3>
                        <div className="space-y-2">
                            {getSuppliedMedicines(detailSupplier.id).map((m) => (
                                <div key={m.id} className="flex justify-between items-center px-4 py-2.5 bg-gray-50 rounded-xl">
                                    <div><p className="text-sm font-medium text-gray-900">{m.name}</p><p className="text-xs text-gray-400">{m.generic}</p></div>
                                    <span className="text-sm font-semibold text-gray-700">₹{m.sellingPrice}</span>
                                </div>
                            ))}
                            {getSuppliedMedicines(detailSupplier.id).length === 0 && <p className="text-sm text-gray-400 text-center py-4">No medicines from this supplier</p>}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Add/Edit Form Modal */}
            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Supplier' : 'Add Supplier'} size="lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'Company Name *', key: 'name', placeholder: 'e.g., MedPharma Pvt Ltd' },
                        { label: 'Contact Person *', key: 'contact', placeholder: 'e.g., Rajesh Kumar' },
                        { label: 'Phone', key: 'phone', placeholder: '+91 98765 43210' },
                        { label: 'Email', key: 'email', placeholder: 'email@company.com' },
                        { label: 'Company', key: 'company', placeholder: 'Company brand name' },
                    ].map((f) => (
                        <div key={f.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                            <input type="text" value={formData[f.key]} onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })} placeholder={f.placeholder} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                        <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30">
                            <option value="Active">Active</option><option value="Inactive">Inactive</option><option value="Pending">Pending</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                        <textarea value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} rows="2" placeholder="Full address..." className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none" />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border text-gray-700 font-medium hover:bg-gray-50">Cancel</button>
                    <button onClick={handleSave} className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-medium shadow-sm">{editing ? 'Update' : 'Add Supplier'}</button>
                </div>
            </Modal>

            <ConfirmDialog isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Delete Supplier" message={`Delete "${deleteTarget?.name}"? This won't affect existing medicines.`} />
        </div>
    );
};

export default Suppliers;
