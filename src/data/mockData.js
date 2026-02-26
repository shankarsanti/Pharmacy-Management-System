// =============================================
// CENTRALIZED MOCK DATA — Pharmacy Management System
// =============================================
// 🧠 CORE RULE: Stock is stored in **tablets**, but sales can be done in **strips or individual tablets**.

// ---------- USERS ----------
export const mockUsers = [
    { id: 'U001', name: 'Admin User', email: 'admin@pharmacare.com', password: 'admin123', role: 'Admin', phone: '+91 98765 43210', avatar: 'AU' },
    { id: 'U002', name: 'Rahul Sharma', email: 'rahul@pharmacare.com', password: 'pharma123', role: 'Pharmacist', phone: '+91 98765 43211', avatar: 'RS' },
    { id: 'U003', name: 'Priya Patel', email: 'priya@pharmacare.com', password: 'cashier123', role: 'Cashier', phone: '+91 98765 43212', avatar: 'PP' },
];

// ---------- CATEGORIES ----------
export const mockCategories = [
    { id: 'C001', name: 'Antibiotic', description: 'Medicines that fight bacterial infections', count: 24, color: 'blue' },
    { id: 'C002', name: 'Painkiller', description: 'Pain relief medications', count: 18, color: 'orange' },
    { id: 'C003', name: 'Diabetes', description: 'Diabetes management medicines', count: 12, color: 'amber' },
    { id: 'C004', name: 'Respiratory', description: 'Respiratory system medications', count: 9, color: 'teal' },
    { id: 'C005', name: 'Gastro', description: 'Gastrointestinal medicines', count: 15, color: 'indigo' },
    { id: 'C006', name: 'Vitamin', description: 'Vitamins and supplements', count: 22, color: 'green' },
    { id: 'C007', name: 'Cholesterol', description: 'Cholesterol management drugs', count: 7, color: 'rose' },
    { id: 'C008', name: 'Antihistamine', description: 'Allergy relief medications', count: 11, color: 'purple' },
];

// ---------- SUPPLIERS ----------
export const mockSuppliers = [
    { id: 'S001', name: 'MedPharma India Pvt Ltd', contact: 'Rajesh Kumar', phone: '+91 98110 23456', email: 'rajesh@medpharma.in', address: '42, Industrial Area, Phase-II, Chandigarh', company: 'MedPharma India', status: 'Active', lastOrder: '2026-02-10', totalOrders: 45 },
    { id: 'S002', name: 'HealthPlus Supply Co.', contact: 'Sneha Reddy', phone: '+91 98220 34567', email: 'sneha@healthplus.in', address: '15, MIDC, Andheri East, Mumbai', company: 'HealthPlus', status: 'Active', lastOrder: '2026-02-15', totalOrders: 38 },
    { id: 'S003', name: 'Global Meds Ltd', contact: 'Amit Joshi', phone: '+91 98330 45678', email: 'amit@globalmeds.in', address: '78, Pharma City, Hyderabad', company: 'Global Meds', status: 'Inactive', lastOrder: '2025-11-20', totalOrders: 12 },
    { id: 'S004', name: 'QuickDrug Distribution', contact: 'Meera Nair', phone: '+91 98440 56789', email: 'meera@quickdrug.in', address: '23, Salt Lake, Sector V, Kolkata', company: 'QuickDrug', status: 'Active', lastOrder: '2026-02-22', totalOrders: 56 },
    { id: 'S005', name: 'BioVita Wholesale', contact: 'Karan Mehta', phone: '+91 98550 67890', email: 'karan@biovita.in', address: '91, Whitefield, Bangalore', company: 'BioVita', status: 'Pending', lastOrder: '2026-01-05', totalOrders: 8 },
];

