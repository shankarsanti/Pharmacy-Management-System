import React, { useState } from 'react';
import { mockMedicines, mockSales, mockSuppliers, getLowStockMedicines, getOutOfStockMedicines, getExpiringSoonMedicines, getStockDisplay } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('inventory');
    const toast = useToast();
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    const tabs = [
        { id: 'inventory', label: 'Inventory Report', icon: '📦' },
        { id: 'sales', label: 'Sales Report', icon: '💰' },
        { id: 'expiry', label: 'Expiry Report', icon: '⏰' },
        { id: 'supplier', label: 'Supplier Report', icon: '🚚' },
    ];

    const totalStock = mockMedicines.reduce((s, m) => s + m.stock, 0);
    const totalValue = mockMedicines.reduce((s, m) => s + m.sellingPrice * m.stock, 0);
    const totalRevenue = mockSales.reduce((s, x) => s + x.total, 0);
    const lowStock = getLowStockMedicines();
    const outOfStock = getOutOfStockMedicines();
    const expiringSoon = getExpiringSoonMedicines(90);

    // ─── Build Report Data for current tab ───
    const getReportData = () => {
        switch (activeTab) {
            case 'inventory': {
                const categories = ['Antibiotic', 'Painkiller', 'Vitamin', 'Diabetes', 'Respiratory', 'Gastro', 'Cholesterol', 'Antihistamine'];
                const headers = ['Category', 'Products', 'Total Stock (Tablets)', 'Stock Value (₹)'];
                const rows = categories.map((cat) => {
                    const catMeds = mockMedicines.filter((m) => m.category === cat);
                    return [
                        cat,
                        catMeds.length,
                        catMeds.reduce((s, m) => s + m.stock, 0),
                        catMeds.reduce((s, m) => s + m.sellingPrice * m.stock, 0),
                    ];
                });
                const summary = [
                    { label: 'Total Products', value: mockMedicines.length },
                    { label: 'Total Stock (Tablets)', value: totalStock.toLocaleString('en-IN') },
                    { label: 'Stock Value', value: `₹${totalValue.toLocaleString('en-IN')}` },
                    { label: 'Low / Out of Stock', value: lowStock.length + outOfStock.length },
                ];

                // Also build a detailed medicines table
                const detailHeaders = ['ID', 'Medicine', 'Category', 'Type', 'Tablets/Strip', 'Stock (Tablets)', 'Equivalent', 'Strip Price (₹)', 'Loose Price (₹)', 'Stock Value (₹)', 'Expiry'];
                const detailRows = mockMedicines.map((m) => {
                    const isTablet = m.medicineType === 'Tablet' && m.tabletsPerStrip > 1;
                    const sd = isTablet ? getStockDisplay(m.stock, m.tabletsPerStrip) : null;
                    return [
                        m.id,
                        m.name,
                        m.category,
                        m.medicineType || 'Tablet',
                        m.tabletsPerStrip || 1,
                        m.stock,
                        sd ? `${sd.strips}s + ${sd.loose}t` : '-',
                        m.stripPrice || m.sellingPrice,
                        m.allowLooseSale ? (m.looseTabletPrice || '-') : 'N/A',
                        m.stock * (m.sellingPrice || 0),
                        m.expiry,
                    ];
                });
                return { title: 'Inventory Report', headers, rows, summary, detailHeaders, detailRows };
            }
            case 'sales': {
                const headers = ['Invoice #', 'Date', 'Time', 'Customer', 'Items', 'Subtotal (₹)', 'Tax (₹)', 'Discount (₹)', 'Total (₹)', 'Payment', 'Billed By'];
                const rows = mockSales.map((s) => [
                    s.id, s.date, s.time, s.customer, s.items.length,
                    s.subtotal, s.tax, s.discount, s.total, s.payment, s.billBy,
                ]);
                const cashTotal = mockSales.filter((s) => s.payment === 'Cash').reduce((sum, s) => sum + s.total, 0);
                const upiTotal = mockSales.filter((s) => s.payment === 'UPI').reduce((sum, s) => sum + s.total, 0);
                const cardTotal = mockSales.filter((s) => s.payment === 'Card').reduce((sum, s) => sum + s.total, 0);
                const summary = [
                    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}` },
                    { label: 'Total Invoices', value: mockSales.length },
                    { label: 'Avg Transaction', value: `₹${Math.round(totalRevenue / mockSales.length).toLocaleString('en-IN')}` },
                    { label: 'Cash', value: `₹${cashTotal.toLocaleString('en-IN')}` },
                    { label: 'UPI', value: `₹${upiTotal.toLocaleString('en-IN')}` },
                    { label: 'Card', value: `₹${cardTotal.toLocaleString('en-IN')}` },
                ];
                return { title: 'Sales Report', headers, rows, summary };
            }
            case 'expiry': {
                const headers = ['ID', 'Medicine', 'Batch', 'Category', 'Stock (Tablets)', 'Expiry Date', 'Value at Risk (₹)'];
                const rows = expiringSoon.map((m) => [
                    m.id, m.name, m.batch, m.category, m.stock, m.expiry, m.sellingPrice * m.stock,
                ]);
                const totalRiskValue = expiringSoon.reduce((s, m) => s + m.sellingPrice * m.stock, 0);
                const summary = [
                    { label: 'Expiring Within 90 Days', value: expiringSoon.length },
                    { label: 'Total Value at Risk', value: `₹${totalRiskValue.toLocaleString('en-IN')}` },
                ];
                return { title: 'Expiry Report (Within 90 Days)', headers, rows, summary };
            }
            case 'supplier': {
                const headers = ['Supplier ID', 'Supplier Name', 'Contact', 'Phone', 'Status', 'Medicines Supplied', 'Total Orders', 'Last Order'];
                const rows = mockSuppliers.map((s) => {
                    const supplied = mockMedicines.filter((m) => m.supplier === s.id).length;
                    return [s.id, s.name, s.contact, s.phone, s.status, supplied, s.totalOrders, s.lastOrder];
                });
                const summary = [
                    { label: 'Total Suppliers', value: mockSuppliers.length },
                    { label: 'Active', value: mockSuppliers.filter((s) => s.status === 'Active').length },
                    { label: 'Inactive', value: mockSuppliers.filter((s) => s.status === 'Inactive').length },
                ];
                return { title: 'Supplier Report', headers, rows, summary };
            }
            default:
                return { title: 'Report', headers: [], rows: [], summary: [] };
        }
    };

    // ─── EXPORT CSV ───
    const handleExportCSV = () => {
        const { title, headers, rows, summary, detailHeaders, detailRows } = getReportData();
        const lines = [];

        // Title & date
        lines.push(title);
        lines.push(`Generated on: ${new Date().toLocaleString('en-IN')}`);
        lines.push('');

        // Summary
        lines.push('--- Summary ---');
        summary.forEach((s) => lines.push(`${s.label},${s.value}`));
        lines.push('');

        // Main table
        lines.push('--- Report Data ---');
        lines.push(headers.join(','));
        rows.forEach((row) => {
            lines.push(row.map((cell) => {
                const str = String(cell);
                // Wrap in quotes if cell contains comma
                return str.includes(',') ? `"${str}"` : str;
            }).join(','));
        });

        // Detailed medicines table for inventory
        if (detailHeaders && detailRows) {
            lines.push('');
            lines.push('--- Detailed Medicine List ---');
            lines.push(detailHeaders.join(','));
            detailRows.forEach((row) => {
                lines.push(row.map((cell) => {
                    const str = String(cell);
                    return str.includes(',') ? `"${str}"` : str;
                }).join(','));
            });
        }

        const csv = lines.join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success(`${title} exported as CSV successfully!`);
    };

    // ─── EXPORT PDF (via print window) ───
    const handleExportPDF = () => {
        const { title, headers, rows, summary, detailHeaders, detailRows } = getReportData();

        const summaryCards = summary.map((s) =>
            `<div style="flex:1;min-width:140px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px">
                <p style="font-size:11px;color:#94a3b8;margin:0;text-transform:uppercase;letter-spacing:0.5px">${s.label}</p>
                <p style="font-size:20px;font-weight:700;color:#1e293b;margin:6px 0 0">${s.value}</p>
            </div>`
        ).join('');

        const tableHeaders = headers.map((h) =>
            `<th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;color:#64748b;background:#f1f5f9;border-bottom:2px solid #e2e8f0;letter-spacing:0.5px">${h}</th>`
        ).join('');

        const tableRows = rows.map((row, i) =>
            `<tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
                ${row.map((cell) => `<td style="padding:8px 12px;font-size:12px;color:#334155;border-bottom:1px solid #f1f5f9">${typeof cell === 'number' ? cell.toLocaleString('en-IN') : cell}</td>`).join('')}
            </tr>`
        ).join('');

        // Build detailed table for inventory if available
        let detailSection = '';
        if (detailHeaders && detailRows) {
            const dHeaders = detailHeaders.map((h) =>
                `<th style="padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;color:#64748b;background:#f1f5f9;border-bottom:2px solid #e2e8f0;letter-spacing:0.5px">${h}</th>`
            ).join('');
            const dRows = detailRows.map((row, i) =>
                `<tr style="background:${i % 2 === 0 ? '#fff' : '#fafafa'}">
                    ${row.map((cell) => `<td style="padding:6px 10px;font-size:11px;color:#334155;border-bottom:1px solid #f1f5f9">${typeof cell === 'number' ? cell.toLocaleString('en-IN') : cell}</td>`).join('')}
                </tr>`
            ).join('');
            detailSection = `
                <div style="margin-top:28px">
                    <h3 style="font-size:15px;font-weight:700;color:#1e293b;margin-bottom:12px">📋 Detailed Medicine List</h3>
                    <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
                        <thead><tr>${dHeaders}</tr></thead>
                        <tbody>${dRows}</tbody>
                    </table>
                </div>
            `;
        }

        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${title} — PharmaCare</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; padding: 40px; color: #334155; background: #fff; }
                @media print {
                    body { padding: 20px; }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            <div style="text-align:center;margin-bottom:28px;padding-bottom:20px;border-bottom:2px solid #e2e8f0">
                <div style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#3b82f6,#06b6d4);margin-bottom:12px">
                    <span style="font-size:24px;color:#fff">💊</span>
                </div>
                <h1 style="font-size:22px;font-weight:800;color:#0f172a;margin-bottom:4px">PharmaCare — ${title}</h1>
                <p style="font-size:12px;color:#94a3b8">Generated on ${new Date().toLocaleString('en-IN')} • Pharmacy Management System</p>
            </div>

            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px">
                ${summaryCards}
            </div>

            <h3 style="font-size:15px;font-weight:700;color:#1e293b;margin-bottom:12px">📊 ${activeTab === 'inventory' ? 'Stock Summary by Category' : activeTab === 'sales' ? 'Sales Transactions' : activeTab === 'expiry' ? 'Expiring Medicines' : 'Supplier Details'}</h3>
            <table style="width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden">
                <thead><tr>${tableHeaders}</tr></thead>
                <tbody>
                    ${tableRows}
                    ${rows.length === 0 ? '<tr><td colspan="' + headers.length + '" style="padding:24px;text-align:center;color:#94a3b8;font-size:13px">No data available</td></tr>' : ''}
                </tbody>
            </table>

            ${detailSection}

            <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center">
                <p style="font-size:10px;color:#cbd5e1">This is a system-generated report from PharmaCare Management System. Confidential — for internal use only.</p>
            </div>

            <div class="no-print" style="margin-top:24px;text-align:center">
                <button onclick="window.print()" style="padding:10px 28px;background:#3b82f6;color:#fff;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer">
                    🖨️ Print / Save as PDF
                </button>
            </div>

            <script>
                window.onload = function() { window.print(); };
                window.onafterprint = function() { window.close(); };
            <\/script>
        </body>
        </html>`;

        const printWindow = window.open('', '_blank', 'width=1000,height=700');
        if (printWindow) {
            printWindow.document.write(html);
            printWindow.document.close();
            toast.success(`${title} PDF export initiated!`);
        } else {
            toast.error('Pop-up blocked! Please allow pop-ups to export PDF.');
        }
    };

    const handleExport = (format) => {
        if (format === 'csv') {
            handleExportCSV();
        } else {
            handleExportPDF();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Generate and export pharmacy reports.</p>
                </div>
                {isAdmin && (
                    <div className="flex gap-2">
                        <button onClick={() => handleExport('pdf')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-medium hover:bg-red-100 border border-red-200 transition-all active:scale-95 shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Export PDF
                        </button>
                        <button onClick={() => handleExport('csv')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-100 border border-emerald-200 transition-all active:scale-95 shadow-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            Export CSV
                        </button>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 flex-wrap">
                {tabs.map((tab) => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Inventory Report */}
            {activeTab === 'inventory' && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {[['Total Products', mockMedicines.length, 'from-blue-500 to-blue-600'], ['Total Stock', totalStock.toLocaleString('en-IN'), 'from-emerald-500 to-emerald-600'], ['Stock Value', `₹${totalValue.toLocaleString('en-IN')}`, 'from-violet-500 to-purple-600'], ['Low/Out Stock', `${lowStock.length + outOfStock.length}`, 'from-red-500 to-rose-600']].map(([l, v, c]) => (
                            <div key={l} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"><p className="text-sm text-gray-500">{l}</p><p className="text-2xl font-bold text-gray-900 mt-1">{v}</p><div className={`h-1 w-10 rounded-full bg-gradient-to-r ${c} mt-3`}></div></div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-bold">Stock Summary by Category</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left"><thead><tr className="bg-gray-50/80 border-b">{['Category', 'Products', 'Total Stock (Tablets)', 'Total Value'].map((h) => <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {['Antibiotic', 'Painkiller', 'Vitamin', 'Diabetes', 'Respiratory', 'Gastro', 'Cholesterol', 'Antihistamine'].map((cat) => {
                                        const catMeds = mockMedicines.filter((m) => m.category === cat);
                                        return (
                                            <tr key={cat} className="hover:bg-gray-50"><td className="px-5 py-3 text-sm font-semibold text-gray-900">{cat}</td><td className="px-5 py-3 text-sm text-gray-600">{catMeds.length}</td><td className="px-5 py-3 text-sm text-gray-600">{catMeds.reduce((s, m) => s + m.stock, 0)} tablets</td><td className="px-5 py-3 text-sm font-medium text-gray-700">₹{catMeds.reduce((s, m) => s + m.sellingPrice * m.stock, 0).toLocaleString('en-IN')}</td></tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Sales Report */}
            {activeTab === 'sales' && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[['Total Revenue', `₹${totalRevenue.toLocaleString('en-IN')}`, 'from-emerald-500 to-emerald-600'], ['Total Invoices', mockSales.length, 'from-blue-500 to-blue-600'], ['Avg Transaction', `₹${Math.round(totalRevenue / mockSales.length).toLocaleString('en-IN')}`, 'from-violet-500 to-purple-600']].map(([l, v, c]) => (
                            <div key={l} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"><p className="text-sm text-gray-500">{l}</p><p className="text-2xl font-bold text-gray-900 mt-1">{v}</p><div className={`h-1 w-10 rounded-full bg-gradient-to-r ${c} mt-3`}></div></div>
                        ))}
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold mb-4">Sales by Payment Method</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {['Cash', 'UPI', 'Card'].map((method) => {
                                const methodSales = mockSales.filter((s) => s.payment === method);
                                const methodTotal = methodSales.reduce((s, x) => s + x.total, 0);
                                return (
                                    <div key={method} className="text-center p-4 rounded-xl bg-gray-50">
                                        <p className="text-2xl mb-2">{method === 'Cash' ? '💵' : method === 'UPI' ? '📱' : '💳'}</p>
                                        <p className="text-lg font-bold text-gray-900">₹{methodTotal.toLocaleString('en-IN')}</p>
                                        <p className="text-xs text-gray-400 mt-1">{methodSales.length} transactions</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Sales Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-bold">All Transactions</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left"><thead><tr className="bg-gray-50/80 border-b">{['Invoice', 'Date', 'Customer', 'Items', 'Total', 'Payment', 'Billed By'].map((h) => <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {mockSales.map((sale) => (
                                        <tr key={sale.id} className="hover:bg-gray-50">
                                            <td className="px-5 py-3 text-sm font-semibold text-blue-600">{sale.id}</td>
                                            <td className="px-5 py-3 text-sm text-gray-600">{sale.date}</td>
                                            <td className="px-5 py-3 text-sm text-gray-900">{sale.customer}</td>
                                            <td className="px-5 py-3 text-sm text-gray-600">{sale.items.length}</td>
                                            <td className="px-5 py-3 text-sm font-bold text-gray-900">₹{sale.total.toLocaleString('en-IN')}</td>
                                            <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${sale.payment === 'Cash' ? 'bg-emerald-50 text-emerald-700' : sale.payment === 'UPI' ? 'bg-violet-50 text-violet-700' : 'bg-blue-50 text-blue-700'}`}>{sale.payment}</span></td>
                                            <td className="px-5 py-3 text-sm text-gray-500">{sale.billBy}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Expiry Report */}
            {activeTab === 'expiry' && (
                <div className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <p className="text-sm text-gray-500">Expiring Within 90 Days</p>
                            <p className="text-2xl font-bold text-amber-600 mt-1">{expiringSoon.length} medicines</p>
                            <div className="h-1 w-10 rounded-full bg-gradient-to-r from-amber-400 to-red-500 mt-3"></div>
                        </div>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                            <p className="text-sm text-gray-500">Total Value at Risk</p>
                            <p className="text-2xl font-bold text-red-600 mt-1">₹{expiringSoon.reduce((s, m) => s + m.sellingPrice * m.stock, 0).toLocaleString('en-IN')}</p>
                            <div className="h-1 w-10 rounded-full bg-gradient-to-r from-red-500 to-rose-600 mt-3"></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-bold">{expiringSoon.length} Medicines Expiring Within 90 Days</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left"><thead><tr className="bg-gray-50/80 border-b">{['Medicine', 'Batch', 'Stock', 'Expiry', 'Value at Risk'].map((h) => <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                                <tbody className="divide-y divide-gray-50">
                                    {expiringSoon.map((m) => (
                                        <tr key={m.id} className="hover:bg-gray-50"><td className="px-5 py-3 text-sm font-semibold text-gray-900">{m.name}</td><td className="px-5 py-3 text-sm font-mono text-gray-500">{m.batch}</td><td className="px-5 py-3 text-sm font-bold text-gray-700">{m.stock} tablets</td><td className="px-5 py-3 text-sm text-red-600 font-medium">{m.expiry}</td><td className="px-5 py-3 text-sm font-bold text-red-600">₹{(m.sellingPrice * m.stock).toLocaleString('en-IN')}</td></tr>
                                    ))}
                                    {expiringSoon.length === 0 && <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-400">No medicines expiring within 90 days ✅</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Supplier Report */}
            {activeTab === 'supplier' && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100"><h2 className="text-lg font-bold">Supplier Summary</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left"><thead><tr className="bg-gray-50/80 border-b">{['Supplier', 'Contact', 'Status', 'Medicines Supplied', 'Total Orders', 'Last Order'].map((h) => <th key={h} className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase">{h}</th>)}</tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {mockSuppliers.map((s) => {
                                    const supplied = mockMedicines.filter((m) => m.supplier === s.id).length;
                                    return <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-5 py-3 text-sm font-semibold text-gray-900">{s.name}</td>
                                        <td className="px-5 py-3 text-sm text-gray-500">{s.contact} • {s.phone}</td>
                                        <td className="px-5 py-3"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${s.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : s.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{s.status}</span></td>
                                        <td className="px-5 py-3 text-sm text-gray-600">{supplied}</td>
                                        <td className="px-5 py-3 text-sm font-medium text-gray-700">{s.totalOrders}</td>
                                        <td className="px-5 py-3 text-sm text-gray-500">{s.lastOrder}</td>
                                    </tr>;
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reports;
