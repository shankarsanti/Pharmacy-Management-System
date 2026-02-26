import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

const Profile = () => {
    const { user } = useAuth();
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+91 98765 43210',
        address: 'Mumbai, Maharashtra, India',
    });
    const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });

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
                        <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
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

                {/* Change Password */}
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
            </div>
        </div>
    );
};

export default Profile;