// ---------- MEDICINES ----------
// Stock is stored in TABLETS. sellingPrice = strip price, looseTabletPrice = per-tablet price.
export const mockMedicines = [
    { id: 'M001', name: 'Amoxicillin 500mg', generic: 'Amoxicillin', category: 'Antibiotic', batch: 'BT-2024-001', supplier: 'S001', purchasePrice: 100, sellingPrice: 150, stock: 120, expiry: '2026-10-15', addedDate: '2025-06-10', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 150, looseTabletPrice: 16, allowLooseSale: true, lowStockThreshold: 20 },
    { id: 'M002', name: 'Panadol Advance', generic: 'Paracetamol', category: 'Painkiller', batch: 'BT-2024-002', supplier: 'S002', purchasePrice: 55, sellingPrice: 85, stock: 350, expiry: '2027-05-20', addedDate: '2025-07-15', medicineType: 'Tablet', tabletsPerStrip: 15, stripPrice: 85, looseTabletPrice: 6, allowLooseSale: true, lowStockThreshold: 30 },
    { id: 'M003', name: 'Zyrtec 10mg', generic: 'Cetirizine', category: 'Antihistamine', batch: 'BT-2024-003', supplier: 'S001', purchasePrice: 160, sellingPrice: 245, stock: 85, expiry: '2026-08-11', addedDate: '2025-05-20', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 245, looseTabletPrice: 26, allowLooseSale: true, lowStockThreshold: 20 },
    { id: 'M004', name: 'Lipitor 20mg', generic: 'Atorvastatin', category: 'Cholesterol', batch: 'BT-2024-004', supplier: 'S004', purchasePrice: 350, sellingPrice: 520, stock: 40, expiry: '2026-04-01', addedDate: '2025-08-01', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 520, looseTabletPrice: 55, allowLooseSale: false, lowStockThreshold: 10 },
    { id: 'M005', name: 'Augmentin 625mg', generic: 'Amoxicillin/Clavulanate', category: 'Antibiotic', batch: 'BT-2024-005', supplier: 'S001', purchasePrice: 210, sellingPrice: 310, stock: 60, expiry: '2026-03-15', addedDate: '2025-09-12', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 310, looseTabletPrice: 33, allowLooseSale: true, lowStockThreshold: 15 },
    { id: 'M006', name: 'Ventolin Inhaler', generic: 'Salbutamol', category: 'Respiratory', batch: 'BT-2024-006', supplier: 'S002', purchasePrice: 180, sellingPrice: 275, stock: 28, expiry: '2026-11-30', addedDate: '2025-04-25', medicineType: 'Other', tabletsPerStrip: 1, stripPrice: 275, looseTabletPrice: 275, allowLooseSale: false, lowStockThreshold: 5 },
    { id: 'M007', name: 'Metformin 500mg', generic: 'Metformin', category: 'Diabetes', batch: 'BT-2024-007', supplier: 'S004', purchasePrice: 75, sellingPrice: 120, stock: 200, expiry: '2027-03-15', addedDate: '2025-10-05', medicineType: 'Tablet', tabletsPerStrip: 15, stripPrice: 120, looseTabletPrice: 9, allowLooseSale: true, lowStockThreshold: 30 },
    { id: 'M008', name: 'Nexium 40mg', generic: 'Esomeprazole', category: 'Gastro', batch: 'BT-2024-008', supplier: 'S002', purchasePrice: 320, sellingPrice: 480, stock: 75, expiry: '2026-06-22', addedDate: '2025-11-18', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 480, looseTabletPrice: 50, allowLooseSale: true, lowStockThreshold: 15 },
    { id: 'M009', name: 'Vitamin C 1000mg', generic: 'Ascorbic Acid', category: 'Vitamin', batch: 'BT-2024-009', supplier: 'S005', purchasePrice: 60, sellingPrice: 95, stock: 500, expiry: '2027-08-10', addedDate: '2025-03-22', medicineType: 'Tablet', tabletsPerStrip: 15, stripPrice: 95, looseTabletPrice: 7, allowLooseSale: true, lowStockThreshold: 30 },
    { id: 'M010', name: 'Cough Syrup 100ml', generic: 'Dextromethorphan', category: 'Respiratory', batch: 'BT-2024-010', supplier: 'S001', purchasePrice: 85, sellingPrice: 135, stock: 150, expiry: '2026-09-05', addedDate: '2025-07-30', medicineType: 'Syrup', tabletsPerStrip: 1, stripPrice: 135, looseTabletPrice: 135, allowLooseSale: false, lowStockThreshold: 10 },
    { id: 'M011', name: 'Ciprofloxacin 500mg', generic: 'Ciprofloxacin', category: 'Antibiotic', batch: 'BT-2024-011', supplier: 'S004', purchasePrice: 90, sellingPrice: 140, stock: 8, expiry: '2026-03-20', addedDate: '2025-06-18', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 140, looseTabletPrice: 15, allowLooseSale: true, lowStockThreshold: 20 },
    { id: 'M012', name: 'Ibuprofen 400mg', generic: 'Ibuprofen', category: 'Painkiller', batch: 'BT-2024-012', supplier: 'S002', purchasePrice: 40, sellingPrice: 65, stock: 5, expiry: '2026-04-10', addedDate: '2025-08-14', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 65, looseTabletPrice: 7, allowLooseSale: true, lowStockThreshold: 20 },
    { id: 'M013', name: 'Omeprazole 20mg', generic: 'Omeprazole', category: 'Gastro', batch: 'BT-2024-013', supplier: 'S001', purchasePrice: 55, sellingPrice: 90, stock: 0, expiry: '2026-07-25', addedDate: '2025-09-28', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 90, looseTabletPrice: 10, allowLooseSale: true, lowStockThreshold: 15 },
    { id: 'M014', name: 'Azithromycin 500mg', generic: 'Azithromycin', category: 'Antibiotic', batch: 'BT-2024-014', supplier: 'S004', purchasePrice: 120, sellingPrice: 185, stock: 45, expiry: '2026-03-01', addedDate: '2025-05-11', medicineType: 'Tablet', tabletsPerStrip: 6, stripPrice: 185, looseTabletPrice: 32, allowLooseSale: true, lowStockThreshold: 12 },
    { id: 'M015', name: 'Multivitamin Tablets', generic: 'Multivitamin', category: 'Vitamin', batch: 'BT-2024-015', supplier: 'S005', purchasePrice: 150, sellingPrice: 230, stock: 0, expiry: '2027-01-15', addedDate: '2025-10-20', medicineType: 'Tablet', tabletsPerStrip: 15, stripPrice: 230, looseTabletPrice: 16, allowLooseSale: false, lowStockThreshold: 15 },
    { id: 'M016', name: 'Montelukast 10mg', generic: 'Montelukast', category: 'Respiratory', batch: 'BT-2024-016', supplier: 'S002', purchasePrice: 110, sellingPrice: 170, stock: 90, expiry: '2026-12-10', addedDate: '2025-11-05', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 170, looseTabletPrice: 18, allowLooseSale: true, lowStockThreshold: 20 },
    { id: 'M017', name: 'Glimepiride 2mg', generic: 'Glimepiride', category: 'Diabetes', batch: 'BT-2024-017', supplier: 'S004', purchasePrice: 65, sellingPrice: 105, stock: 3, expiry: '2026-05-18', addedDate: '2025-04-15', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 105, looseTabletPrice: 11, allowLooseSale: true, lowStockThreshold: 20 },
    { id: 'M018', name: 'Pantoprazole 40mg', generic: 'Pantoprazole', category: 'Gastro', batch: 'BT-2024-018', supplier: 'S001', purchasePrice: 70, sellingPrice: 115, stock: 180, expiry: '2027-02-28', addedDate: '2025-12-01', medicineType: 'Tablet', tabletsPerStrip: 10, stripPrice: 115, looseTabletPrice: 12, allowLooseSale: true, lowStockThreshold: 20 },
];

