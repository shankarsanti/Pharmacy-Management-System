import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within ToastProvider');
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = useCallback((msg) => addToast(msg, 'success'), [addToast]);
    const error = useCallback((msg) => addToast(msg, 'error'), [addToast]);
    const warning = useCallback((msg) => addToast(msg, 'warning'), [addToast]);
    const info = useCallback((msg) => addToast(msg, 'info'), [addToast]);

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
            {children}
            {/* Toast Container */}
            <div className="fixed top-4 right-4 z-[100] space-y-2 min-w-[320px]">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm animate-slide-in ${toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
                                toast.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                                    toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
                                        'bg-blue-50 border-blue-200 text-blue-800'
                            }`}
                    >
                        <span className="text-lg">
                            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </span>
                        <p className="flex-1 text-sm font-medium">{toast.message}</p>
                        <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 ml-2">✕</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
