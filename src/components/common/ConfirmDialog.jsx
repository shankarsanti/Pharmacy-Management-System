import React from 'react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
    if (!isOpen) return null;

    const buttonStyles = {
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        warning: 'bg-amber-500 hover:bg-amber-600 text-white',
        info: 'bg-blue-600 hover:bg-blue-700 text-white',
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm animate-modal-in">
                <div className="p-6 text-center">
                    <div className={`w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center ${type === 'danger' ? 'bg-red-100' : type === 'warning' ? 'bg-amber-100' : 'bg-blue-100'
                        }`}>
                        <svg className={`w-7 h-7 ${type === 'danger' ? 'text-red-600' : type === 'warning' ? 'text-amber-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 mb-6">{message}</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button onClick={onConfirm} className={`flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors ${buttonStyles[type]}`}>
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