// ---------- SALES ----------
export const mockSales = [
    { id: 'INV-001', date: '2026-02-25', time: '09:15 AM', customer: 'Walk-in', items: [{ medId: 'M001', name: 'Amoxicillin 500mg', qty: 2, price: 150, saleType: 'strip', tabletsDeducted: 20 }, { medId: 'M002', name: 'Panadol Advance', qty: 3, price: 85, saleType: 'strip', tabletsDeducted: 45 }], subtotal: 555, tax: 27.75, discount: 0, total: 582.75, payment: 'Cash', billBy: 'Rahul Sharma' },
    { id: 'INV-002', date: '2026-02-25', time: '10:30 AM', customer: 'Anita Verma', items: [{ medId: 'M007', name: 'Metformin 500mg', qty: 5, price: 120, saleType: 'strip', tabletsDeducted: 75 }, { medId: 'M008', name: 'Nexium 40mg', qty: 1, price: 480, saleType: 'strip', tabletsDeducted: 10 }], subtotal: 1080, tax: 54, discount: 50, total: 1084, payment: 'UPI', billBy: 'Priya Patel' },
    { id: 'INV-003', date: '2026-02-25', time: '11:45 AM', customer: 'Suresh Menon', items: [{ medId: 'M003', name: 'Zyrtec 10mg', qty: 1, price: 245, saleType: 'strip', tabletsDeducted: 10 }], subtotal: 245, tax: 12.25, discount: 0, total: 257.25, payment: 'Card', billBy: 'Rahul Sharma' },
    { id: 'INV-004', date: '2026-02-25', time: '02:00 PM', customer: 'Walk-in', items: [{ medId: 'M009', name: 'Vitamin C 1000mg', qty: 10, price: 95, saleType: 'strip', tabletsDeducted: 150 }, { medId: 'M010', name: 'Cough Syrup 100ml', qty: 2, price: 135, saleType: 'unit', tabletsDeducted: 2 }], subtotal: 1220, tax: 61, discount: 100, total: 1181, payment: 'Cash', billBy: 'Priya Patel' },
    { id: 'INV-005', date: '2026-02-24', time: '09:30 AM', customer: 'Deepa Rao', items: [{ medId: 'M004', name: 'Lipitor 20mg', qty: 1, price: 520, saleType: 'strip', tabletsDeducted: 10 }], subtotal: 520, tax: 26, discount: 0, total: 546, payment: 'UPI', billBy: 'Rahul Sharma' },
    { id: 'INV-006', date: '2026-02-24', time: '12:15 PM', customer: 'Walk-in', items: [{ medId: 'M006', name: 'Ventolin Inhaler', qty: 1, price: 275, saleType: 'unit', tabletsDeducted: 1 }, { medId: 'M002', name: 'Panadol Advance', qty: 5, price: 6, saleType: 'loose', tabletsDeducted: 5 }], subtotal: 305, tax: 15.25, discount: 20, total: 300.25, payment: 'Cash', billBy: 'Priya Patel' },
    { id: 'INV-007', date: '2026-02-23', time: '10:00 AM', customer: 'Vikram Singh', items: [{ medId: 'M005', name: 'Augmentin 625mg', qty: 2, price: 310, saleType: 'strip', tabletsDeducted: 20 }], subtotal: 620, tax: 31, discount: 0, total: 651, payment: 'Card', billBy: 'Rahul Sharma' },
    { id: 'INV-008', date: '2026-02-23', time: '03:45 PM', customer: 'Walk-in', items: [{ medId: 'M001', name: 'Amoxicillin 500mg', qty: 3, price: 150, saleType: 'strip', tabletsDeducted: 30 }, { medId: 'M009', name: 'Vitamin C 1000mg', qty: 5, price: 95, saleType: 'strip', tabletsDeducted: 75 }], subtotal: 925, tax: 46.25, discount: 50, total: 921.25, payment: 'UPI', billBy: 'Priya Patel' },
    { id: 'INV-009', date: '2026-02-22', time: '11:00 AM', customer: 'Kavitha Iyer', items: [{ medId: 'M007', name: 'Metformin 500mg', qty: 8, price: 9, saleType: 'loose', tabletsDeducted: 8 }], subtotal: 72, tax: 3.6, discount: 0, total: 75.6, payment: 'Cash', billBy: 'Rahul Sharma' },
    { id: 'INV-010', date: '2026-02-22', time: '04:30 PM', customer: 'Walk-in', items: [{ medId: 'M003', name: 'Zyrtec 10mg', qty: 2, price: 245, saleType: 'strip', tabletsDeducted: 20 }, { medId: 'M010', name: 'Cough Syrup 100ml', qty: 1, price: 135, saleType: 'unit', tabletsDeducted: 1 }], subtotal: 625, tax: 31.25, discount: 0, total: 656.25, payment: 'UPI', billBy: 'Priya Patel' },
];

