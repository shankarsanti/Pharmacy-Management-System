const { pool } = require('../config/database');

async function addDoctorsTable() {
    try {
        console.log('Adding doctors table...');

        await pool.query(`
            CREATE TABLE IF NOT EXISTS doctors (
                id VARCHAR(50) PRIMARY KEY,
                name VARCHAR(200) NOT NULL,
                specialization VARCHAR(200),
                phone VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_name (name)
            )
        `);

        console.log('✅ doctors table created successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating doctors table:', error);
        process.exit(1);
    }
}

addDoctorsTable();
