import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsAPI, doctorsAPI } from '../services/api';

const SettingsContext = createContext(null);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) throw new Error('useSettings must be used within SettingsProvider');
    return context;
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState({
        // Pharmacy Details
        currency: '₹',
        pharmacyName: 'PharmaCare',
        pharmacyAddress: 'Mumbai, Maharashtra, India',
        pharmacyPhone: '+91 98765 43210',
        pharmacyEmail: 'info@pharmacare.com',

        // System
        taxRate: 5,
        lowStockThreshold: 10,
        theme: 'light',

        // Invoice
        invoicePrefix: 'PH-INV-',
        startingInvoiceNo: 1001,
        showPharmacyLogo: true,
        showGstOnInvoice: true,
        printFooterMessage: 'Thank you for choosing PharmaCare. Get well soon!',

        // Billing & Tax
        enableTax: true,
        gstNumber: '27AABCU9603R1ZM',
        cgstRate: 2.5,
        sgstRate: 2.5,
        defaultDiscount: 0,
        maxDiscountLimit: 20,
        roundOffTotal: true,
        enablePaymentModes: { cash: true, card: true, upi: true, credit: true },
        upiId: 'pharmacare@upi',
    });

    const [loading, setLoading] = useState(true);

    // Track current invoice counter
    const [invoiceCounter, setInvoiceCounter] = useState(settings.startingInvoiceNo);

    // Doctor Management
    const [doctors, setDoctors] = useState([]);

    // Fetch settings from database on mount
    useEffect(() => {
        const abortController = new AbortController();
        
        fetchSettings(abortController.signal);
        fetchDoctors(abortController.signal);
        
        return () => {
            abortController.abort();
        };
    }, []);

    const fetchSettings = async (signal) => {
        try {
            const response = await settingsAPI.getAll();
            if (signal?.aborted) return;
            
            if (response.data.success && response.data.settings) {
                setSettings(prev => ({ ...prev, ...response.data.settings }));
                if (response.data.settings.startingInvoiceNo) {
                    setInvoiceCounter(response.data.settings.startingInvoiceNo);
                }
            }
        } catch (error) {
            if (error.name === 'CanceledError' || signal?.aborted) return;
            console.error('Error fetching settings:', error);
            // Use default settings if fetch fails
        } finally {
            if (!signal?.aborted) {
                setLoading(false);
            }
        }
    };

    const fetchDoctors = async (signal) => {
        try {
            const response = await doctorsAPI.getAll();
            if (signal?.aborted) return;
            
            if (response.data.success && response.data.doctors) {
                setDoctors(response.data.doctors);
            }
        } catch (error) {
            if (error.name === 'CanceledError' || signal?.aborted) return;
            console.error('Error fetching doctors:', error);
        }
    };

    const addDoctor = async (doctor) => {
        try {
            const response = await doctorsAPI.create(doctor);
            if (response.data.success) {
                await fetchDoctors(); // Refresh the list
                return response.data.id;
            }
        } catch (error) {
            console.error('Error adding doctor:', error);
            throw error;
        }
    };

    const updateDoctor = async (id, updatedData) => {
        try {
            await doctorsAPI.update(id, updatedData);
            await fetchDoctors(); // Refresh the list
        } catch (error) {
            console.error('Error updating doctor:', error);
            throw error;
        }
    };

    const deleteDoctor = async (id) => {
        try {
            await doctorsAPI.delete(id);
            await fetchDoctors(); // Refresh the list
        } catch (error) {
            console.error('Error deleting doctor:', error);
            throw error;
        }
    };

    const updateSettings = async (newSettings) => {
        try {
            const updatedSettings = { ...settings, ...newSettings };
            setSettings(updatedSettings);
            
            // Save to database
            await settingsAPI.update(updatedSettings);
        } catch (error) {
            console.error('Error updating settings:', error);
            // Revert on error
            setSettings(settings);
            throw error;
        }
    };

    // Sync theme to HTML element
    useEffect(() => {
        const root = document.documentElement;
        if (settings.theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [settings.theme]);

    const generateInvoiceId = () => {
        const id = `${settings.invoicePrefix}${invoiceCounter}`;
        setInvoiceCounter((prev) => prev + 1);
        return id;
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings, generateInvoiceId, doctors, addDoctor, updateDoctor, deleteDoctor, loading }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