// ---------- STOCK ENTRIES ----------
export const mockStockEntries = [
    {
        id: 'SE001', supplierId: 'S001', supplier: 'MedPharma India Pvt Ltd', invoiceNo: 'MP-INV-2026-045',
        invoiceDate: '2026-02-25', paymentMode: 'Credit', enteredBy: 'Admin User',
        remarks: 'Monthly stock replenishment',
        items: [
            { medId: 'M001', medicineName: 'Amoxicillin 500mg', batch: 'BT-2026-101', stripsPurchased: 5, looseTabletsPurchased: 0, tabletsPerStrip: 10, qty: 50, purchasePrice: 100, sellingPrice: 150, mfgDate: '2026-01-10', expiry: '2027-01-10' },
            { medId: 'M005', medicineName: 'Augmentin 625mg', batch: 'BT-2026-102', stripsPurchased: 3, looseTabletsPurchased: 0, tabletsPerStrip: 10, qty: 30, purchasePrice: 210, sellingPrice: 310, mfgDate: '2026-01-15', expiry: '2027-06-15' },
            { medId: 'M014', medicineName: 'Azithromycin 500mg', batch: 'BT-2026-103', stripsPurchased: 3, looseTabletsPurchased: 2, tabletsPerStrip: 6, qty: 20, purchasePrice: 120, sellingPrice: 185, mfgDate: '2026-02-01', expiry: '2027-08-01' },
        ],
        totalAmount: 13700, totalQty: 100, createdAt: '2026-02-25T09:00:00Z'
    },
    {
        id: 'SE002', supplierId: 'S002', supplier: 'HealthPlus Supply Co.', invoiceNo: 'HP-INV-2026-038',
        invoiceDate: '2026-02-25', paymentMode: 'UPI', enteredBy: 'Rahul Sharma',
        remarks: 'Emergency restock — low stock items',
        items: [
            { medId: 'M002', medicineName: 'Panadol Advance', batch: 'BT-2026-201', stripsPurchased: 6, looseTabletsPurchased: 10, tabletsPerStrip: 15, qty: 100, purchasePrice: 55, sellingPrice: 85, mfgDate: '2026-01-20', expiry: '2028-01-20' },
            { medId: 'M006', medicineName: 'Ventolin Inhaler', batch: 'BT-2026-202', stripsPurchased: 15, looseTabletsPurchased: 0, tabletsPerStrip: 1, qty: 15, purchasePrice: 180, sellingPrice: 275, mfgDate: '2026-02-05', expiry: '2027-08-05' },
        ],
        totalAmount: 8200, totalQty: 115, createdAt: '2026-02-25T10:30:00Z'
    },
    {
        id: 'SE003', supplierId: 'S004', supplier: 'QuickDrug Distribution', invoiceNo: 'QD-INV-2026-056',
        invoiceDate: '2026-02-24', paymentMode: 'Cash', enteredBy: 'Admin User',
        remarks: '',
        items: [
            { medId: 'M004', medicineName: 'Lipitor 20mg', batch: 'BT-2026-301', stripsPurchased: 2, looseTabletsPurchased: 5, tabletsPerStrip: 10, qty: 25, purchasePrice: 350, sellingPrice: 520, mfgDate: '2026-01-05', expiry: '2027-07-05' },
            { medId: 'M007', medicineName: 'Metformin 500mg', batch: 'BT-2026-302', stripsPurchased: 6, looseTabletsPurchased: 10, tabletsPerStrip: 15, qty: 100, purchasePrice: 75, sellingPrice: 120, mfgDate: '2026-02-01', expiry: '2028-02-01' },
            { medId: 'M011', medicineName: 'Ciprofloxacin 500mg', batch: 'BT-2026-303', stripsPurchased: 4, looseTabletsPurchased: 0, tabletsPerStrip: 10, qty: 40, purchasePrice: 90, sellingPrice: 140, mfgDate: '2026-01-25', expiry: '2027-01-25' },
        ],
        totalAmount: 19850, totalQty: 165, createdAt: '2026-02-24T14:15:00Z'
    },
    {
        id: 'SE004', supplierId: 'S005', supplier: 'BioVita Wholesale', invoiceNo: 'BV-INV-2026-008',
        invoiceDate: '2026-02-23', paymentMode: 'Cheque', enteredBy: 'Admin User',
        remarks: 'Vitamin supplements order',
        items: [
            { medId: 'M009', medicineName: 'Vitamin C 1000mg', batch: 'BT-2026-401', stripsPurchased: 13, looseTabletsPurchased: 5, tabletsPerStrip: 15, qty: 200, purchasePrice: 60, sellingPrice: 95, mfgDate: '2026-02-10', expiry: '2028-02-10' },
            { medId: 'M015', medicineName: 'Multivitamin Tablets', batch: 'BT-2026-402', stripsPurchased: 5, looseTabletsPurchased: 5, tabletsPerStrip: 15, qty: 80, purchasePrice: 150, sellingPrice: 230, mfgDate: '2026-01-28', expiry: '2027-07-28' },
        ],
        totalAmount: 24000, totalQty: 280, createdAt: '2026-02-23T11:00:00Z'
    },
    {
        id: 'SE005', supplierId: 'S001', supplier: 'MedPharma India Pvt Ltd', invoiceNo: 'MP-INV-2026-044',
        invoiceDate: '2026-02-22', paymentMode: 'Credit', enteredBy: 'Rahul Sharma',
        remarks: '',
        items: [
            { medId: 'M010', medicineName: 'Cough Syrup 100ml', batch: 'BT-2026-501', stripsPurchased: 60, looseTabletsPurchased: 0, tabletsPerStrip: 1, qty: 60, purchasePrice: 85, sellingPrice: 135, mfgDate: '2026-01-18', expiry: '2027-07-18' },
            { medId: 'M013', medicineName: 'Omeprazole 20mg', batch: 'BT-2026-502', stripsPurchased: 7, looseTabletsPurchased: 5, tabletsPerStrip: 10, qty: 75, purchasePrice: 55, sellingPrice: 90, mfgDate: '2026-02-01', expiry: '2027-08-01' },
        ],
        totalAmount: 9225, totalQty: 135, createdAt: '2026-02-22T09:45:00Z'
    },
    {
        id: 'SE006', supplierId: 'S002', supplier: 'HealthPlus Supply Co.', invoiceNo: 'HP-INV-2026-037',
        invoiceDate: '2026-02-21', paymentMode: 'Card', enteredBy: 'Admin User',
        remarks: 'Gastro medicines restock',
        items: [
            { medId: 'M008', medicineName: 'Nexium 40mg', batch: 'BT-2026-601', stripsPurchased: 3, looseTabletsPurchased: 0, tabletsPerStrip: 10, qty: 30, purchasePrice: 320, sellingPrice: 480, mfgDate: '2026-01-12', expiry: '2027-07-12' },
            { medId: 'M016', medicineName: 'Montelukast 10mg', batch: 'BT-2026-602', stripsPurchased: 4, looseTabletsPurchased: 5, tabletsPerStrip: 10, qty: 45, purchasePrice: 110, sellingPrice: 170, mfgDate: '2026-02-08', expiry: '2027-08-08' },
            { medId: 'M018', medicineName: 'Pantoprazole 40mg', batch: 'BT-2026-603', stripsPurchased: 8, looseTabletsPurchased: 0, tabletsPerStrip: 10, qty: 80, purchasePrice: 70, sellingPrice: 115, mfgDate: '2026-01-30', expiry: '2028-01-30' },
        ],
        totalAmount: 20150, totalQty: 155, createdAt: '2026-02-21T15:30:00Z'
    },
    {
        id: 'SE007', supplierId: 'S004', supplier: 'QuickDrug Distribution', invoiceNo: 'QD-INV-2026-055',
        invoiceDate: '2026-02-20', paymentMode: 'UPI', enteredBy: 'Admin User',
        remarks: 'Diabetes & cholesterol medicines',
        items: [
            { medId: 'M017', medicineName: 'Glimepiride 2mg', batch: 'BT-2026-701', stripsPurchased: 5, looseTabletsPurchased: 0, tabletsPerStrip: 10, qty: 50, purchasePrice: 65, sellingPrice: 105, mfgDate: '2026-02-05', expiry: '2027-08-05' },
            { medId: 'M012', medicineName: 'Ibuprofen 400mg', batch: 'BT-2026-702', stripsPurchased: 10, looseTabletsPurchased: 0, tabletsPerStrip: 10, qty: 100, purchasePrice: 40, sellingPrice: 65, mfgDate: '2026-01-22', expiry: '2027-07-22' },
        ],
        totalAmount: 7250, totalQty: 150, createdAt: '2026-02-20T10:00:00Z'
    },
];

