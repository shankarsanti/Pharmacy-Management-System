import React, { useState, useMemo } from 'react';
import { mockUsers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../common/Modal';

const UserManagement = () => {
    const { user: currentUser } = useAuth();
    const toast = useToast();

    const [users, setUsers] = useState([...mockUsers]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const emptyForm = { name: '', email: '', password: '', role: 'Pharmacist', phone: '' };
    const [formData, setFormData] = useState(emptyForm);

    // Only Admin can access
    if (currentUser?.role !== 'Admin') {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <span className="text-5xl mb-4 block">🔒</span>
                    <h2 className="text-xl font-bold text-gray-800">Access Denied</h2>
                    <p className="text-sm text-gray-500 mt-2">Only Admin users can manage users.</p>
                </div>
            </div>
        );
    }

    const filtered = useMemo(() => {
        let result = [...users];
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (u) =>
                    u.name.toLowerCase().includes(term) ||
                    u.email.toLowerCase().includes(term) ||
                    u.id.toLowerCase().includes(term) ||
                    u.phone.toLowerCase().includes(term)
            );
        }
        if (roleFilter) {
            result = result.filter((u) => u.role === roleFilter);
        }
        return result;
    }, [users, searchTerm, roleFilter]);

    const getRoleBadge = (role) => {
        const styles = {
            Admin: 'bg-red-100 text-red-700 border-red-200',
            Pharmacist: 'bg-blue-100 text-blue-700 border-blue-200',
            Cashier: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        };
        return styles[role] || 'bg-gray-100 text-gray-600 border-gray-200';
    };

    const getRoleIcon = (role) => {
        if (role === 'Admin') return '🛡️';
        if (role === 'Pharmacist') return '💊';
        if (role === 'Cashier') return '💰';
        return '👤';
    };

    const getAvatarColor = (role) => {
        if (role === 'Admin') return 'from-red-500 to-orange-400';
        if (role === 'Pharmacist') return 'from-blue-500 to-cyan-400';
        if (role === 'Cashier') return 'from-emerald-500 to-teal-400';
        return 'from-gray-400 to-gray-500';
    };

    const generateId = () => {
        const maxId = users.reduce((max, u) => {
            const num = parseInt(u.id.replace('U', ''));
            return num > max ? num : max;
        }, 0);
        return `U${String(maxId + 1).padStart(3, '0')}`;
    };

    const generateAvatar = (name) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const openAddForm = () => {
        setEditingUser(null);
        setFormData(emptyForm);
        setShowForm(true);
        setShowPassword(false);
    };

    const openEditForm = (user) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role,
            phone: user.phone,
        });
        setShowForm(true);
        setShowPassword(false);
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
            toast.error('Name, email, and password are required.');
            return;
        }

        // Check duplicate email
        const isDuplicate = users.some(
            (u) => u.email.toLowerCase() === formData.email.toLowerCase() && u.id !== editingUser?.id
        );
        if (isDuplicate) {
            toast.error('A user with this email already exists.');
            return;
        }

        if (editingUser) {
            // Update existing user
            setUsers(
                users.map((u) =>
                    u.id === editingUser.id
                        ? { ...u, ...formData, avatar: generateAvatar(formData.name) }
                        : u
                )
            );
            toast.success(`User "${formData.name}" updated successfully!`);
        } else {
            // Add new user
            const newUser = {
                id: generateId(),
                ...formData,
                avatar: generateAvatar(formData.name),
            };
            setUsers([...users, newUser]);
            // Also push to the shared mockUsers array so login works
            mockUsers.push(newUser);
            toast.success(`User "${formData.name}" added successfully!`);
        }

        setShowForm(false);
        setFormData(emptyForm);
        setEditingUser(null);
    };

    const handleDelete = (user) => {
        if (user.id === currentUser?.id) {
            toast.error("You can't delete your own account!");
            return;
        }
        setDeleteConfirm(user);
    };

    const confirmDelete = () => {
        setUsers(users.filter((u) => u.id !== deleteConfirm.id));
        // Also remove from shared mockUsers array
        const idx = mockUsers.findIndex((u) => u.id === deleteConfirm.id);
        if (idx !== -1) mockUsers.splice(idx, 1);
        toast.success(`User "${deleteConfirm.name}" deleted.`);
        setDeleteConfirm(null);
    };

    const roleCounts = {
        Admin: users.filter((u) => u.role === 'Admin').length,
        Pharmacist: users.filter((u) => u.role === 'Pharmacist').length,
        Cashier: users.filter((u) => u.role === 'Cashier').length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Add, edit, and manage system users. Admin only.</p>
                </div>
                <button
                    onClick={openAddForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New User
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                    <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 mt-2"></div>
                </div>
                {Object.entries(roleCounts).map(([role, count]) => (
                    <div key={role} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{getRoleIcon(role)} {role}s</p>
                        <p className="text-2xl font-bold text-gray-900 mt-1">{count}</p>
                        <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${getAvatarColor(role)} mt-2`}></div>
                    </div>
                ))}
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[220px] max-w-md">
                        <input
                            type="text"
                            placeholder="Search by name, email, ID or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                        <option value="">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="Pharmacist">Pharmacist</option>
                        <option value="Cashier">Cashier</option>
                    </select>
                    <div className="ml-auto text-xs text-gray-400">
                        Showing <span className="font-bold text-gray-600">{filtered.length}</span> of {users.length} users
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                {['User', 'Email', 'Phone', 'Role', 'Actions'].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((u) => (
                                <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(u.role)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                                {u.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">{u.name}</p>
                                                <p className="text-xs text-gray-400 font-mono">{u.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{u.email}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{u.phone}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getRoleBadge(u.role)}`}>
                                            {getRoleIcon(u.role)} {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button
                                                onClick={() => openEditForm(u)}
                                                className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u)}
                                                className={`p-1.5 rounded-lg transition-colors ${u.id === currentUser?.id ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-red-100 text-red-500'}`}
                                                title={u.id === currentUser?.id ? "Can't delete yourself" : 'Delete'}
                                                disabled={u.id === currentUser?.id}
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-400">
                                        <span className="text-4xl block mb-2">👤</span>
                                        <p className="font-medium">No users found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            <Modal
                isOpen={showForm}
                onClose={() => { setShowForm(false); setEditingUser(null); setFormData(emptyForm); }}
                title={editingUser ? `Edit User — ${editingUser.name}` : 'Add New User'}
                size="md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="e.g. rahul@pharmacare.com"
                            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password *</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Enter password"
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all pr-12"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role *</label>
                            <select
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
                            >
                                <option value="Admin">🛡️ Admin</option>
                                <option value="Pharmacist">💊 Pharmacist</option>
                                <option value="Cashier">💰 Cashier</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                            <input
                                type="text"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="e.g. +91 98765 43210"
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* Role Info */}
                    <div className={`rounded-xl p-3 border ${formData.role === 'Admin' ? 'bg-red-50 border-red-100' : formData.role === 'Pharmacist' ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        <p className="text-xs font-semibold text-gray-700 mb-1">{getRoleIcon(formData.role)} {formData.role} Permissions:</p>
                        <p className="text-xs text-gray-500">
                            {formData.role === 'Admin' && 'Full access — manage users, inventory, reports, sales, export data, and all system settings.'}
                            {formData.role === 'Pharmacist' && 'Access to POS, inventory, stock entry, and view reports. Cannot export data or manage users.'}
                            {formData.role === 'Cashier' && 'Access to POS/Billing and view sales. Limited inventory access.'}
                        </p>
                    </div>

                    {/* Preview */}
                    {formData.name && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">Preview</p>
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(formData.role)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                    {generateAvatar(formData.name)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{formData.name}</p>
                                    <p className="text-xs text-gray-400">{formData.email || 'email@pharmacare.com'} • {formData.role}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95"
                        >
                            {editingUser ? 'Update User' : 'Add User'}
                        </button>
                        <button
                            onClick={() => { setShowForm(false); setEditingUser(null); setFormData(emptyForm); }}
                            className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={!!deleteConfirm}
                onClose={() => setDeleteConfirm(null)}
                title="Delete User"
                size="sm"
            >
                {deleteConfirm && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(deleteConfirm.role)} flex items-center justify-center text-white font-bold text-sm`}>
                                {deleteConfirm.avatar}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{deleteConfirm.name}</p>
                                <p className="text-xs text-gray-500">{deleteConfirm.email} • {deleteConfirm.role}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            Are you sure you want to delete this user? This action <span className="font-bold text-red-600">cannot be undone</span>.
                            The user will no longer be able to log in.
                        </p>
                        <div className="flex gap-2 pt-1">
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition-colors active:scale-95"
                            >
                                Yes, Delete User
                            </button>
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default UserManagement;
