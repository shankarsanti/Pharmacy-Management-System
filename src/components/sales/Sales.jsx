import React, { useState } from 'react';
import { mockSales } from '../../data/mockData';
import Modal from '../common/Modal';

const Sales = () => {
    const [dateFilter, setDateFilter] = useState('all');
    const [detailSale, setDetailSale] = useState(null);

    const filtered = dateFilter === 'all' ? mockSales
        : dateFilter === 'today' ? mockSales.filter((s) => s.date === '2026-02-25')
            : dateFilter === 'yesterday' ? mockSales.filter((s) => s.date === '2026-02-24')
                : mockSales;

    const totalRevenue = filtered.reduce((s, x) => s + x.total, 0);
    const totalItems = filtered.reduce((s, x) => s + x.items.reduce((a, i) => a + i.qty, 0), 0);

    const paymentStyles = { Cash: 'bg-emerald-100 text-emerald-700', UPI: 'bg-violet-100 text-violet-700', Card: 'bg-blue-100 text-blue-700' };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Sales Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Track all sales transactions and revenue.</p>
                </div>
                <div className="flex gap-2">
                    {[['all', 'All'], ['today', 'Today'], ['yesterday', 'Yesterday']].map(([val, label]) => (
                        <button key={val} onClick={() => setDateFilter(val)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${dateFilter === val ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{label}</button>
                    ))}
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <p className="text-sm text-gray-500">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="bg-gray-50/80 border-b border-gray-100">
                            {['Invoice', 'Date', 'Time', 'Customer', 'Items', 'Total', 'Payment', 'Billed By'].map((h) => <th key={h} className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>)}
                        </tr></thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setDetailSale(sale)}>
                                    <td className="px-5 py-3.5 text-sm font-mono font-bold text-blue-600">{sale.id}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{sale.date}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{sale.time}</td>
                                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{sale.customer}</td>
                                    <td className="px-5 py-3.5 text-sm text-gray-600">{sale.items.length}</td>
                                    <td className="px-5 py-3.5 text-sm font-bold text-gray-900">₹{sale.total.toLocaleString('en-IN')}</td>
                                    <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${paymentStyles[sale.payment]}`}>{sale.payment}</span></td>
                                    <td className="px-5 py-3.5 text-sm text-gray-500">{sale.billBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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