// ---------- AUDIT LOGS ----------
export const mockAuditLogs = [
    { id: 'L001', action: 'Medicine Added', description: 'Added Amoxicillin 500mg to inventory', user: 'Admin User', role: 'Admin', timestamp: '2026-02-25 09:00:00', type: 'inventory' },
    { id: 'L002', action: 'Stock Updated', description: 'Updated stock of Panadol Advance: 300 → 350', user: 'Rahul Sharma', role: 'Pharmacist', timestamp: '2026-02-25 09:15:00', type: 'inventory' },
    { id: 'L003', action: 'Sale Completed', description: 'Invoice INV-001 generated — ₹582.75', user: 'Rahul Sharma', role: 'Pharmacist', timestamp: '2026-02-25 09:15:00', type: 'sales' },
    { id: 'L004', action: 'Sale Completed', description: 'Invoice INV-002 generated — ₹1,084.00', user: 'Priya Patel', role: 'Cashier', timestamp: '2026-02-25 10:30:00', type: 'sales' },
    { id: 'L005', action: 'Medicine Deleted', description: 'Removed expired batch BT-2023-099', user: 'Admin User', role: 'Admin', timestamp: '2026-02-24 14:00:00', type: 'inventory' },
    { id: 'L006', action: 'User Login', description: 'Admin User logged in', user: 'Admin User', role: 'Admin', timestamp: '2026-02-25 08:55:00', type: 'auth' },
    { id: 'L007', action: 'Supplier Added', description: 'Added new supplier: BioVita Wholesale', user: 'Admin User', role: 'Admin', timestamp: '2026-02-24 11:00:00', type: 'supplier' },
    { id: 'L008', action: 'Price Updated', description: 'Lipitor 20mg price changed: ₹480 → ₹520', user: 'Admin User', role: 'Admin', timestamp: '2026-02-24 10:30:00', type: 'inventory' },
    { id: 'L009', action: 'Sale Completed', description: 'Invoice INV-005 generated — ₹546.00', user: 'Rahul Sharma', role: 'Pharmacist', timestamp: '2026-02-24 09:30:00', type: 'sales' },
    { id: 'L010', action: 'Category Added', description: 'Added new category: Dermatology', user: 'Admin User', role: 'Admin', timestamp: '2026-02-23 15:00:00', type: 'system' },
];

