-- Pharmacy Management System Database Schema

CREATE DATABASE IF NOT EXISTS pharmacy_db;
USE pharmacy_db;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Admin', 'Pharmacist', 'Manager') DEFAULT 'Pharmacist',
    phone VARCHAR(20),
    avatar VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    company VARCHAR(200),
    status ENUM('Active', 'Inactive', 'Pending') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_name (name)
);

-- Medicines Table
CREATE TABLE IF NOT EXISTS medicines (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200),
    category_id VARCHAR(50),
    batch_number VARCHAR(100),
    supplier_id VARCHAR(50),
    purchase_price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    expiry_date DATE,
    added_date DATE,
    medicine_type ENUM('Tablet', 'Capsule', 'Syrup', 'Injection', 'Other') DEFAULT 'Tablet',
    tablets_per_strip INT DEFAULT 10,
    strip_price DECIMAL(10, 2),
    loose_tablet_price DECIMAL(10, 2),
    allow_loose_sale BOOLEAN DEFAULT TRUE,
    low_stock_threshold INT DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    INDEX idx_name (name),
    INDEX idx_category (category_id),
    INDEX idx_expiry (expiry_date),
    INDEX idx_stock (stock)
);

-- Stock Entries Table
CREATE TABLE IF NOT EXISTS stock_entries (
    id VARCHAR(50) PRIMARY KEY,
    supplier_id VARCHAR(50),
    invoice_number VARCHAR(100),
    invoice_date DATE,
    payment_mode ENUM('Cash', 'Card', 'UPI', 'Credit', 'Cheque') DEFAULT 'Cash',
    total_amount DECIMAL(12, 2),
    total_quantity INT,
    remarks TEXT,
    entered_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (entered_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_supplier (supplier_id),
    INDEX idx_date (invoice_date)
);

-- Stock Entry Items Table
CREATE TABLE IF NOT EXISTS stock_entry_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stock_entry_id VARCHAR(50),
    medicine_id VARCHAR(50),
    batch_number VARCHAR(100),
    strips_purchased INT DEFAULT 0,
    loose_tablets_purchased INT DEFAULT 0,
    tablets_per_strip INT DEFAULT 10,
    quantity INT NOT NULL,
    purchase_price DECIMAL(10, 2),
    selling_price DECIMAL(10, 2),
    mfg_date DATE,
    expiry_date DATE,
    FOREIGN KEY (stock_entry_id) REFERENCES stock_entries(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
    INDEX idx_stock_entry (stock_entry_id),
    INDEX idx_medicine (medicine_id)
);

-- Sales Table
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(50) PRIMARY KEY,
    sale_date DATE NOT NULL,
    sale_time TIME NOT NULL,
    customer_name VARCHAR(200),
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) DEFAULT 0,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    payment_method ENUM('Cash', 'Card', 'UPI') DEFAULT 'Cash',
    billed_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (billed_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_date (sale_date),
    INDEX idx_billed_by (billed_by)
);

-- Sale Items Table
CREATE TABLE IF NOT EXISTS sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sale_id VARCHAR(50),
    medicine_id VARCHAR(50),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    sale_type ENUM('strip', 'loose', 'unit') DEFAULT 'strip',
    tablets_deducted INT NOT NULL,
    FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
    INDEX idx_sale (sale_id),
    INDEX idx_medicine (medicine_id)
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    user_id VARCHAR(50),
    user_role VARCHAR(50),
    log_type ENUM('inventory', 'sales', 'auth', 'supplier', 'system') DEFAULT 'system',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_type (log_type),
    INDEX idx_created (created_at)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    type ENUM('low_stock', 'out_of_stock', 'expiry', 'system') NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    severity ENUM('info', 'warning', 'critical') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_read (is_read),
    INDEX idx_created (created_at)
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
