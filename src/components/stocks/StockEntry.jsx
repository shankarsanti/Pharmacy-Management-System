import React, { useState } from 'react';
import { mockMedicines, mockSuppliers, mockCategories, getCategoryColor, getStockDisplay } from '../../data/mockData';
import { mockStockEntries } from '../../data/mockData';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import ConfirmDialog from '../common/ConfirmDialog';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const StockEntry = () => {
    const [entries, setEntries] = useState([...mockStockEntries]);
    const [searchTerm, setSearchTerm] = useState('');
    const [supplierFilter, setSupplierFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewEntry, setViewEntry] = useState(null);
    const itemsPerPage = 8;
    const toast = useToast();
    const { user } = useAuth();
    const canEdit = user?.role !== 'Pharmacist';
    const isAdmin = user?.role === 'Admin';

    // Print a single stock entry report
    const handlePrint = (entry) => {
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        const itemsRows = entry.items.map((it, i) =>
            `<tr><td style="padding:8px;border-bottom:1px solid #eee">${i + 1}</td><td style="padding:8px;border-bottom:1px solid #eee">${it.medicineName}</td><td style="padding:8px;border-bottom:1px solid #eee">${it.batch}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center">${it.stripsPurchased || 0} strips + ${it.looseTabletsPurchased || 0} loose</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:center;font-weight:bold">${it.qty} tablets</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${it.purchasePrice}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right">₹${it.sellingPrice}</td><td style="padding:8px;border-bottom:1px solid #eee;text-align:right;font-weight:bold">₹${(it.qty * it.purchasePrice).toLocaleString()}</td></tr>`
        ).join('');
        printWindow.document.write(`<html><head><title>Stock Entry - ${entry.invoiceNo}</title><style>body{font-family:system-ui,sans-serif;padding:40px;color:#333}table{width:100%;border-collapse:collapse;margin-top:16px}th{background:#f8fafc;padding:10px 8px;text-align:left;font-size:12px;text-transform:uppercase;color:#64748b;border-bottom:2px solid #e2e8f0}td{font-size:13px}.header{text-align:center;margin-bottom:24px}.header h1{font-size:20px;margin:0;color:#059669}.header p{font-size:12px;color:#94a3b8;margin:4px 0}.meta{display:flex;justify-content:space-between;background:#f0fdf4;padding:16px;border-radius:12px;margin-bottom:16px;font-size:13px}.total{text-align:right;margin-top:16px;font-size:18px;font-weight:bold;color:#059669}.note{margin-top:12px;padding:10px;background:#f0f9ff;border-radius:8px;font-size:11px;color:#3b82f6}@media print{body{padding:20px}}</style></head><body><div class="header"><h1>📦 Stock Entry Report</h1><p>${entry.invoiceNo} — ${entry.invoiceDate}</p></div><div class="meta"><div><strong>Supplier:</strong> ${entry.supplier}</div><div><strong>Payment:</strong> ${entry.paymentMode}</div><div><strong>Entered By:</strong> ${entry.enteredBy}</div></div><div class="note">📌 <strong>Note:</strong> All stock is stored and tracked in tablets. Strips are auto-converted to tablet count.</div><table><thead><tr><th>#</th><th>Medicine</th><th>Batch</th><th>Strips + Loose</th><th>Total Tablets</th><th style="text-align:right">Purchase ₹</th><th style="text-align:right">Selling ₹</th><th style="text-align:right">Total ₹</th></tr></thead><tbody>${itemsRows}</tbody></table><div class="total">Grand Total: ₹${entry.totalAmount.toLocaleString()}</div>${entry.remarks ? `<div style="margin-top:16px;padding:12px;background:#fffbeb;border-radius:8px;font-size:12px"><strong>Remarks:</strong> ${entry.remarks}</div>` : ''}<script>window.onload=()=>{window.print();window.onafterprint=()=>window.close()}<\/script></body></html>`);
        printWindow.document.close();
    };


    const emptyItem = { medId: '', medicineName: '', batch: '', stripsPurchased: '', looseTabletsPurchased: '', tabletsPerStrip: 10, qty: '', purchasePrice: '', sellingPrice: '', expiry: '', mfgDate: '' };
    const emptyForm = {
        supplier: '',
        invoiceNo: '',
        invoiceDate: new Date().toISOString().split('T')[0],
        paymentMode: 'Cash',
        remarks: '',
        items: [{ ...emptyItem }],
    };
    const [formData, setFormData] = useState(emptyForm);

    // Filters
    const filtered = entries.filter((e) => {
        const matchSearch =
            e.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.items.some((it) => it.medicineName.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchSupplier = !supplierFilter || e.supplierId === supplierFilter;
        const matchDate = !dateFilter || e.invoiceDate === dateFilter;
        return matchSearch && matchSupplier && matchDate;
    });

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Summary
    const totalEntries = entries.length;
    const totalValue = entries.reduce((sum, e) => sum + e.totalAmount, 0);
    const todayEntries = entries.filter((e) => e.invoiceDate === '2026-02-25').length;
    const todayValue = entries.filter((e) => e.invoiceDate === '2026-02-25').reduce((sum, e) => sum + e.totalAmount, 0);

    const handleAddItem = () => {
        setFormData({ ...formData, items: [...formData.items, { ...emptyItem }] });
    };

    const handleRemoveItem = (index) => {
        if (formData.items.length === 1) return;
        const updatedItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: updatedItems });
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        // Auto-fill medicine details
        if (field === 'medId' && value) {
            const med = mockMedicines.find((m) => m.id === value);
            if (med) {
                updatedItems[index].medicineName = med.name;
                updatedItems[index].purchasePrice = med.purchasePrice;
                updatedItems[index].sellingPrice = med.sellingPrice;
                updatedItems[index].batch = med.batch;
                updatedItems[index].tabletsPerStrip = med.tabletsPerStrip || 10;
            }
        }
        // Auto-calculate total tablets when strips or loose tablets change
        if (field === 'stripsPurchased' || field === 'looseTabletsPurchased' || field === 'tabletsPerStrip') {
            const strips = Number(updatedItems[index].stripsPurchased) || 0;
            const loose = Number(updatedItems[index].looseTabletsPurchased) || 0;
            const tps = Number(updatedItems[index].tabletsPerStrip) || 10;
            updatedItems[index].qty = (strips * tps) + loose;
        }
        setFormData({ ...formData, items: updatedItems });
    };

    const getEntryTotal = () => {
        return formData.items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.purchasePrice) || 0), 0);
    };

    const getEntryTotalTablets = () => {
        return formData.items.reduce((sum, item) => sum + (Number(item.qty) || 0), 0);
    };

    const openAdd = () => {
        setFormData(emptyForm);
        setEditingEntry(null);
        setShowForm(true);
    };

    const openEdit = (entry) => {
        setFormData({
            supplier: entry.supplierId,
            invoiceNo: entry.invoiceNo,
            invoiceDate: entry.invoiceDate,
            paymentMode: entry.paymentMode,
            remarks: entry.remarks || '',
            items: entry.items.map((it) => ({
                ...it,
                stripsPurchased: it.stripsPurchased || '',
                looseTabletsPurchased: it.looseTabletsPurchased || '',
                tabletsPerStrip: it.tabletsPerStrip || 10,
            })),
        });
        setEditingEntry(entry);
        setShowForm(true);
    };

    const handleSave = () => {
        if (!formData.supplier || !formData.invoiceNo || formData.items.some((it) => !it.medicineName || !it.qty || it.qty <= 0)) {
            toast.warning('Please fill all required fields');
            return;
        }
        const supplierInfo = mockSuppliers.find((s) => s.id === formData.supplier);
        const totalAmount = formData.items.reduce((sum, it) => sum + (Number(it.qty) || 0) * (Number(it.purchasePrice) || 0), 0);
        const totalQty = formData.items.reduce((sum, it) => sum + (Number(it.qty) || 0), 0);

        if (editingEntry) {
            setEntries(
                entries.map((e) =>
                    e.id === editingEntry.id
                        ? {
                            ...e,
                            supplierId: formData.supplier,
                            supplier: supplierInfo?.name || formData.supplier,
                            invoiceNo: formData.invoiceNo,
                            invoiceDate: formData.invoiceDate,
                            paymentMode: formData.paymentMode,
                            remarks: formData.remarks,
                            items: formData.items.map((it) => ({
                                ...it,
                                qty: +it.qty,
                                purchasePrice: +it.purchasePrice,
                                sellingPrice: +it.sellingPrice,
                                stripsPurchased: +it.stripsPurchased || 0,
                                looseTabletsPurchased: +it.looseTabletsPurchased || 0,
                                tabletsPerStrip: +it.tabletsPerStrip || 10,
                            })),
                            totalAmount,
                            totalQty,
                        }
                        : e
                )
            );
            toast.success('Stock entry updated successfully!');
        } else {
            const newId = `SE${String(entries.length + 1).padStart(3, '0')}`;
            setEntries([
                {
                    id: newId,
                    supplierId: formData.supplier,
                    supplier: supplierInfo?.name || formData.supplier,
                    invoiceNo: formData.invoiceNo,
                    invoiceDate: formData.invoiceDate,
                    paymentMode: formData.paymentMode,
                    remarks: formData.remarks,
                    items: formData.items.map((it) => ({
                        ...it,
                        qty: +it.qty,
                        purchasePrice: +it.purchasePrice,
                        sellingPrice: +it.sellingPrice,
                        stripsPurchased: +it.stripsPurchased || 0,
                        looseTabletsPurchased: +it.looseTabletsPurchased || 0,
                        tabletsPerStrip: +it.tabletsPerStrip || 10,
                    })),
                    totalAmount,
                    totalQty,
                    enteredBy: user?.name || 'Admin User',
                    createdAt: new Date().toISOString(),
                },
                ...entries,
            ]);
            toast.success('Stock entry recorded successfully!');
        }
        setShowForm(false);
    };

    const handleDelete = () => {
        setEntries(entries.filter((e) => e.id !== deleteTarget.id));
        toast.success(`Entry ${deleteTarget.invoiceNo} deleted!`);
        setDeleteTarget(null);
    };

    // Print all stock entries report
    const handlePrintAll = () => {
        const data = filtered;
        const totalAmt = data.reduce((s, e) => s + e.totalAmount, 0);
        const totalTabs = data.reduce((s, e) => s + (e.totalQty || 0), 0);

        // Supplier summary
        const supMap = {};
        data.forEach((e) => {
            if (!supMap[e.supplier]) supMap[e.supplier] = { count: 0, amount: 0, tablets: 0 };
            supMap[e.supplier].count++;
            supMap[e.supplier].amount += e.totalAmount;
            supMap[e.supplier].tablets += e.totalQty || 0;
        });
        const supRows = Object.entries(supMap).map(([sup, d]) =>
            `<tr><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9"><strong>${sup}</strong></td><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${d.count}</td><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${d.tablets.toLocaleString('en-IN')}</td><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">₹${d.amount.toLocaleString('en-IN')}</td></tr>`
        ).join('');

        // Payment mode summary
        const payMap = {};
        data.forEach((e) => {
            if (!payMap[e.paymentMode]) payMap[e.paymentMode] = { count: 0, amount: 0 };
            payMap[e.paymentMode].count++;
            payMap[e.paymentMode].amount += e.totalAmount;
        });

        const entryRows = data.map((e) => `<tr>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9"><strong style="color:#059669">${e.invoiceNo}</strong></td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${e.invoiceDate}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${e.supplier}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${e.items.length} items</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-weight:700">${e.totalQty || 0} tablets</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-weight:700">₹${e.totalAmount.toLocaleString('en-IN')}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${e.paymentMode}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:11px;color:#94a3b8">${e.enteredBy}</td>
        </tr>`).join('');

        const win = window.open('', '_blank');
        win.document.write(`<html><head><title>Stock Entry Report</title><style>
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 24px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 12px; margin-bottom: 16px; }
            .header h1 { font-size: 20px; color: #047857; }
            .header .meta { font-size: 11px; color: #64748b; text-align: right; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th { background: #f1f5f9; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; font-size: 10px; padding: 8px 10px; text-align: left; border-bottom: 2px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
            .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
            .summary-card { padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #e2e8f0; }
            .summary-card .val { font-size: 18px; font-weight: 800; }
            .summary-card .lbl { font-size: 10px; color: #64748b; margin-top: 2px; }
            .section { margin-top: 20px; border-top: 2px solid #e2e8f0; padding-top: 14px; }
            .section h3 { font-size: 14px; margin-bottom: 8px; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style></head><body>
            <div class="header">
                <h1>📦 Stock Entry Report</h1>
                <div class="meta">Total: ${data.length} entries · ${totalTabs.toLocaleString('en-IN')} tablets<br>Printed: ${new Date().toLocaleString('en-IN')}<br>PharmaCare Management System</div>
            </div>

            <div class="summary-grid">
                <div class="summary-card" style="background:#ecfdf5"><div class="val" style="color:#047857">${data.length}</div><div class="lbl">Total Entries</div></div>
                <div class="summary-card" style="background:#eff6ff"><div class="val" style="color:#1d4ed8">${totalTabs.toLocaleString('en-IN')}</div><div class="lbl">Total Tablets</div></div>
                <div class="summary-card" style="background:#f0fdf4"><div class="val" style="color:#15803d">₹${totalAmt.toLocaleString('en-IN')}</div><div class="lbl">Total Purchase Value</div></div>
                <div class="summary-card" style="background:#faf5ff"><div class="val" style="color:#7c3aed">${Object.keys(supMap).length}</div><div class="lbl">Suppliers</div></div>
            </div>

            <table>
                <thead><tr><th>Invoice #</th><th>Date</th><th>Supplier</th><th>Items</th><th>Total Tablets</th><th>Amount</th><th>Payment</th><th>Entered By</th></tr></thead>
                <tbody>${entryRows}
                    <tr style="font-weight:700;border-top:2px solid #cbd5e1;background:#f0fdf4">
                        <td colspan="4" style="padding:8px 10px">Grand Total</td>
                        <td style="padding:8px 10px">${totalTabs.toLocaleString('en-IN')} tablets</td>
                        <td style="padding:8px 10px">₹${totalAmt.toLocaleString('en-IN')}</td>
                        <td colspan="2" style="padding:8px 10px"></td>
                    </tr>
                </tbody>
            </table>

            <div class="section">
                <h3>🏢 Supplier-Wise Summary</h3>
                <table>
                    <thead><tr><th>Supplier</th><th>Entries</th><th>Total Tablets</th><th>Amount</th></tr></thead>
                    <tbody>${supRows}</tbody>
                </table>
            </div>

            <div class="footer">Generated by PharmaCare Management System</div>
        </body></html>`);
        win.document.close();
        win.focus();
        win.print();
    };

    const getPaymentBadge = (mode) => {
        const styles = {
            Cash: 'bg-emerald-50 text-emerald-700',
            UPI: 'bg-violet-50 text-violet-700',
            Card: 'bg-blue-50 text-blue-700',
            Credit: 'bg-amber-50 text-amber-700',
            Cheque: 'bg-slate-100 text-slate-700',
        };
        return <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${styles[mode] || 'bg-gray-100 text-gray-600'}`}>{mode}</span>;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Stock Entry</h1>
                    <p className="text-sm text-gray-500 mt-1">Record new stock purchases. <span className="text-emerald-600 font-medium">Enter strips & loose tablets → auto-converted to total tablet stock.</span></p>
                </div>
                {canEdit && (
                    <button
                        onClick={openAdd}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl font-medium shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        New Stock Entry
                    </button>
                )}
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Total Entries', value: totalEntries, icon: '📦', color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50' },
                    { label: 'Total Purchase Value', value: `₹${totalValue.toLocaleString()}`, icon: '💰', color: 'from-emerald-500 to-emerald-600', bgLight: 'bg-emerald-50' },
                    { label: "Today's Entries", value: todayEntries, icon: '📋', color: 'from-violet-500 to-violet-600', bgLight: 'bg-violet-50' },
                    { label: "Today's Value", value: `₹${todayValue.toLocaleString()}`, icon: '📊', color: 'from-amber-500 to-amber-600', bgLight: 'bg-amber-50' },
                ].map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{card.label}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                            </div>
                            <div className={`w-12 h-12 rounded-xl ${card.bgLight} flex items-center justify-center text-xl`}>{card.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Entries Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filters */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <input
                            type="text"
                            placeholder="Search by invoice, supplier or medicine..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 transition-all"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        value={supplierFilter}
                        onChange={(e) => {
                            setSupplierFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    >
                        <option value="">All Suppliers</option>
                        {mockSuppliers.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) => {
                            setDateFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                    />
                    {(searchTerm || supplierFilter || dateFilter) && (
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSupplierFilter('');
                                setDateFilter('');
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            Clear Filters
                        </button>
                    )}
                    <button onClick={handlePrintAll} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95 ml-auto">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/80 border-b border-gray-100">
                                {['Invoice #', 'Date', 'Supplier', 'Items', 'Total Tablets', 'Amount', 'Payment', 'Actions'].map((h) => (
                                    <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginated.map((entry) => (
                                <tr key={entry.id} className="hover:bg-emerald-50/30 transition-colors group">
                                    <td className="px-5 py-3.5">
                                        <span className="text-sm font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">{entry.invoiceNo}</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{entry.invoiceDate}</td>
                                    <td className="px-5 py-3.5">
                                        <p className="text-sm font-medium text-gray-900">{entry.supplier}</p>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-sm font-semibold text-gray-700">{entry.items.length}</span>
                                        <span className="text-xs text-gray-400 ml-1">items</span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="text-sm font-bold text-gray-700">{entry.totalQty}</span>
                                        <span className="text-xs text-gray-400 ml-1">tablets</span>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">₹{entry.totalAmount.toLocaleString()}</td>
                                    <td className="px-5 py-3.5">{getPaymentBadge(entry.paymentMode)}</td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setViewEntry(entry)}
                                                className="p-1.5 rounded-lg hover:bg-blue-100 text-blue-600 transition-colors"
                                                title="View Details"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            </button>
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handlePrint(entry)}
                                                    className="p-1.5 rounded-lg hover:bg-violet-100 text-violet-600 transition-colors"
                                                    title="Print Report"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                                    </svg>
                                                </button>
                                            )}
                                            {canEdit && (
                                                <>
                                                    <button
                                                        onClick={() => openEdit(entry)}
                                                        className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-600 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(entry)}
                                                        className="p-1.5 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            <p className="font-medium">No stock entries found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>

            {/* Add / Edit Modal */}
            <Modal isOpen={showForm} onClose={() => setShowForm(false)} title={editingEntry ? 'Edit Stock Entry' : 'New Stock Entry'} size="xl">
                <div className="space-y-6">
                    {/* Info Banner */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                        <span className="text-lg">💡</span>
                        <p className="text-xs text-blue-700">
                            <strong>Stock is stored in tablets.</strong> Enter strips purchased and loose tablets — the system auto-calculates total tablets added to stock.
                        </p>
                    </div>

                    {/* Entry Header Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Supplier *</label>
                            <select
                                value={formData.supplier}
                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                            >
                                <option value="">Select Supplier...</option>
                                {mockSuppliers.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Invoice No *</label>
                            <input
                                type="text"
                                value={formData.invoiceNo}
                                onChange={(e) => setFormData({ ...formData, invoiceNo: e.target.value })}
                                placeholder="e.g., INV-2026-001"
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Invoice Date *</label>
                            <input
                                type="date"
                                value={formData.invoiceDate}
                                onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Payment Mode</label>
                            <select
                                value={formData.paymentMode}
                                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
                            >
                                {['Cash', 'UPI', 'Card', 'Credit', 'Cheque'].map((m) => (
                                    <option key={m} value={m}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Items Table */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-bold text-gray-700">Medicine Items</h3>
                            <button
                                onClick={handleAddItem}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Add Item
                            </button>
                        </div>
                        <div className="space-y-4">
                            {formData.items.map((item, index) => {
                                const strips = Number(item.stripsPurchased) || 0;
                                const loose = Number(item.looseTabletsPurchased) || 0;
                                const tps = Number(item.tabletsPerStrip) || 10;
                                const totalTablets = (strips * tps) + loose;
                                return (
                                    <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50/30 hover:bg-white transition-colors">
                                        <div className="flex items-start justify-between gap-3 mb-3">
                                            <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-lg text-xs font-bold">Item #{index + 1}</span>
                                            {formData.items.length > 1 && (
                                                <button
                                                    onClick={() => handleRemoveItem(index)}
                                                    className="p-1 rounded-lg hover:bg-red-100 text-red-400 hover:text-red-600 transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {/* Medicine */}
                                            <div className="col-span-2">
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Medicine *</label>
                                                <select
                                                    value={item.medId}
                                                    onChange={(e) => handleItemChange(index, 'medId', e.target.value)}
                                                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                                >
                                                    <option value="">Select Medicine...</option>
                                                    {mockMedicines.map((m) => (
                                                        <option key={m.id} value={m.id}>
                                                            {m.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            {/* Batch */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Batch</label>
                                                <input
                                                    type="text"
                                                    value={item.batch}
                                                    onChange={(e) => handleItemChange(index, 'batch', e.target.value)}
                                                    placeholder="Batch #"
                                                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                            {/* Tablets Per Strip (Auto-filled / Editable) */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Tablets/Strip</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.tabletsPerStrip}
                                                    onChange={(e) => handleItemChange(index, 'tabletsPerStrip', e.target.value)}
                                                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-3">
                                            {/* Strips Purchased */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Strips Purchased</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.stripsPurchased}
                                                    onChange={(e) => handleItemChange(index, 'stripsPurchased', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full px-2 py-2 text-sm border border-emerald-200 rounded-lg bg-emerald-50/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                            {/* Loose Tablets */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Loose Tablets</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={item.looseTabletsPurchased}
                                                    onChange={(e) => handleItemChange(index, 'looseTabletsPurchased', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full px-2 py-2 text-sm border border-violet-200 rounded-lg bg-violet-50/50 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                                                />
                                            </div>
                                            {/* Purchase Price */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Purchase ₹</label>
                                                <input
                                                    type="number"
                                                    value={item.purchasePrice}
                                                    onChange={(e) => handleItemChange(index, 'purchasePrice', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                            {/* Selling Price */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Selling ₹</label>
                                                <input
                                                    type="number"
                                                    value={item.sellingPrice}
                                                    onChange={(e) => handleItemChange(index, 'sellingPrice', e.target.value)}
                                                    placeholder="0"
                                                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                            {/* Total Tablets (Read-only, auto-calculated) */}
                                            <div>
                                                <label className="block text-xs font-medium text-blue-600 mb-1">Total Tablets ✨</label>
                                                <div className="w-full px-2 py-2 text-sm border border-blue-200 rounded-lg bg-blue-50 font-bold text-blue-800">
                                                    {totalTablets} tablets
                                                </div>
                                                <p className="text-[9px] text-gray-400 mt-0.5">
                                                    ({strips}×{tps}) + {loose} = {totalTablets}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Mfg Date</label>
                                                <input
                                                    type="date"
                                                    value={item.mfgDate}
                                                    onChange={(e) => handleItemChange(index, 'mfgDate', e.target.value)}
                                                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-500 mb-1">Expiry Date</label>
                                                <input
                                                    type="date"
                                                    value={item.expiry}
                                                    onChange={(e) => handleItemChange(index, 'expiry', e.target.value)}
                                                    className="w-full px-2 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Grand Total */}
                        <div className="flex justify-end gap-4 mt-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 text-center">
                                <span className="text-xs text-blue-600 font-medium block">Total Tablets</span>
                                <span className="text-lg font-bold text-blue-800">{getEntryTotalTablets()}</span>
                            </div>
                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3 text-center">
                                <span className="text-xs text-emerald-600 font-medium block">Grand Total</span>
                                <span className="text-lg font-bold text-emerald-800">₹{getEntryTotal().toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks</label>
                        <textarea
                            value={formData.remarks}
                            onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            placeholder="Any additional notes..."
                            rows={2}
                            className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                    <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-sm transition-colors"
                    >
                        {editingEntry ? 'Update Entry' : 'Save Entry'}
                    </button>
                </div>
            </Modal>

            {/* View Detail Modal */}
            <Modal isOpen={!!viewEntry} onClose={() => setViewEntry(null)} title={`Stock Entry — ${viewEntry?.invoiceNo}`} size="lg">
                {viewEntry && (
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'Invoice No', value: viewEntry.invoiceNo },
                                { label: 'Date', value: viewEntry.invoiceDate },
                                { label: 'Supplier', value: viewEntry.supplier },
                                { label: 'Payment', value: viewEntry.paymentMode },
                            ].map((info) => (
                                <div key={info.label} className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs text-gray-400 font-medium">{info.label}</p>
                                    <p className="text-sm font-semibold text-gray-800 mt-0.5">{info.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        {['Medicine', 'Batch', 'Strips', 'Loose', 'Total Tablets', 'Purchase ₹', 'Selling ₹', 'Total ₹'].map((h) => (
                                            <th key={h} className="px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {viewEntry.items.map((item, i) => (
                                        <tr key={i}>
                                            <td className="px-4 py-2.5 font-medium text-gray-800">{item.medicineName}</td>
                                            <td className="px-4 py-2.5 text-gray-500 font-mono">{item.batch}</td>
                                            <td className="px-4 py-2.5 text-emerald-600 font-semibold">{item.stripsPurchased || '—'}</td>
                                            <td className="px-4 py-2.5 text-violet-600 font-semibold">{item.looseTabletsPurchased || '—'}</td>
                                            <td className="px-4 py-2.5 font-bold text-blue-700">{item.qty}</td>
                                            <td className="px-4 py-2.5 text-gray-600">₹{item.purchasePrice}</td>
                                            <td className="px-4 py-2.5 text-gray-600">₹{item.sellingPrice}</td>
                                            <td className="px-4 py-2.5 font-bold text-gray-800">₹{(item.qty * item.purchasePrice).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex justify-between items-center bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-3">
                            <div>
                                <span className="text-xs text-gray-400">Entered by: </span>
                                <span className="text-sm font-medium text-gray-700">{viewEntry.enteredBy}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className="text-xs text-blue-600 font-medium">Total Tablets: </span>
                                    <span className="text-sm font-bold text-blue-800">{viewEntry.totalQty}</span>
                                </div>
                                <div>
                                    <span className="text-sm text-emerald-700 font-medium">Grand Total: </span>
                                    <span className="text-xl font-bold text-emerald-800">₹{viewEntry.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        {viewEntry.remarks && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                                <p className="text-xs text-amber-600 font-medium mb-1">Remarks</p>
                                <p className="text-sm text-amber-800">{viewEntry.remarks}</p>
                            </div>
                        )}
                        {isAdmin && (
                            <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => handlePrint(viewEntry)}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-violet-200 text-violet-700 font-medium hover:bg-violet-50 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                    Print
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>

            {/* Delete Confirm */}
            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Stock Entry"
                message={`Are you sure you want to delete entry "${deleteTarget?.invoiceNo}"? This action cannot be undone.`}
            />
        </div>
    );
};

export default StockEntry;