// ---------- NOTIFICATIONS ----------
export const mockNotifications = [
    { id: 'N001', type: 'low_stock', title: 'Low Stock Alert', message: 'Ibuprofen 400mg has only 5 tablets left', time: '5 min ago', read: false, severity: 'warning' },
    { id: 'N002', type: 'out_of_stock', title: 'Out of Stock', message: 'Omeprazole 20mg is out of stock', time: '15 min ago', read: false, severity: 'critical' },
    { id: 'N003', type: 'expiry', title: 'Expiring Soon', message: 'Azithromycin 500mg expires in 4 days', time: '30 min ago', read: false, severity: 'warning' },
    { id: 'N004', type: 'out_of_stock', title: 'Out of Stock', message: 'Multivitamin Tablets is out of stock', time: '1 hour ago', read: true, severity: 'critical' },
    { id: 'N005', type: 'low_stock', title: 'Low Stock Alert', message: 'Glimepiride 2mg has only 3 tablets left', time: '2 hours ago', read: true, severity: 'warning' },
    { id: 'N006', type: 'expiry', title: 'Expiring Soon', message: 'Augmentin 625mg expires in 18 days', time: '3 hours ago', read: true, severity: 'info' },
    { id: 'N007', type: 'low_stock', title: 'Low Stock Alert', message: 'Ciprofloxacin 500mg has only 8 tablets left', time: '5 hours ago', read: true, severity: 'warning' },
    { id: 'N008', type: 'expiry', title: 'Expiring Soon', message: 'Lipitor 20mg expires in 35 days', time: '1 day ago', read: true, severity: 'info' },
];

