const { pool } = require('../config/database');

(async () => {
  try {
    const [sales] = await pool.query('SELECT * FROM sales ORDER BY created_at DESC LIMIT 5');
    console.log('Recent sales count:', sales.length);
    
    if (sales.length > 0) {
      console.log('\nLatest sale:');
      console.log(JSON.stringify(sales[0], null, 2));
      
      // Get items for the latest sale
      const [items] = await pool.query('SELECT * FROM sale_items WHERE sale_id = ?', [sales[0].id]);
      console.log('\nSale items:', JSON.stringify(items, null, 2));
    } else {
      console.log('No sales found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
