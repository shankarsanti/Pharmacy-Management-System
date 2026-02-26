import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { mockUsers } from '../../data/mockData';
import Modal from '../common/Modal';

const Profile = () => {
    const { user } = useAuth();
    const toast = useToast();
    const isAdmin = user?.role === 'Admin';
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '+91 98765 43210',
        address: 'Mumbai, Maharashtra, India',
    });
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

    // Staff editing state (Admin only)
    const [staffUsers, setStaffUsers] = useState(mockUsers.filter((u) => u.id !== user?.id));
    const [editingStaff, setEditingStaff] = useState(null);
    const [staffForm, setStaffForm] = useState({ name: '', email: '', phone: '', password: '', role: '' });
    const [showStaffPassword, setShowStaffPassword] = useState(false);

    const handleSaveProfile = () => {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
    };

    const handleChangePassword = (e) => {
        e.preventDefault();
        if (!passwords.current || !passwords.newPass) { toast.warning('Please fill all password fields'); return; }
        if (passwords.newPass !== passwords.confirm) { toast.error('New passwords do not match'); return; }
        toast.success('Password changed successfully!');
        setPasswords({ current: '', newPass: '', confirm: '' });
    };

    const openStaffEdit = (staff) => {
        setEditingStaff(staff);
        setStaffForm({
            name: staff.name,
            email: staff.email,
            phone: staff.phone,
            password: staff.password,
            role: staff.role,
        });
        setShowStaffPassword(false);
    };

    const handleSaveStaff = () => {
        if (!staffForm.name.trim() || !staffForm.email.trim()) {
            toast.error('Name and email are required.');
            return;
        }
        // Check duplicate email
        const isDuplicate = mockUsers.some(
            (u) => u.email.toLowerCase() === staffForm.email.toLowerCase() && u.id !== editingStaff.id
        );
        if (isDuplicate) {
            toast.error('A user with this email already exists.');
            return;
        }

        // Update in staffUsers list
        setStaffUsers(staffUsers.map((u) =>
            u.id === editingStaff.id
                ? { ...u, ...staffForm, avatar: getAvatar(staffForm.name) }
                : u
        ));

        // Also update in shared mockUsers array so login reflects changes
        const idx = mockUsers.findIndex((u) => u.id === editingStaff.id);
        if (idx !== -1) {
            mockUsers[idx] = { ...mockUsers[idx], ...staffForm, avatar: getAvatar(staffForm.name) };
        }

        toast.success(`${staffForm.name}'s profile updated successfully!`);
        setEditingStaff(null);
    };

    const getAvatar = (name) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
        return name.substring(0, 2).toUpperCase();
    };

    const getRoleBadge = (role) => {
        if (role === 'Admin') return 'bg-red-100 text-red-700 border-red-200';
        if (role === 'Pharmacist') return 'bg-blue-100 text-blue-700 border-blue-200';
        if (role === 'Cashier') return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        return 'bg-gray-100 text-gray-600 border-gray-200';
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

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your account information.</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 relative">
                    <div className="absolute -bottom-10 left-6">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold ring-4 ring-white shadow-xl">
                            {user?.avatar || 'U'}
                        </div>
                    </div>
                </div>
                <div className="pt-14 px-6 pb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                            <p className="text-sm text-gray-500">{user?.role} · {user?.email}</p>
                        </div>
                        {isAdmin && (
                            <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                                {isEditing ? 'Cancel' : 'Edit Profile'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Full Name', key: 'name' },
                            { label: 'Email', key: 'email' },
                            { label: 'Phone', key: 'phone' },
                            { label: 'Address', key: 'address' },
                        ].map((field) => (
                            <div key={field.key}>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{field.label}</label>
                                {isEditing ? (
                                    <input type="text" value={formData[field.key]} onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                                ) : (
                                    <p className="text-sm font-medium text-gray-900">{formData[field.key]}</p>
                                )}
                            </div>
                        ))}
                        {isEditing && (
                            <button onClick={handleSaveProfile} className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors mt-2">Save Changes</button>
                        )}
                    </div>
                </div>

                {/* Change Password — Admin Only */}
                {isAdmin ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Change Password</h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            {[
                                { label: 'Current Password', key: 'current' },
                                { label: 'New Password', key: 'newPass' },
                                { label: 'Confirm New Password', key: 'confirm' },
                            ].map((field) => (
                                <div key={field.key}>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">{field.label}</label>
                                    <input type="password" value={passwords[field.key]} onChange={(e) => setPasswords({ ...passwords, [field.key]: e.target.value })} placeholder="••••••••" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
                                </div>
                            ))}
                            <button type="submit" className="w-full py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-medium shadow-sm transition-colors">Update Password</button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Account Info</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                                <span className="text-xl">🔒</span>
                                <div>
                                    <p className="text-sm font-semibold text-amber-800">Read-Only Access</p>
                                    <p className="text-xs text-amber-600">Only Admin can edit profile details and change passwords. Contact your administrator for changes.</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Role</label>
                                <p className="text-sm font-medium text-gray-900">{user?.role}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Account ID</label>
                                <p className="text-sm font-medium text-gray-900 font-mono">{user?.id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-green-100 text-green-700 border border-green-200">✅ Active</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Staff Profiles — Admin Only */}
            {isAdmin && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Staff Profiles</h3>
                            <p className="text-xs text-gray-400 mt-0.5">Edit Pharmacist & Cashier profiles. Only visible to Admin.</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                            {staffUsers.length} Staff
                        </span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {staffUsers.map((staff) => (
                            <div key={staff.id} className="px-6 py-4 flex items-center justify-between hover:bg-blue-50/30 transition-colors group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getAvatarColor(staff.role)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                        {staff.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{staff.name}</p>
                                        <p className="text-xs text-gray-400">{staff.email} · {staff.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${getRoleBadge(staff.role)}`}>
                                        {getRoleIcon(staff.role)} {staff.role}
                                    </span>
                                    <button
                                        onClick={() => openStaffEdit(staff)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all active:scale-95 opacity-0 group-hover:opacity-100"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))}
                        {staffUsers.length === 0 && (
                            <div className="px-6 py-12 text-center text-gray-400">
                                <span className="text-3xl block mb-2">👤</span>
                                <p className="text-sm font-medium">No other staff members found.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Staff Modal */}
            <Modal
                isOpen={!!editingStaff}
                onClose={() => setEditingStaff(null)}
                title={`Edit Profile — ${editingStaff?.name || ''}`}
                size="md"
            >
                {editingStaff && (
                    <div className="space-y-4">
                        {/* Staff Preview */}
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${getAvatarColor(staffForm.role)} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                                {getAvatar(staffForm.name || 'U')}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">{staffForm.name}</p>
                                <p className="text-xs text-gray-400">{staffForm.email} · {staffForm.role}</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
                            <input
                                type="text"
                                value={staffForm.name}
                                onChange={(e) => setStaffForm({ ...staffForm, name: e.target.value })}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email Address *</label>
                            <input
                                type="email"
                                value={staffForm.email}
                                onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                            <input
                                type="text"
                                value={staffForm.phone}
                                onChange={(e) => setStaffForm({ ...staffForm, phone: e.target.value })}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showStaffPassword ? 'text' : 'password'}
                                    value={staffForm.password}
                                    onChange={(e) => setStaffForm({ ...staffForm, password: e.target.value })}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowStaffPassword(!showStaffPassword)}
                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showStaffPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                            <select
                                value={staffForm.role}
                                onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
                            >
                                <option value="Pharmacist">💊 Pharmacist</option>
                                <option value="Cashier">💰 Cashier</option>
                            </select>
                        </div>

                        {/* Role Permissions Info */}
                        <div className={`rounded-xl p-3 border ${staffForm.role === 'Pharmacist' ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'}`}>
                            <p className="text-xs font-semibold text-gray-700 mb-1">{getRoleIcon(staffForm.role)} {staffForm.role} Permissions:</p>
                            <p className="text-xs text-gray-500">
                                {staffForm.role === 'Pharmacist' && 'Access to POS, inventory, stock entry, categories, expiry tracker, and view sales. Cannot export reports or manage users.'}
                                {staffForm.role === 'Cashier' && 'Access to POS/Billing and view sales. Limited inventory access.'}
                            </p>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleSaveStaff}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingStaff(null)}
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

export default Profile;