// ---------- HELPER FUNCTIONS ----------
export const getDaysUntilExpiry = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getLowStockMedicines = (threshold = 10) =>
    mockMedicines.filter((m) => m.stock > 0 && m.stock <= (m.lowStockThreshold || threshold));

export const getOutOfStockMedicines = () =>
    mockMedicines.filter((m) => m.stock === 0);

export const getExpiringSoonMedicines = (days = 90) =>
    mockMedicines.filter((m) => {
        const d = getDaysUntilExpiry(m.expiry);
        return d > 0 && d <= days;
    });

export const getExpiredMedicines = () =>
    mockMedicines.filter((m) => getDaysUntilExpiry(m.expiry) <= 0);

export const getTodaysSales = () =>
    mockSales.filter((s) => s.date === '2026-02-25');

export const getTodaysRevenue = () =>
    getTodaysSales().reduce((sum, s) => sum + s.total, 0);

// Helper: Convert tablet stock to strips + loose tablets display
export const getStockDisplay = (totalTablets, tabletsPerStrip) => {
    if (!tabletsPerStrip || tabletsPerStrip <= 1) return { strips: totalTablets, loose: 0, display: `${totalTablets} units` };
    const strips = Math.floor(totalTablets / tabletsPerStrip);
    const loose = totalTablets % tabletsPerStrip;
    let display = `${totalTablets} tablets`;
    if (strips > 0 || loose > 0) {
        const parts = [];
        if (strips > 0) parts.push(`${strips} strip${strips > 1 ? 's' : ''}`);
        if (loose > 0) parts.push(`${loose} tablet${loose > 1 ? 's' : ''}`);
        display += ` (${parts.join(' + ')})`;
    }
    return { strips, loose, display };
};

export const getCategoryColor = (category) => {
    const colors = {
        Antibiotic: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
        Painkiller: { bg: 'bg-orange-50', text: 'text-orange-700', dot: 'bg-orange-500' },
        Diabetes: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
        Respiratory: { bg: 'bg-teal-50', text: 'text-teal-700', dot: 'bg-teal-500' },
        Gastro: { bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-500' },
        Vitamin: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
        Cholesterol: { bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-500' },
        Antihistamine: { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
    };
    return colors[category] || { bg: 'bg-gray-50', text: 'text-gray-700', dot: 'bg-gray-500' };
};
