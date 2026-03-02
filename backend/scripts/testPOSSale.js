const { pool } = require('../config/database');

(async () => {
  try {
    // Check medicines
    const [medicines] = await pool.query('SELECT id, name, stock, selling_price FROM medicines LIMIT 3');
    console.log('Available medicines:');
    medicines.forEach(m => console.log(`  - ${m.name} (ID: ${m.id}, Stock: ${m.stock}, Price: ₹${m.selling_price})`));
    
    // Check users
    const [users] = await pool.query('SELECT id, name, email FROM users LIMIT 2');
    console.log('\nAvailable users:');
    users.forEach(u => console.log(`  - ${u.name} (${u.email})`));
    
    // Check existing sales
    const [sales] = await pool.query('SELECT COUNT(*) as count FROM sales');
    console.log(`\nExisting sales in database: ${sales[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
