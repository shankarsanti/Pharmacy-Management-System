import React, { useState } from 'react';
import { mockMedicines, getStockDisplay } from '../../data/mockData';
import Modal from '../common/Modal';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { QRCodeSVG } from 'qrcode.react';


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
    const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
    const [doctorSearch, setDoctorSearch] = useState('');
    const [showAddDoctorInline, setShowAddDoctorInline] = useState(false);
    const [newDoctorName, setNewDoctorName] = useState('');
    const [newDoctorPhone, setNewDoctorPhone] = useState('');
    const [newDoctorSpec, setNewDoctorSpec] = useState('');
    // Sale type modal state
    const [showSaleTypeModal, setShowSaleTypeModal] = useState(false);
    const [selectedMed, setSelectedMed] = useState(null);
    const [saleType, setSaleType] = useState('strip'); // 'strip' or 'loose'
    const [saleQty, setSaleQty] = useState(1);

    const toast = useToast();
    const { user } = useAuth();
    const { settings, generateInvoiceId, doctors, addDoctor } = useSettings();
    const canBill = true;

    const filteredMedicines = searchTerm.trim()
        ? mockMedicines.filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()) && m.stock > 0)
        : mockMedicines.filter((m) => m.stock > 0);

    // Open sale type chooser for a medicine
    const openSaleTypeModal = (med) => {
        setSelectedMed(med);
        const isTablet = med.medicineType === 'Tablet' && med.tabletsPerStrip > 1;
        // Default to strip sale if tablet type, otherwise unit sale
        if (isTablet) {
            setSaleType('strip');
        } else {
            setSaleType('unit');
        }
        setSaleQty(1);
        setShowSaleTypeModal(true);
    };

    // Calculate tablets to deduct based on sale type
    const getTabletsToDeduct = () => {
        if (!selectedMed) return 0;
        if (saleType === 'strip') {
            return saleQty * (selectedMed.tabletsPerStrip || 1);
        }
        return saleQty; // loose or unit
    };

    // Calculate price for sale
    const getSalePrice = () => {
        if (!selectedMed) return 0;
        if (saleType === 'strip') {
            return selectedMed.stripPrice || selectedMed.sellingPrice;
        }
        if (saleType === 'loose') {
            return selectedMed.looseTabletPrice || 0;
        }
        return selectedMed.sellingPrice; // unit (syrup, inhaler, etc.)
    };

    // Confirm adding item to cart
    const confirmAddToCart = () => {
        if (!selectedMed) return;
        const tabletsToDeduct = getTabletsToDeduct();
        const price = getSalePrice();

        // Check if already in cart and accumulate total tablets
        const existingCartTablets = cart
            .filter((i) => i.medId === selectedMed.id)
            .reduce((sum, i) => sum + i.tabletsDeducted, 0);

        if (existingCartTablets + tabletsToDeduct > selectedMed.stock) {
            toast.error(`Insufficient stock available! Only ${selectedMed.stock - existingCartTablets} tablets remaining.`);
            return;
        }

        if (saleQty < 1) {
            toast.warning('Quantity must be at least 1');
            return;
        }

        // Add to cart with sale type info
        const cartItem = {
            id: `${selectedMed.id}-${saleType}-${Date.now()}`,
            medId: selectedMed.id,
            name: selectedMed.name,
            qty: saleQty,
            price: price,
            saleType: saleType,
            tabletsDeducted: tabletsToDeduct,
            tabletsPerStrip: selectedMed.tabletsPerStrip || 1,
            stock: selectedMed.stock,
        };

        setCart([...cart, cartItem]);
        setShowSaleTypeModal(false);
        toast.success(`Added ${saleQty} ${saleType === 'strip' ? 'strip(s)' : saleType === 'loose' ? 'tablet(s)' : 'unit(s)'} of ${selectedMed.name}`);
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
            items: cart.map((item) => ({
                ...item,
                saleTypeLabel: item.saleType === 'strip' ? `${item.qty} strip(s) × ${item.tabletsPerStrip}` : item.saleType === 'loose' ? `${item.qty} tablet(s)` : `${item.qty} unit(s)`,
            })),
            subtotal, tax, cgstAmt, sgstAmt, discountPercent, discountAmount, roundOff, total: grandTotal,
            payment: paymentMethod,
            customerName: customerName.trim(),
            customerPhone: customerPhone.trim(),
            customerVillage: customerVillage.trim(),
            doctorName: doctorName.trim(),
            billedBy: user?.name || 'Staff',
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

    // Get total tablets in cart for a given medicine
    const getCartTabletsForMed = (medId) => {
        return cart.filter((i) => i.medId === medId).reduce((sum, i) => sum + i.tabletsDeducted, 0);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Search, add to cart, and process billing.
                    <span className="text-blue-500 font-medium ml-1">Supports strip & loose tablet sales.</span>
                </p>
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
                            const cartTablets = getCartTabletsForMed(med.id);
                            const remainingStock = med.stock - cartTablets;
                            const isTablet = med.medicineType === 'Tablet' && med.tabletsPerStrip > 1;
                            const stockInfo = isTablet ? getStockDisplay(med.stock, med.tabletsPerStrip) : null;
                            const canSellStrip = isTablet && remainingStock >= med.tabletsPerStrip;

                            return (
                                <div key={med.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-blue-50/30 transition-colors">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-gray-900">{med.name}</p>
                                            {med.allowLooseSale && isTablet && (
                                                <span className="px-1.5 py-0.5 rounded text-[8px] font-bold bg-violet-100 text-violet-600">
                                                    LOOSE
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                            <span className="text-xs text-gray-400 font-mono">{med.id}</span>
                                            <span className="text-xs text-emerald-600 font-medium">
                                                {isTablet ? `${med.stock} tablets` : `${med.stock} units`}
                                            </span>
                                            {isTablet && (
                                                <span className="text-[10px] text-gray-400">
                                                    ({stockInfo?.strips}s + {stockInfo?.loose}t • {med.tabletsPerStrip}/strip)
                                                </span>
                                            )}
                                            <span className="text-xs text-gray-400">{med.category}</span>
                                            {cartTablets > 0 && (
                                                <span className="text-[10px] text-amber-600 font-bold">
                                                    In cart: {cartTablets} tablets
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-gray-800">₹{med.stripPrice || med.sellingPrice}</span>
                                            {isTablet && <p className="text-[10px] text-gray-400">/strip</p>}
                                        </div>
                                        <button
                                            onClick={() => openSaleTypeModal(med)}
                                            disabled={!canBill || remainingStock <= 0}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all active:scale-95 ${remainingStock <= 0
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : cartTablets > 0
                                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                                                }`}
                                        >
                                            {remainingStock <= 0 ? 'No Stock' : cartTablets > 0 ? '+ More' : '+ Add'}
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
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.saleType === 'strip' ? 'bg-blue-100 text-blue-700' :
                                                        item.saleType === 'loose' ? 'bg-violet-100 text-violet-700' :
                                                            'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {item.saleType === 'strip' ? `STRIP (${item.tabletsPerStrip}/strip)` :
                                                            item.saleType === 'loose' ? 'LOOSE TABLET' : 'UNIT'}
                                                    </span>
                                                    <span className="text-[10px] text-gray-400">
                                                        {item.tabletsDeducted} tablets deducted
                                                    </span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-0.5">
                                                    {item.qty} × ₹{item.price} = ₹{(item.price * item.qty).toFixed(2)}
                                                </p>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)} className="p-1 rounded-lg hover:bg-red-50 text-red-400 hover:text-red-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            </button>
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

            {/* Sale Type Modal */}
            <Modal isOpen={showSaleTypeModal} onClose={() => setShowSaleTypeModal(false)} title="Select Sale Type" size="md">
                {selectedMed && (() => {
                    const isTablet = selectedMed.medicineType === 'Tablet' && selectedMed.tabletsPerStrip > 1;
                    const cartTablets = getCartTabletsForMed(selectedMed.id);
                    const availableStock = selectedMed.stock - cartTablets;
                    const stockInfo = isTablet ? getStockDisplay(availableStock, selectedMed.tabletsPerStrip) : null;
                    const tabletsToDeduct = getTabletsToDeduct();
                    const salePrice = getSalePrice();
                    const totalPrice = salePrice * saleQty;
                    const canSellStrip = isTablet && availableStock >= selectedMed.tabletsPerStrip;
                    const hasError = tabletsToDeduct > availableStock;
                    const remainingAfterSale = availableStock - tabletsToDeduct;
                    const warnLowStock = isTablet && remainingAfterSale >= 0 && remainingAfterSale < selectedMed.tabletsPerStrip;

                    return (
                        <div className="space-y-5">
                            {/* Medicine Info Header */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xl shadow-md">💊</div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-gray-900">{selectedMed.name}</h3>
                                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                                        <span className="text-sm text-emerald-600 font-semibold">
                                            Available: {availableStock} tablets
                                        </span>
                                        {isTablet && (
                                            <span className="text-xs text-gray-400">
                                                ({stockInfo?.strips} strips + {stockInfo?.loose} loose • {selectedMed.tabletsPerStrip} tablets/strip)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sale Type Radio Buttons */}
                            {isTablet ? (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-3">Sale Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Strip Sale Option */}
                                        <button
                                            onClick={() => { setSaleType('strip'); setSaleQty(1); }}
                                            disabled={!canSellStrip}
                                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${saleType === 'strip'
                                                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                                                : canSellStrip
                                                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                                                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                                                }`}
                                        >
                                            {saleType === 'strip' && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            )}
                                            <p className="text-2xl mb-1">📦</p>
                                            <p className="text-sm font-bold text-gray-900">Strip Sale</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{selectedMed.tabletsPerStrip} tablets/strip</p>
                                            <p className="text-lg font-bold text-blue-600 mt-2">₹{selectedMed.stripPrice || selectedMed.sellingPrice}/strip</p>
                                            {!canSellStrip && <p className="text-[10px] text-red-500 mt-1 font-medium">Not enough stock for strip sale</p>}
                                        </button>

                                        {/* Loose Tablet Option */}
                                        <button
                                            onClick={() => { setSaleType('loose'); setSaleQty(1); }}
                                            disabled={!selectedMed.allowLooseSale}
                                            className={`relative p-4 rounded-xl border-2 text-left transition-all ${saleType === 'loose'
                                                ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-200'
                                                : selectedMed.allowLooseSale
                                                    ? 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/50'
                                                    : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                                                }`}
                                        >
                                            {saleType === 'loose' && (
                                                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                            )}
                                            <p className="text-2xl mb-1">💊</p>
                                            <p className="text-sm font-bold text-gray-900">Loose Tablet</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Individual tablets</p>
                                            <p className="text-lg font-bold text-violet-600 mt-2">
                                                {selectedMed.allowLooseSale ? `₹${selectedMed.looseTabletPrice}/tablet` : 'Not allowed'}
                                            </p>
                                            {!selectedMed.allowLooseSale && <p className="text-[10px] text-red-500 mt-1 font-medium">Loose sale not enabled</p>}
                                        </button>
                                    </div>
                                </div>
                            ) : null}

                            {/* Quantity Input */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    {saleType === 'strip' ? 'Strips to Sell' : saleType === 'loose' ? 'Tablets to Sell' : 'Quantity'}
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setSaleQty(Math.max(1, saleQty - 1))}
                                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700"
                                    >−</button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={saleQty}
                                        onChange={(e) => setSaleQty(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-20 h-10 text-center text-lg font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                    />
                                    <button
                                        onClick={() => setSaleQty(saleQty + 1)}
                                        className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700"
                                    >+</button>
                                </div>
                            </div>

                            {/* Auto Calculation Display */}
                            <div className={`p-4 rounded-xl border ${hasError ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                                <div className="grid grid-cols-3 gap-3 text-center">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Tablets Deducted</p>
                                        <p className={`text-xl font-bold ${hasError ? 'text-red-600' : 'text-blue-700'}`}>{tabletsToDeduct}</p>
                                        {saleType === 'strip' && (
                                            <p className="text-[10px] text-gray-400">{saleQty} × {selectedMed.tabletsPerStrip} = {tabletsToDeduct}</p>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Unit Price</p>
                                        <p className="text-xl font-bold text-gray-800">₹{salePrice}</p>
                                        <p className="text-[10px] text-gray-400">per {saleType === 'strip' ? 'strip' : saleType === 'loose' ? 'tablet' : 'unit'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Total Price</p>
                                        <p className="text-xl font-bold text-emerald-700">₹{totalPrice.toFixed(2)}</p>
                                        <p className="text-[10px] text-gray-400">{saleQty} × ₹{salePrice}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Error / Warning Messages */}
                            {hasError && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                                    <span className="text-red-500 text-lg">⚠️</span>
                                    <div>
                                        <p className="text-sm font-bold text-red-700">Insufficient stock available</p>
                                        <p className="text-xs text-red-500">
                                            Need {tabletsToDeduct} tablets but only {availableStock} available
                                        </p>
                                    </div>
                                </div>
                            )}

                            {warnLowStock && !hasError && (
                                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                    <span className="text-amber-500 text-lg">💡</span>
                                    <div>
                                        <p className="text-sm font-medium text-amber-700">
                                            After this sale, remaining stock ({remainingAfterSale} tablets) will be less than 1 strip
                                        </p>
                                        {isTablet && saleType === 'loose' && canSellStrip && (
                                            <p className="text-xs text-amber-500 mt-0.5">
                                                Consider suggesting a strip sale instead for better value
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Confirm Button */}
                            <button
                                onClick={confirmAddToCart}
                                disabled={hasError || saleQty < 1}
                                className={`w-full py-3 rounded-xl text-sm font-bold transition-all active:scale-[0.98] ${hasError || saleQty < 1
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-500/25'
                                    }`}
                            >
                                Add to Cart — ₹{totalPrice.toFixed(2)}
                            </button>
                        </div>
                    );
                })()}
            </Modal>

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
                        <div className="relative">
                            <label className="block text-xs font-medium text-gray-500 mb-1">Doctor / Prescribed By</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={showDoctorDropdown ? doctorSearch : doctorName}
                                    onChange={(e) => { setDoctorSearch(e.target.value); if (!showDoctorDropdown) setShowDoctorDropdown(true); }}
                                    onFocus={() => { setShowDoctorDropdown(true); setDoctorSearch(''); }}
                                    placeholder="Search or select doctor..."
                                    className="w-full px-3 py-2.5 pr-8 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                                />
                                {doctorName && (
                                    <button onClick={() => { setDoctorName(''); setDoctorSearch(''); }} className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                )}
                                {!doctorName && (
                                    <svg className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                )}
                            </div>
                            {showDoctorDropdown && (
                                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-56 overflow-y-auto">
                                    {/* Doctor List */}
                                    {doctors.filter(d => d.name.toLowerCase().includes(doctorSearch.toLowerCase())).length > 0 ? (
                                        doctors.filter(d => d.name.toLowerCase().includes(doctorSearch.toLowerCase())).map((doc) => (
                                            <button
                                                key={doc.id}
                                                onClick={() => { setDoctorName(doc.name); setDoctorSearch(''); setShowDoctorDropdown(false); }}
                                                className={`w-full text-left px-3 py-2.5 hover:bg-blue-50 transition-colors flex items-center gap-2.5 border-b border-gray-50 last:border-0 ${doctorName === doc.name ? 'bg-blue-50' : ''}`}
                                            >
                                                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                                    {doc.name.split(' ').filter(n => n !== 'Dr.').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                                                    <p className="text-[10px] text-gray-400">{doc.specialization}{doc.phone ? ` • ${doc.phone}` : ''}</p>
                                                </div>
                                                {doctorName === doc.name && (
                                                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                                )}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-3 text-center text-xs text-gray-400">No doctors found</div>
                                    )}
                                    {/* Add New Doctor */}
                                    {!showAddDoctorInline ? (
                                        <button
                                            onClick={() => setShowAddDoctorInline(true)}
                                            className="w-full text-left px-3 py-2.5 hover:bg-emerald-50 transition-colors flex items-center gap-2.5 border-t border-gray-100 text-emerald-600"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 text-sm font-bold flex-shrink-0">+</div>
                                            <span className="text-sm font-semibold">Add New Doctor</span>
                                        </button>
                                    ) : (
                                        <div className="p-3 border-t border-gray-100 bg-gray-50/50 space-y-2">
                                            <p className="text-xs font-bold text-gray-700">Add New Doctor</p>
                                            <input type="text" value={newDoctorName} onChange={(e) => setNewDoctorName(e.target.value)} placeholder="Doctor name (e.g., Dr. Ravi Kumar)" className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400" />
                                            <input type="text" value={newDoctorSpec} onChange={(e) => setNewDoctorSpec(e.target.value)} placeholder="Specialization (e.g., General Physician)" className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400" />
                                            <input type="tel" value={newDoctorPhone} onChange={(e) => setNewDoctorPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-2.5 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400" />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        if (!newDoctorName.trim()) return;
                                                        const doc = addDoctor({ name: newDoctorName.trim(), phone: newDoctorPhone.trim(), specialization: newDoctorSpec.trim() || 'General' });
                                                        setDoctorName(doc.name);
                                                        setNewDoctorName(''); setNewDoctorPhone(''); setNewDoctorSpec('');
                                                        setShowAddDoctorInline(false);
                                                        setShowDoctorDropdown(false);
                                                        toast.success(`Dr. ${doc.name} added successfully!`);
                                                    }}
                                                    disabled={!newDoctorName.trim()}
                                                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${newDoctorName.trim() ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                                >
                                                    Add & Select
                                                </button>
                                                <button
                                                    onClick={() => { setShowAddDoctorInline(false); setNewDoctorName(''); setNewDoctorPhone(''); setNewDoctorSpec(''); }}
                                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-100"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* Backdrop to close dropdown */}
                            {showDoctorDropdown && (
                                <div className="fixed inset-0 z-40" onClick={() => { setShowDoctorDropdown(false); setShowAddDoctorInline(false); setDoctorSearch(''); }} />
                            )}
                        </div>
                    </div>
                </div>

                {/* Payment Method */}
                <div className="mb-5">
                    <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                        Payment Method
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        {['Cash', 'UPI'].map((method) => (
                            <button key={method} onClick={() => setPaymentMethod(method)} className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl border-2 transition-all ${paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                <span className="text-xl">{method === 'Cash' ? '💵' : '📱'}</span>
                                <span className={`text-xs font-semibold ${paymentMethod === method ? 'text-blue-700' : 'text-gray-500'}`}>{method}</span>
                            </button>
                        ))}
                    </div>

                    {/* UPI QR Code */}
                    {paymentMethod === 'UPI' && (
                        <div className="mt-4 p-4 rounded-xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">📱</span>
                                <div>
                                    <p className="text-sm font-bold text-violet-900">Scan to Pay via UPI</p>
                                    <p className="text-xs text-violet-500">Customer can scan this QR code to pay</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center bg-white rounded-xl p-4 shadow-sm">
                                <QRCodeSVG
                                    value={`upi://pay?pa=${encodeURIComponent(settings.upiId || 'pharmacare@upi')}&pn=${encodeURIComponent(settings.pharmacyName || 'PharmaCare')}&am=${grandTotal.toFixed(2)}&cu=INR&tn=${encodeURIComponent(`Payment for medicines - ${settings.invoicePrefix}`)}`}
                                    size={180}
                                    level="H"
                                    includeMargin={true}
                                    bgColor="#ffffff"
                                    fgColor="#1e1b4b"
                                />
                                <div className="mt-3 text-center">
                                    <p className="text-lg font-bold text-gray-900">₹{grandTotal.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400 mt-1 font-mono">{settings.upiId || 'pharmacare@upi'}</p>
                                </div>
                                <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[10px] font-semibold text-emerald-700 uppercase tracking-wider">Waiting for payment</span>
                                </div>
                            </div>
                        </div>
                    )}
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
                            <thead><tr className="border-b border-gray-200 text-gray-500"><th className="text-left py-2">Item</th><th className="text-center py-2">Type</th><th className="text-center py-2">Qty</th><th className="text-right py-2">Price</th><th className="text-right py-2">Total</th></tr></thead>
                            <tbody className="divide-y divide-gray-50">
                                {lastInvoice.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td className="py-2 font-medium text-gray-900">{item.name}</td>
                                        <td className="py-2 text-center">
                                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${item.saleType === 'strip' ? 'bg-blue-100 text-blue-700' :
                                                item.saleType === 'loose' ? 'bg-violet-100 text-violet-700' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                {item.saleType === 'strip' ? 'STRIP' : item.saleType === 'loose' ? 'LOOSE' : 'UNIT'}
                                            </span>
                                        </td>
                                        <td className="py-2 text-center text-gray-600">{item.qty}</td>
                                        <td className="py-2 text-right text-gray-600">{lastInvoice.currency}{item.price}</td>
                                        <td className="py-2 text-right font-semibold">{lastInvoice.currency}{(item.price * item.qty).toFixed(2)}</td>
                                    </tr>
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
