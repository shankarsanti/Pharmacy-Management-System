import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockDoctors } from '../data/mockData';

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

    // Track current invoice counter
    const [invoiceCounter, setInvoiceCounter] = useState(settings.startingInvoiceNo);

    // Doctor Management
    const [doctors, setDoctors] = useState([...mockDoctors]);

    const addDoctor = (doctor) => {
        const newId = `D${String(doctors.length + 1).padStart(3, '0')}`;
        const newDoctor = { id: newId, ...doctor };
        setDoctors((prev) => [...prev, newDoctor]);
        return newDoctor;
    };

    const updateDoctor = (id, updatedData) => {
        setDoctors((prev) => prev.map((d) => (d.id === id ? { ...d, ...updatedData } : d)));
    };

    const deleteDoctor = (id) => {
        setDoctors((prev) => prev.filter((d) => d.id !== id));
    };

    const updateSettings = (newSettings) => {
        setSettings((prev) => ({ ...prev, ...newSettings }));
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
        <SettingsContext.Provider value={{ settings, updateSettings, generateInvoiceId, doctors, addDoctor, updateDoctor, deleteDoctor }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsContext;
