import React, { useState } from 'react';
import { mockMedicines } from '../../data/mockData';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const POS = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [discountPercent, setDiscountPercent] = useState(0);
    const [showPayment, setShowPayment] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [lastInvoice, setLastInvoice] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerVillage, setCustomerVillage] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const toast = useToast();
    const { user } = useAuth();
    const { settings, generateInvoiceId } = useSettings();
    const canBill = true; // All roles (Admin, Pharmacist) can create bills

    const filteredMedicines = searchTerm.trim()
        ? mockMedicines.filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) && m.stock > 0)
        : mockMedicines.filter((m) => m.stock > 0);

    const addToCart = (med) => {
        const existing = cart.find((i) => i.id === med.id);
        if (existing) {
            if (existing.qty >= med.stock) { toast.warning(`Max stock reached for ${med.name}`); return; }
            setCart(cart.map((i) => i.id === med.id ? { ...i, qty: i.qty + 1 } : i));
        } else {
            setCart([...cart, { ...med, qty: 1, price: med.sellingPrice }]);
        }
    };

    const updateQty = (id, newQty) => {
        if (newQty < 1) { setCart(cart.filter((i) => i.id !== id)); return; }
        const med = mockMedicines.find((m) => m.id === id);
        if (med && newQty > med.stock) { toast.warning(`Only ${med.stock} units available`); return; }
        setCart(cart.map((i) => i.id === id ? { ...i, qty: newQty } : i));
    };

    const removeFromCart = (id) => setCart(cart.filter((i) => i.id !== id));

    const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const discountAmount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - discountAmount;
    const cgstAmt = settings.enableTax ? (afterDiscount * settings.cgstRate) / 100 : 0;
    const sgstAmt = settings.enableTax ? (afterDiscount * settings.sgstRate) / 100 : 0;
    const tax = cgstAmt + sgstAmt;
    const rawTotal = afterDiscount + tax;
    const grandTotal = settings.roundOffTotal ? Math.round(rawTotal) : rawTotal;
    const roundOff = grandTotal - rawTotal;

    const handleCheckout = () => {
        if (cart.length === 0) { toast.warning('Cart is empty!'); return; }
        setShowPayment(true);
    };

    const processPayment = () => {
        if (!customerName.trim()) { toast.warning('Please enter customer name'); return; }
        const invoice = {
            id: generateInvoiceId(),
            date: new Date().toLocaleDateString('en-IN'),
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            items: [...cart],
            subtotal, tax, cgstAmt, sgstAmt, discountPercent, discountAmount, roundOff, total: grandTotal,
            payment: paymentMethod,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerVillage: customerVillage.trim(),
            doctorName: doctorName.trim(),
            billedBy: user?.name || 'Staff',
            // snapshot settings at billing time
            pharmacyName: settings.pharmacyName,
            pharmacyAddress: settings.pharmacyAddress,
            pharmacyPhone: settings.pharmacyPhone,
            gstNumber: settings.gstNumber,
            showLogo: settings.showPharmacyLogo,
            showGst: settings.showGstOnInvoice,
            enableTax: settings.enableTax,
            cgstRate: settings.cgstRate,
            sgstRate: settings.sgstRate,
            footerMessage: settings.printFooterMessage,
            currency: settings.currency,
        };
        setLastInvoice(invoice);
        setShowPayment(false);
        setShowInvoice(true);
        setCart([]);
        setDiscountPercent(0);
        setCustomerName('');
        setCustomerPhone('');
        setCustomerVillage('');
        setDoctorName('');
        toast.success('Sale completed successfully!');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
                <p className="text-sm text-gray-500 mt-1">Search, add to cart, and process billing.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
                {/* LEFT — Medicine List */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 190px)' }}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                            <input type="text" placeholder="Search medicines..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                        {filteredMedicines.map((med) => {
                            const inCart = cart.find((i) => i.id === med.id);
                            return (
                                <div key={med.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-blue-50/30 transition-colors">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900">{med.name}</p>
                                        <div className="flex items-center gap-3 mt-0.5">
                                            <span className="text-xs text-gray-400 font-mono">{med.id}</span>
                                            <span className="text-xs text-emerald-600 font-medium">Stock: {med.stock}</span>
                                            <span className="text-xs text-gray-400">{med.category}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-800">₹{med.sellingPrice}</span>
                                        <button onClick={() => addToCart(med)} disabled={!canBill} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${!canBill ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : inCart ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}>
                                            {!canBill ? 'View Only' : inCart ? `Added (${inCart.qty})` : '+ Add'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        {filteredMedicines.length === 0 && <div className="px-6 py-16 text-center text-gray-400"><p className="font-medium">No medicines found</p></div>}
                    </div>
                </div>

                {/* RIGHT — Cart */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 190px)' }}>
                    <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                            <h2 className="text-lg font-bold text-gray-900">Cart</h2>
                        </div>
                        {cart.length > 0 && <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-bold">{cart.length}</span>}
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {cart.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-12 text-gray-300">
                                <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                                <p className="font-medium text-gray-400">Cart is empty</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-50">
                                {cart.map((item) => (
                                    <div key={item.id} className="px-5 py-3.5">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-400">₹{item.price} each</p>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">−</button>
                                                <input type="number" min="1" value={item.qty} onChange={(e) => updateQty(item.id, parseInt(e.target.value) || 1)} className="w-12 h-7 text-center text-sm font-semibold border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                                <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm font-bold">+</button>
                                            </div>
                                            <p className="text-sm font-bold text-gray-900">₹{(item.price * item.qty).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bill Summary */}
                    <div className="border-t border-gray-200 p-5 bg-gray-50/80 space-y-3">
                        <div className="space-y-1.5 text-sm">
                            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{settings.currency}{subtotal.toFixed(2)}</span></div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Discount (%)</span>
                                <div className="flex items-center gap-1">
                                    <input type="number" min="0" max={settings.maxDiscountLimit} value={discountPercent} onChange={(e) => setDiscountPercent(Math.min(settings.maxDiscountLimit, Math.max(0, +e.target.value)))} className="w-16 h-6 text-right text-sm border border-gray-200 rounded-lg px-2 focus:outline-none focus:ring-1 focus:ring-blue-400" />
                                    <span className="text-xs">%</span>
                                </div>
                            </div>
                            {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({discountPercent}%)</span><span>-{settings.currency}{discountAmount.toFixed(2)}</span></div>}
                            {settings.enableTax && <div className="flex justify-between text-gray-500"><span>CGST ({settings.cgstRate}%)</span><span>+{settings.currency}{cgstAmt.toFixed(2)}</span></div>}
                            {settings.enableTax && <div className="flex justify-between text-gray-500"><span>SGST ({settings.sgstRate}%)</span><span>+{settings.currency}{sgstAmt.toFixed(2)}</span></div>}
                            {settings.roundOffTotal && roundOff !== 0 && <div className="flex justify-between text-gray-400 text-xs"><span>Round Off</span><span>{roundOff >= 0 ? '+' : ''}{settings.currency}{roundOff.toFixed(2)}</span></div>}
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="font-bold text-gray-900">Grand Total</span>
                                <span className="text-xl font-bold text-gray-900">{settings.currency}{grandTotal.toFixed(2)}</span>
                            </div>
                        </div>
                        <button onClick={handleCheckout} disabled={cart.length === 0} className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${cart.length > 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg shadow-emerald-500/25' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                            {cart.length > 0 ? `Proceed to Payment — ₹${grandTotal.toFixed(2)}` : 'Add items to checkout'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="Checkout" size="md">
                {/* Customer Details */}
                <div className="mb-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        Customer Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Customer Name *</label>
                            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g., Rajesh Kumar" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Phone Number</label>
                            <input type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="e.g., +91 98765 43210" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Village / Town</label>
                            <input type="text" value={customerVillage} onChange={(e) => setCustomerVillage(e.target.value)} placeholder="e.g., Andheri, Mumbai" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 mb-1">Doctor / Prescribed By</label>
                            <input type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="e.g., Dr. Sunita Mehta" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Payment Method
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {['Cash', 'UPI', 'Card'].map((method) => (
                            <button key={method} onClick={() => setPaymentMethod(method)} className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all ${paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <span className="text-xl">{method === 'Cash' ? '💵' : method === 'UPI' ? '📱' : '💳'}</span>
                                <span className={`text-xs font-semibold ${paymentMethod === method ? 'text-blue-700' : 'text-gray-500'}`}>{method}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="p-4 bg-gray-50 rounded-xl mb-4">
                    <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-gray-500"><span>Items ({cart.length})</span><span>₹{subtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between text-gray-500"><span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div>
                        {discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({discountPercent}%)</span><span>-₹{discountAmount.toFixed(2)}</span></div>}
                        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200"><span>Total</span><span>₹{grandTotal.toFixed(2)}</span></div>
                    </div>
                </div>
                <button onClick={processPayment} className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] ${customerName.trim() ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-500/25' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                    Complete Payment — ₹{grandTotal.toFixed(2)}
                </button>
            </Modal>

            {/* Invoice Modal */}
            <Modal isOpen={showInvoice} onClose={() => setShowInvoice(false)} title="Invoice / Receipt" size="md">
                {lastInvoice && (
                    <div id="invoice-print">
                        <div className="text-center mb-5 pb-4 border-b border-dashed border-gray-300">
                            {lastInvoice.showLogo && (
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/20">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                </div>
                            )}
                            <h2 className="text-xl font-bold text-gray-900">{lastInvoice.pharmacyName}</h2>
                            <p className="text-xs text-gray-400">{lastInvoice.pharmacyAddress}</p>
                            <p className="text-xs text-gray-400">{lastInvoice.pharmacyPhone}</p>
                            {lastInvoice.showGst && lastInvoice.gstNumber && <p className="text-xs text-gray-500 mt-1 font-mono">GSTIN: {lastInvoice.gstNumber}</p>}
                            <div className="mt-3 pt-3 border-t border-dashed border-gray-200">
                                <p className="text-sm text-gray-500">Invoice: <span className="font-mono font-bold text-blue-600">{lastInvoice.id}</span></p>
                                <p className="text-xs text-gray-400">{lastInvoice.date} at {lastInvoice.time}</p>
                            </div>
                        </div>
                        {/* Customer Info */}
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5 pb-4 border-b border-dashed border-gray-300 text-sm">
                            <div><span className="text-gray-400 text-xs">Customer</span><p className="font-semibold text-gray-900">{lastInvoice.customerName}</p></div>
                            <div><span className="text-gray-400 text-xs">Phone</span><p className="font-semibold text-gray-900">{lastInvoice.customerPhone || '—'}</p></div>
                            {lastInvoice.customerVillage && <div><span className="text-gray-400 text-xs">Village / Town</span><p className="font-semibold text-gray-900">{lastInvoice.customerVillage}</p></div>}
                            {lastInvoice.doctorName && <div><span className="text-gray-400 text-xs">Doctor</span><p className="font-semibold text-gray-900">{lastInvoice.doctorName}</p></div>}
                            <div><span className="text-gray-400 text-xs">Billed By</span><p className="font-semibold text-gray-900">{lastInvoice.billedBy}</p></div>
                        </div>
                        <table className="w-full text-sm mb-4">
                            <thead><tr className="border-b border-gray-200 text-gray-500"><th className="text-left py-2">Item</th><th className="text-center py-2">Qty</th><th className="text-right py-2">Price</th><th className="text-right py-2">Total</th></tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {lastInvoice.items.map((item) => (
                                    <tr key={item.id}><td className="py-2 font-medium text-gray-900">{item.name}</td><td className="py-2 text-center text-gray-600">{item.qty}</td><td className="py-2 text-right text-gray-600">{lastInvoice.currency}{item.price}</td><td className="py-2 text-right font-semibold">{lastInvoice.currency}{(item.price * item.qty).toFixed(2)}</td></tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="border-t border-dashed border-gray-300 pt-3 space-y-1.5 text-sm">
                            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{lastInvoice.currency}{lastInvoice.subtotal.toFixed(2)}</span></div>
                            {lastInvoice.discountAmount > 0 && <div className="flex justify-between text-green-600"><span>Discount ({lastInvoice.discountPercent}%)</span><span>-{lastInvoice.currency}{lastInvoice.discountAmount.toFixed(2)}</span></div>}
                            {lastInvoice.enableTax && lastInvoice.showGst && (
                                <>
                                    <div className="flex justify-between text-gray-500"><span>CGST ({lastInvoice.cgstRate}%)</span><span>+{lastInvoice.currency}{lastInvoice.cgstAmt.toFixed(2)}</span></div>
                                    <div className="flex justify-between text-gray-500"><span>SGST ({lastInvoice.sgstRate}%)</span><span>+{lastInvoice.currency}{lastInvoice.sgstAmt.toFixed(2)}</span></div>
                                </>
                            )}
                            {lastInvoice.enableTax && !lastInvoice.showGst && <div className="flex justify-between text-gray-500"><span>Tax ({lastInvoice.cgstRate + lastInvoice.sgstRate}%)</span><span>+{lastInvoice.currency}{lastInvoice.tax.toFixed(2)}</span></div>}
                            {lastInvoice.roundOff !== 0 && <div className="flex justify-between text-gray-400 text-xs"><span>Round Off</span><span>{lastInvoice.roundOff >= 0 ? '+' : ''}{lastInvoice.currency}{lastInvoice.roundOff.toFixed(2)}</span></div>}
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200"><span>Grand Total</span><span>{lastInvoice.currency}{lastInvoice.total.toFixed(2)}</span></div>
                            <div className="flex justify-between text-gray-400 text-xs mt-2"><span>Payment</span><span>{lastInvoice.payment}</span></div>
                        </div>
                        {/* Footer Message */}
                        {lastInvoice.footerMessage && (
                            <div className="mt-4 pt-4 border-t border-dashed border-gray-300 text-center">
                                <p className="text-xs text-gray-400 italic">{lastInvoice.footerMessage}</p>
                            </div>
                        )}
                        <div className="mt-6 flex gap-3">
                            <button onClick={() => window.print()} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                Print
                            </button>
                            <button onClick={() => setShowInvoice(false)} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm">Done</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default POS;
