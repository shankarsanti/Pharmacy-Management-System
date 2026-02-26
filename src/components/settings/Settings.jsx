import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

const Settings = () => {
    const toast = useToast();
    const { user } = useAuth();
    const canEdit = user?.role !== 'Pharmacist';
    const { settings: savedSettings, updateSettings } = useSettings();
    const [settings, setSettings] = useState({ ...savedSettings });

    const handleSave = () => {
        updateSettings(settings);
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Configure your pharmacy system preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pharmacy Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">🏥 Pharmacy Details</h3>
                    <div className="space-y-4">
                        {[
                            { label: 'Pharmacy Name', key: 'pharmacyName' },
                            { label: 'Phone', key: 'pharmacyPhone' },
                            { label: 'Email', key: 'pharmacyEmail' },
                        ].map((f) => (
                            <div key={f.key}>
                                <label className="block text-sm font-medium text-gray-500 mb-1">{f.label}</label>
                                <input type="text" value={settings[f.key]} onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })} disabled={!canEdit} className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`} />
                            </div>
                        ))}
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                            <textarea value={settings.pharmacyAddress} onChange={(e) => setSettings({ ...settings, pharmacyAddress: e.target.value })} rows="2" disabled={!canEdit} className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`} />
                        </div>
                    </div>
                </div>

                {/* System Settings */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">⚙️ System Configuration</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Currency</label>
                            <select value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} disabled={!canEdit} className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}>
                                <option value="₹">₹ Indian Rupee (INR)</option>
                                <option value="$">$ US Dollar (USD)</option>
                                <option value="€">€ Euro (EUR)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Tax Rate (%)</label>
                            <input type="number" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: +e.target.value })} disabled={!canEdit} className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Low Stock Threshold</label>
                            <input type="number" value={settings.lowStockThreshold} onChange={(e) => setSettings({ ...settings, lowStockThreshold: +e.target.value })} disabled={!canEdit} className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`} />
                            <p className="text-xs text-gray-400 mt-1">Medicines below this quantity will trigger low stock alerts</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Theme</label>
                            <div className="flex gap-3">
                                {['light', 'dark'].map((t) => (
                                    <button key={t} onClick={() => setSettings({ ...settings, theme: t })} className={`flex-1 py-3 rounded-xl border-2 font-medium text-sm capitalize transition-all ${settings.theme === t ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>{t === 'light' ? '☀️' : '🌙'} {t}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Billing & Tax Settings — full width */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">💰 Billing & Tax Settings</h3>
                <p className="text-xs text-gray-400 mb-5">Configure tax, discount, and billing preferences.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-4">
                        {/* Enable Tax Toggle */}
                        <div className={`flex items-center justify-between p-4 rounded-xl border ${settings.enableTax ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-gray-50/50'} transition-colors`}>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Enable Tax</p>
                                <p className="text-xs text-gray-400 mt-0.5">Apply GST/Tax on all billing transactions</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold ${settings.enableTax ? 'text-emerald-600' : 'text-gray-400'}`}>{settings.enableTax ? 'YES' : 'NO'}</span>
                                <button
                                    type="button"
                                    onClick={() => canEdit && setSettings({ ...settings, enableTax: !settings.enableTax })}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${settings.enableTax ? 'bg-emerald-500' : 'bg-gray-300'} ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                >
                                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${settings.enableTax ? 'translate-x-6' : 'translate-x-0'}`}></span>
                                </button>
                            </div>
                        </div>

                        {/* Tax Fields — only shown when enabled */}
                        {settings.enableTax && (
                            <div className="space-y-4 pl-1 border-l-2 border-emerald-200 ml-2">
                                <div className="pl-4">
                                    <label className="block text-sm font-medium text-gray-500 mb-1">GST Number</label>
                                    <input
                                        type="text"
                                        value={settings.gstNumber}
                                        onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                                        placeholder="e.g., 27AABCU9603R1ZM"
                                        disabled={!canEdit}
                                        className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3 pl-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">CGST Rate (%)</label>
                                        <input
                                            type="number"
                                            value={settings.cgstRate}
                                            onChange={(e) => setSettings({ ...settings, cgstRate: +e.target.value, taxRate: +e.target.value + settings.sgstRate })}
                                            step="0.5"
                                            min="0"
                                            disabled={!canEdit}
                                            className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">SGST Rate (%)</label>
                                        <input
                                            type="number"
                                            value={settings.sgstRate}
                                            onChange={(e) => setSettings({ ...settings, sgstRate: +e.target.value, taxRate: settings.cgstRate + +e.target.value })}
                                            step="0.5"
                                            min="0"
                                            disabled={!canEdit}
                                            className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 pl-4">Total Tax: <span className="font-semibold text-gray-600">{settings.cgstRate + settings.sgstRate}%</span> (CGST {settings.cgstRate}% + SGST {settings.sgstRate}%)</p>
                            </div>
                        )}

                        {/* Round Off Total Toggle */}
                        <div className={`flex items-center justify-between p-4 rounded-xl border ${settings.roundOffTotal ? 'border-violet-200 bg-violet-50/50' : 'border-gray-200 bg-gray-50/50'} transition-colors`}>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Round Off Total</p>
                                <p className="text-xs text-gray-400 mt-0.5">{settings.roundOffTotal ? 'e.g., ₹149.73 → ₹150.00' : 'Exact amount will be shown'}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => canEdit && setSettings({ ...settings, roundOffTotal: !settings.roundOffTotal })}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${settings.roundOffTotal ? 'bg-violet-500' : 'bg-gray-300'} ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${settings.roundOffTotal ? 'translate-x-6' : 'translate-x-0'}`}></span>
                            </button>
                        </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                        {/* Discount Settings */}
                        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/30">
                            <p className="text-sm font-semibold text-gray-800 mb-3">🏷️ Discount Settings</p>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Default Discount (%)</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={settings.defaultDiscount}
                                            onChange={(e) => {
                                                const val = Math.min(+e.target.value, settings.maxDiscountLimit);
                                                setSettings({ ...settings, defaultDiscount: Math.max(0, val) });
                                            }}
                                            min="0"
                                            max={settings.maxDiscountLimit}
                                            step="0.5"
                                            disabled={!canEdit}
                                            className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Auto-applied to all new bills</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-500 mb-1">Maximum Discount Limit (%)</label>
                                    <input
                                        type="number"
                                        value={settings.maxDiscountLimit}
                                        onChange={(e) => setSettings({ ...settings, maxDiscountLimit: Math.max(0, Math.min(100, +e.target.value)) })}
                                        min="0"
                                        max="100"
                                        step="1"
                                        disabled={!canEdit}
                                        className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Staff cannot exceed this discount limit</p>
                                </div>
                                {/* Visual limit bar */}
                                <div>
                                    <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                        <span>0%</span>
                                        <span>Default: {settings.defaultDiscount}%</span>
                                        <span>Max: {settings.maxDiscountLimit}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300" style={{ width: `${settings.maxDiscountLimit}%` }}>
                                            <div className="h-full rounded-full bg-amber-600 transition-all duration-300" style={{ width: `${settings.maxDiscountLimit > 0 ? (settings.defaultDiscount / settings.maxDiscountLimit) * 100 : 0}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Modes */}
                        <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/30">
                            <p className="text-sm font-semibold text-gray-800 mb-3">💳 Accepted Payment Modes</p>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { key: 'cash', label: 'Cash', icon: '💵', color: 'emerald' },
                                    { key: 'card', label: 'Card', icon: '💳', color: 'blue' },
                                    { key: 'upi', label: 'UPI', icon: '📱', color: 'violet' },
                                    { key: 'credit', label: 'Credit', icon: '📝', color: 'amber' },
                                ].map((mode) => (
                                    <button
                                        key={mode.key}
                                        type="button"
                                        onClick={() => canEdit && setSettings({
                                            ...settings,
                                            enablePaymentModes: { ...settings.enablePaymentModes, [mode.key]: !settings.enablePaymentModes[mode.key] }
                                        })}
                                        disabled={!canEdit}
                                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${settings.enablePaymentModes[mode.key]
                                            ? `border-${mode.color}-300 bg-${mode.color}-50 text-${mode.color}-700`
                                            : 'border-gray-200 bg-white text-gray-400 line-through'
                                            } ${!canEdit ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:shadow-sm'}`}
                                    >
                                        <span>{mode.icon}</span>
                                        <span>{mode.label}</span>
                                        {settings.enablePaymentModes[mode.key] && (
                                            <svg className="w-4 h-4 ml-auto text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Billing Preview */}
                        <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-white">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Billing Preview</p>
                            <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 text-xs">
                                <div className="flex justify-between text-gray-500"><span>Subtotal</span><span className="font-mono">{settings.currency}1,000.00</span></div>
                                {settings.defaultDiscount > 0 && (
                                    <div className="flex justify-between text-amber-600"><span>Discount ({settings.defaultDiscount}%)</span><span className="font-mono">-{settings.currency}{(1000 * settings.defaultDiscount / 100).toFixed(2)}</span></div>
                                )}
                                {settings.enableTax && (
                                    <>
                                        <div className="flex justify-between text-gray-400"><span>CGST ({settings.cgstRate}%)</span><span className="font-mono">+{settings.currency}{((1000 - 1000 * settings.defaultDiscount / 100) * settings.cgstRate / 100).toFixed(2)}</span></div>
                                        <div className="flex justify-between text-gray-400"><span>SGST ({settings.sgstRate}%)</span><span className="font-mono">+{settings.currency}{((1000 - 1000 * settings.defaultDiscount / 100) * settings.sgstRate / 100).toFixed(2)}</span></div>
                                    </>
                                )}
                                <div className="border-t border-gray-300 my-1"></div>
                                {(() => {
                                    const sub = 1000;
                                    const afterDisc = sub - (sub * settings.defaultDiscount / 100);
                                    const tax = settings.enableTax ? afterDisc * (settings.cgstRate + settings.sgstRate) / 100 : 0;
                                    const total = afterDisc + tax;
                                    const final_ = settings.roundOffTotal ? Math.round(total) : total;
                                    return (
                                        <>
                                            {settings.roundOffTotal && total !== final_ && (
                                                <div className="flex justify-between text-gray-400"><span>Round Off</span><span className="font-mono">{(final_ - total) >= 0 ? '+' : ''}{settings.currency}{(final_ - total).toFixed(2)}</span></div>
                                            )}
                                            <div className="flex justify-between font-bold text-gray-800 text-sm"><span>Grand Total</span><span className="font-mono">{settings.currency}{final_.toFixed(2)}</span></div>
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoice Settings — full width */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">🧾 Invoice Settings</h3>
                <p className="text-xs text-gray-400 mb-5">Configure how your invoices are generated and printed.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column — text fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Invoice Prefix</label>
                            <input
                                type="text"
                                value={settings.invoicePrefix}
                                onChange={(e) => setSettings({ ...settings, invoicePrefix: e.target.value })}
                                placeholder="e.g., PH-INV-"
                                disabled={!canEdit}
                                className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                            />
                            <p className="text-xs text-gray-400 mt-1">Prefix added before every invoice number (e.g., PH-INV-1001)</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Starting Invoice Number</label>
                            <input
                                type="number"
                                value={settings.startingInvoiceNo}
                                onChange={(e) => setSettings({ ...settings, startingInvoiceNo: +e.target.value })}
                                placeholder="1001"
                                min="1"
                                disabled={!canEdit}
                                className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                            />
                            <p className="text-xs text-gray-400 mt-1">Next invoice will be: <span className="font-semibold text-gray-600">{settings.invoicePrefix}{settings.startingInvoiceNo}</span></p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-500 mb-1">Print Footer Message</label>
                            <textarea
                                value={settings.printFooterMessage}
                                onChange={(e) => setSettings({ ...settings, printFooterMessage: e.target.value })}
                                placeholder="Thank you for your purchase!"
                                rows={3}
                                disabled={!canEdit}
                                className={`w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none ${!canEdit ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                            />
                            <p className="text-xs text-gray-400 mt-1">This message will appear at the bottom of every printed invoice</p>
                        </div>
                    </div>

                    {/* Right column — toggles + preview */}
                    <div className="space-y-4">
                        {/* Show Pharmacy Logo Toggle */}
                        <div className={`flex items-center justify-between p-4 rounded-xl border ${settings.showPharmacyLogo ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-gray-50/50'} transition-colors`}>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Show Pharmacy Logo</p>
                                <p className="text-xs text-gray-400 mt-0.5">Display your pharmacy logo on printed invoices</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => canEdit && setSettings({ ...settings, showPharmacyLogo: !settings.showPharmacyLogo })}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${settings.showPharmacyLogo ? 'bg-emerald-500' : 'bg-gray-300'} ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${settings.showPharmacyLogo ? 'translate-x-6' : 'translate-x-0'}`}></span>
                            </button>
                        </div>

                        {/* Show GST/Tax Toggle */}
                        <div className={`flex items-center justify-between p-4 rounded-xl border ${settings.showGstOnInvoice ? 'border-blue-200 bg-blue-50/50' : 'border-gray-200 bg-gray-50/50'} transition-colors`}>
                            <div>
                                <p className="text-sm font-semibold text-gray-800">Show GST/Tax on Invoice</p>
                                <p className="text-xs text-gray-400 mt-0.5">Display tax breakdown on printed invoices</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => canEdit && setSettings({ ...settings, showGstOnInvoice: !settings.showGstOnInvoice })}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${settings.showGstOnInvoice ? 'bg-blue-500' : 'bg-gray-300'} ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${settings.showGstOnInvoice ? 'translate-x-6' : 'translate-x-0'}`}></span>
                            </button>
                        </div>

                        {/* Invoice Preview */}
                        <div className="border border-dashed border-gray-300 rounded-xl p-4 bg-white">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Invoice Preview</p>
                            <div className="bg-gray-50 rounded-lg p-4 text-center space-y-2">
                                {settings.showPharmacyLogo && (
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mx-auto">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                                    </div>
                                )}
                                <p className="text-sm font-bold text-gray-800">{settings.pharmacyName}</p>
                                <p className="text-xs text-gray-400">{settings.pharmacyAddress}</p>
                                <div className="border-t border-dashed border-gray-300 my-2"></div>
                                <p className="text-xs font-mono text-blue-600 font-bold">{settings.invoicePrefix}{settings.startingInvoiceNo}</p>
                                {settings.showGstOnInvoice && (
                                    <p className="text-[10px] text-gray-400">GST/Tax: {settings.taxRate}%</p>
                                )}
                                <div className="border-t border-dashed border-gray-300 my-2"></div>
                                {settings.printFooterMessage && (
                                    <p className="text-[10px] text-gray-400 italic">{settings.printFooterMessage}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {canEdit && (
                <div className="flex justify-end">
                    <button onClick={handleSave} className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-colors">Save All Settings</button>
                </div>
            )}
            {!canEdit && (
                <p className="text-sm text-amber-600 text-center font-medium">🔒 View-only mode — Pharmacists cannot modify settings</p>
            )}
        </div>
    );
};

export default Settings;
