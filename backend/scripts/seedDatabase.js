const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...\n');

        // Seed Users
        console.log('👥 Seeding users...');
        const users = [
            { id: 'U001', name: 'Admin User', email: 'admin@pharmacare.com', password: await bcrypt.hash('admin123', 10), role: 'Admin', phone: '+91 98765 43210', avatar: 'AU' },
            { id: 'U002', name: 'Rahul Sharma', email: 'rahul@pharmacare.com', password: await bcrypt.hash('pharma123', 10), role: 'Pharmacist', phone: '+91 98765 43211', avatar: 'RS' },
        ];

        for (const user of users) {
            await pool.query(
                'INSERT INTO users (id, name, email, password, role, phone, avatar) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=name',
                [user.id, user.name, user.email, user.password, user.role, user.phone, user.avatar]
            );
        }
        console.log('✅ Users seeded\n');

        // Seed Categories
        console.log('📂 Seeding categories...');
        const categories = [
            { id: 'C001', name: 'Antibiotic', description: 'Medicines that fight bacterial infections', color: 'blue' },
            { id: 'C002', name: 'Painkiller', description: 'Pain relief medications', color: 'orange' },
            { id: 'C003', name: 'Diabetes', description: 'Diabetes management medicines', color: 'amber' },
            { id: 'C004', name: 'Respiratory', description: 'Respiratory system medications', color: 'teal' },
            { id: 'C005', name: 'Gastro', description: 'Gastrointestinal medicines', color: 'indigo' },
            { id: 'C006', name: 'Vitamin', description: 'Vitamins and supplements', color: 'green' },
            { id: 'C007', name: 'Cholesterol', description: 'Cholesterol management drugs', color: 'rose' },
            { id: 'C008', name: 'Antihistamine', description: 'Allergy relief medications', color: 'purple' },
        ];

        for (const cat of categories) {
            await pool.query(
                'INSERT INTO categories (id, name, description, color) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=name',
                [cat.id, cat.name, cat.description, cat.color]
            );
        }
        console.log('✅ Categories seeded\n');

        // Seed Suppliers
        console.log('🏢 Seeding suppliers...');
        const suppliers = [
            { id: 'S001', name: 'MedPharma India Pvt Ltd', contact_person: 'Rajesh Kumar', phone: '+91 98110 23456', email: 'rajesh@medpharma.in', address: '42, Industrial Area, Phase-II, Chandigarh', company: 'MedPharma India', status: 'Active' },
            { id: 'S002', name: 'HealthPlus Supply Co.', contact_person: 'Sneha Reddy', phone: '+91 98220 34567', email: 'sneha@healthplus.in', address: '15, MIDC, Andheri East, Mumbai', company: 'HealthPlus', status: 'Active' },
            { id: 'S003', name: 'Global Meds Ltd', contact_person: 'Amit Joshi', phone: '+91 98330 45678', email: 'amit@globalmeds.in', address: '78, Pharma City, Hyderabad', company: 'Global Meds', status: 'Inactive' },
            { id: 'S004', name: 'QuickDrug Distribution', contact_person: 'Meera Nair', phone: '+91 98440 56789', email: 'meera@quickdrug.in', address: '23, Salt Lake, Sector V, Kolkata', company: 'QuickDrug', status: 'Active' },
            { id: 'S005', name: 'BioVita Wholesale', contact_person: 'Karan Mehta', phone: '+91 98550 67890', email: 'karan@biovita.in', address: '91, Whitefield, Bangalore', company: 'BioVita', status: 'Pending' },
        ];

        for (const sup of suppliers) {
            await pool.query(
                'INSERT INTO suppliers (id, name, contact_person, phone, email, address, company, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=name',
                [sup.id, sup.name, sup.contact_person, sup.phone, sup.email, sup.address, sup.company, sup.status]
            );
        }
        console.log('✅ Suppliers seeded\n');

        // Seed Medicines
        console.log('💊 Seeding medicines...');
        const medicines = [
            { id: 'M001', name: 'Amoxicillin 500mg', generic_name: 'Amoxicillin', category_id: 'C001', batch_number: 'BT-2024-001', supplier_id: 'S001', purchase_price: 100, selling_price: 150, stock: 120, expiry_date: '2026-10-15', added_date: '2025-06-10', medicine_type: 'Tablet', tablets_per_strip: 10, strip_price: 150, loose_tablet_price: 16, allow_loose_sale: true, low_stock_threshold: 20 },
            { id: 'M002', name: 'Panadol Advance', generic_name: 'Paracetamol', category_id: 'C002', batch_number: 'BT-2024-002', supplier_id: 'S002', purchase_price: 55, selling_price: 85, stock: 350, expiry_date: '2027-05-20', added_date: '2025-07-15', medicine_type: 'Tablet', tablets_per_strip: 15, strip_price: 85, loose_tablet_price: 6, allow_loose_sale: true, low_stock_threshold: 30 },
            { id: 'M003', name: 'Zyrtec 10mg', generic_name: 'Cetirizine', category_id: 'C008', batch_number: 'BT-2024-003', supplier_id: 'S001', purchase_price: 160, selling_price: 245, stock: 85, expiry_date: '2026-08-11', added_date: '2025-05-20', medicine_type: 'Tablet', tablets_per_strip: 10, strip_price: 245, loose_tablet_price: 26, allow_loose_sale: true, low_stock_threshold: 20 },
            { id: 'M004', name: 'Lipitor 20mg', generic_name: 'Atorvastatin', category_id: 'C007', batch_number: 'BT-2024-004', supplier_id: 'S004', purchase_price: 350, selling_price: 520, stock: 40, expiry_date: '2026-04-01', added_date: '2025-08-01', medicine_type: 'Tablet', tablets_per_strip: 10, strip_price: 520, loose_tablet_price: 55, allow_loose_sale: false, low_stock_threshold: 10 },
            { id: 'M005', name: 'Metformin 500mg', generic_name: 'Metformin', category_id: 'C003', batch_number: 'BT-2024-007', supplier_id: 'S004', purchase_price: 75, selling_price: 120, stock: 200, expiry_date: '2027-03-15', added_date: '2025-10-05', medicine_type: 'Tablet', tablets_per_strip: 15, strip_price: 120, loose_tablet_price: 9, allow_loose_sale: true, low_stock_threshold: 30 },
        ];

        for (const med of medicines) {
            await pool.query(
                `INSERT INTO medicines (id, name, generic_name, category_id, batch_number, supplier_id, purchase_price, selling_price, stock, expiry_date, added_date, medicine_type, tablets_per_strip, strip_price, loose_tablet_price, allow_loose_sale, low_stock_threshold) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=name`,
                [med.id, med.name, med.generic_name, med.category_id, med.batch_number, med.supplier_id, med.purchase_price, med.selling_price, med.stock, med.expiry_date, med.added_date, med.medicine_type, med.tablets_per_strip, med.strip_price, med.loose_tablet_price, med.allow_loose_sale, med.low_stock_threshold]
            );
        }
        console.log('✅ Medicines seeded\n');

        console.log('✨ Database seeding completed successfully!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
