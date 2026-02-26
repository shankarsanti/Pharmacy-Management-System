import React, { useState, useMemo } from 'react';
import { mockSales } from '../../data/mockData';
import Modal from '../common/Modal';
import Pagination from '../common/Pagination';
import { useAuth } from '../../context/AuthContext';

const Sales = () => {
    const [dateFilter, setDateFilter] = useState('all');
    const [paymentFilter, setPaymentFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [detailSale, setDetailSale] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { user } = useAuth();
    const isAdmin = user?.role === 'Admin';

    const filtered = useMemo(() => {
        let result = [...mockSales];

        // Date filter
        if (dateFilter === 'today') result = result.filter((s) => s.date === '2026-02-25');
        else if (dateFilter === 'yesterday') result = result.filter((s) => s.date === '2026-02-24');

        // Payment filter
        if (paymentFilter) result = result.filter((s) => s.payment === paymentFilter);

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(
                (s) =>
                    s.id.toLowerCase().includes(term) ||
                    s.customer.toLowerCase().includes(term) ||
                    s.billBy.toLowerCase().includes(term) ||
                    s.items.some((it) => it.name.toLowerCase().includes(term))
            );
        }

        return result;
    }, [dateFilter, paymentFilter, searchTerm]);

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const totalRevenue = filtered.reduce((s, x) => s + x.total, 0);
    const totalItems = filtered.reduce((s, x) => s + x.items.reduce((a, i) => a + i.qty, 0), 0);

    const paymentStyles = { Cash: 'bg-emerald-100 text-emerald-700', UPI: 'bg-violet-100 text-violet-700', Card: 'bg-blue-100 text-blue-700' };

    // ──── Print All ────
    const handlePrintAll = () => {
        const data = filtered;
        const totRevenue = data.reduce((s, x) => s + x.total, 0);
        const totItems = data.reduce((s, x) => s + x.items.reduce((a, i) => a + i.qty, 0), 0);
        const totTax = data.reduce((s, x) => s + x.tax, 0);
        const totDiscount = data.reduce((s, x) => s + (x.discount || 0), 0);

        // Payment summary
        const payMap = {};
        data.forEach((s) => {
            if (!payMap[s.payment]) payMap[s.payment] = { count: 0, amount: 0 };
            payMap[s.payment].count++;
            payMap[s.payment].amount += s.total;
        });
        const payRows = Object.entries(payMap).map(([pay, d]) =>
            `<tr><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9"><strong>${pay}</strong></td><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${d.count}</td><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-weight:700">₹${d.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>`
        ).join('');

        // Biller summary
        const billMap = {};
        data.forEach((s) => {
            if (!billMap[s.billBy]) billMap[s.billBy] = { count: 0, amount: 0 };
            billMap[s.billBy].count++;
            billMap[s.billBy].amount += s.total;
        });
        const billRows = Object.entries(billMap).map(([name, d]) =>
            `<tr><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9"><strong>${name}</strong></td><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${d.count}</td><td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-weight:700">₹${d.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></tr>`
        ).join('');

        const saleRows = data.map((s) => `<tr>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9"><strong style="color:#2563eb">${s.id}</strong></td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${s.date}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${s.time}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${s.customer}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${s.items.length} items</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-weight:700">₹${s.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9">${s.payment}</td>
            <td style="padding:7px 10px;border-bottom:1px solid #f1f5f9;font-size:11px;color:#64748b">${s.billBy}</td>
        </tr>`).join('');

        const win = window.open('', '_blank');
        win.document.write(`<html><head><title>Sales Report</title><style>
            @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; padding: 24px; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 16px; }
            .header h1 { font-size: 20px; color: #1e40af; }
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
            .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style></head><body>
            <div class="header">
                <h1>🧾 Sales Report</h1>
                <div class="meta">${data.length} invoices · ₹${totRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}<br>Printed: ${new Date().toLocaleString('en-IN')}<br>PharmaCare Management System</div>
            </div>

            <div class="summary-grid">
                <div class="summary-card" style="background:#ecfdf5"><div class="val" style="color:#047857">₹${totRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div><div class="lbl">Total Revenue</div></div>
                <div class="summary-card" style="background:#eff6ff"><div class="val" style="color:#1d4ed8">${data.length}</div><div class="lbl">Total Invoices</div></div>
                <div class="summary-card" style="background:#faf5ff"><div class="val" style="color:#7c3aed">${totItems}</div><div class="lbl">Items Sold</div></div>
                <div class="summary-card" style="background:#fef3c7"><div class="val" style="color:#b45309">₹${totTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div><div class="lbl">Total Tax</div></div>
            </div>

            <table>
                <thead><tr><th>Invoice</th><th>Date</th><th>Time</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Billed By</th></tr></thead>
                <tbody>${saleRows}
                    <tr style="font-weight:700;border-top:2px solid #cbd5e1;background:#ecfdf5">
                        <td colspan="5" style="padding:8px 10px">Grand Total</td>
                        <td style="padding:8px 10px">₹${totRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                        <td colspan="2" style="padding:8px 10px"></td>
                    </tr>
                </tbody>
            </table>

            <div class="section">
                <div class="two-col">
                    <div>
                        <h3>💳 Payment-Wise Summary</h3>
                        <table>
                            <thead><tr><th>Payment Mode</th><th>Invoices</th><th>Amount</th></tr></thead>
                            <tbody>${payRows}</tbody>
                        </table>
                    </div>
                    <div>
                        <h3>👤 Biller-Wise Summary</h3>
                        <table>
                            <thead><tr><th>Billed By</th><th>Invoices</th><th>Amount</th></tr></thead>
                            <tbody>${billRows}</tbody>
                        </table>
                    </div>
                </div>
            </div>

            ${totDiscount > 0 ? `<div style="margin-top:12px;padding:10px;background:#f0fdf4;border-radius:8px;font-size:12px;color:#15803d"><strong>Total Discounts Given:</strong> ₹${totDiscount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>` : ''}

            <div class="footer">Generated by PharmaCare Management System</div>
        </body></html>`);
        win.document.close();
        win.focus();
        win.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Track all sales transactions and revenue.</p>
                </div>
                <div className="flex gap-2">
                    {[['all', 'All'], ['today', 'Today'], ['yesterday', 'Yesterday']].map(([val, label]) => (
                        <button key={val} onClick={() => { setDateFilter(val); setCurrentPage(1); }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${dateFilter === val ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{label}</button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                    <div className="h-1 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 mt-3"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <p className="text-sm text-gray-500">Total Invoices</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{filtered.length}</p>
                    <div className="h-1 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mt-3"></div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <p className="text-sm text-gray-500">Items Sold</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{totalItems}</p>
                    <div className="h-1 w-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 mt-3"></div>
                </div>
            </div>

            {/* Sales Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Filter Bar */}
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-3 items-center">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <input
                            type="text"
                            placeholder="Search by invoice, customer, biller or medicine..."
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                        />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <select
                        value={paymentFilter}
                        onChange={(e) => { setPaymentFilter(e.target.value); setCurrentPage(1); }}
                        className="px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    >
                        <option value="">All Payments</option>
                        <option value="Cash">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="Card">Card</option>
                    </select>
                    {(searchTerm || paymentFilter) && (
                        <button
                            onClick={() => { setSearchTerm(''); setPaymentFilter(''); setCurrentPage(1); }}
                            className="px-3 py-2.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            Clear
                        </button>
                    )}
                    {isAdmin && (
                        <button onClick={handlePrintAll} className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-all active:scale-95 ml-auto">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Print All
                        </button>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-50/80 border-b border-gray-100">
                            {['Invoice', 'Date', 'Time', 'Customer', 'Items', 'Total', 'Payment', 'Billed By'].map((h) => <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginated.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setDetailSale(sale)}>
                                    <td className="px-5 py-3.5 text-sm font-mono font-bold text-blue-600">{sale.id}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{sale.date}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{sale.time}</td>
                                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{sale.customer}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{sale.items.length}</td>
                                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">₹{sale.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                                    <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${paymentStyles[sale.payment]}`}>{sale.payment}</span></td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{sale.billBy}</td>
                                </tr>
                            ))}
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-16 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-3">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                                            </svg>
                                            <p className="font-medium">No sales found matching your filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>

            {/* Sale Detail Modal */}
            <Modal isOpen={!!detailSale} onClose={() => setDetailSale(null)} title={`Invoice: ${detailSale?.id}`} size="md">
                {detailSale && (
                    <div>
                        <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                            <div><span className="text-gray-400">Date:</span> <span className="font-medium">{detailSale.date}</span></div>
                            <div><span className="text-gray-400">Time:</span> <span className="font-medium">{detailSale.time}</span></div>
                            <div><span className="text-gray-400">Customer:</span> <span className="font-medium">{detailSale.customer}</span></div>
                            <div><span className="text-gray-400">Payment:</span> <span className={`font-semibold px-2 py-0.5 rounded-lg ${paymentStyles[detailSale.payment]}`}>{detailSale.payment}</span></div>
                        </div>
                        <table className="w-full text-sm mb-4">
                            <thead><tr className="border-b border-gray-200"><th className="text-left py-2 text-gray-500">Medicine</th><th className="text-center py-2 text-gray-500">Qty</th><th className="text-right py-2 text-gray-500">Price</th><th className="text-right py-2 text-gray-500">Total</th></tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {detailSale.items.map((item, i) => (
                                    <tr key={i}><td className="py-2 font-medium text-gray-900">{item.name}</td><td className="py-2 text-center">{item.qty}</td><td className="py-2 text-right">₹{item.price}</td><td className="py-2 text-right font-semibold">₹{(item.qty * item.price).toFixed(2)}</td></tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="border-t border-gray-200 pt-3 space-y-1 text-sm">
                            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>₹{detailSale.subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-500"><span>Tax</span><span>₹{detailSale.tax.toFixed(2)}</span></div>
                            {detailSale.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{detailSale.discount}</span></div>}
                            <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t"><span>Total</span><span>₹{detailSale.total.toFixed(2)}</span></div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Sales;
