const { pool } = require('../config/database');

async function addCustomerRequestsTable() {
    try {
        console.log('Adding customer_requests table...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS customer_requests (
                id VARCHAR(50) PRIMARY KEY,
                medicine_name VARCHAR(200) NOT NULL,
                generic_name VARCHAR(200),
                customer_name VARCHAR(200),
                customer_phone VARCHAR(20),
                notes TEXT,
                status ENUM('Pending', 'Ordered', 'Fulfilled', 'Cancelled') DEFAULT 'Pending',
                requested_by VARCHAR(50),
                requested_date DATE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE SET NULL,
                INDEX idx_status (status),
                INDEX idx_date (requested_date),
                INDEX idx_medicine (medicine_name)
            )
        `);

        console.log('✅ customer_requests table created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating customer_requests table:', error);
        process.exit(1);
    }
}

addCustomerRequestsTable();
