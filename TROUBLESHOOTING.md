# Troubleshooting Guide

Common issues and solutions for the Pharmacy Management System.

## Backend Issues

### Database Connection Failed

**Error:** `❌ Database connection failed: Access denied for user`

**Solutions:**
1. Check MySQL is running:
   ```bash
   # macOS
   brew services list
   mysql.server status
   
   # Linux
   sudo systemctl status mysql
   ```

2. Verify credentials in `.env`:
   ```env
   DB_USER=root
   DB_PASSWORD=your_actual_password
   DB_NAME=pharmacy_db
   ```

3. Test MySQL connection:
   ```bash
   mysql -u root -p
   ```

4. Ensure database exists:
   ```sql
   SHOW DATABASES;
   ```

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions:**
1. Find and kill the process:
   ```bash
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   
   # Or change port in .env
   PORT=5001
   ```

### JWT Token Errors

**Error:** `Invalid or expired token`

**Solutions:**
1. Check JWT_SECRET is set in `.env`
2. Clear browser localStorage:
   ```javascript
   localStorage.clear();
   ```
3. Login again to get new token
4. Check token expiration in `.env`:
   ```env
   JWT_EXPIRE=7d
   ```

### Schema Import Failed

**Error:** `ERROR 1064: You have an error in your SQL syntax`

**Solutions:**
1. Ensure you're in the correct database:
   ```sql
   USE pharmacy_db;
   ```

2. Import schema correctly:
   ```bash
   mysql -u root -p pharmacy_db < config/schema.sql
   ```

3. Check MySQL version (needs 8.0+):
   ```bash
   mysql --version
   ```

### Seed Script Fails

**Error:** `Seeding error: ER_DUP_ENTRY`

**Solutions:**
1. Data already exists - this is OK
2. To reset database:
   ```sql
   DROP DATABASE pharmacy_db;
   CREATE DATABASE pharmacy_db;
   ```
   Then re-import schema and seed

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solutions:**
1. Check CORS_ORIGIN in backend `.env`:
   ```env
   CORS_ORIGIN=http://localhost:5173
   ```

2. Ensure frontend URL matches exactly
3. Restart backend after changing `.env`

## Frontend Issues

### API Connection Failed

**Error:** `Network Error` or `ERR_CONNECTION_REFUSED`

**Solutions:**
1. Ensure backend is running:
   ```bash
   cd backend
   npm run dev
   ```

2. Check API URL in frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Test backend health:
   ```bash
   curl http://localhost:5000/health
   ```

### Axios Not Found

**Error:** `Cannot find module 'axios'`

**Solutions:**
```bash
cd frontend
npm install axios
```

### Login Not Working

**Error:** `Invalid email or password` (but credentials are correct)

**Solutions:**
1. Check backend is running
2. Check network tab in browser DevTools
3. Verify database has seeded users:
   ```sql
   SELECT * FROM users;
   ```
4. Check backend logs for errors

### Token Not Being Sent

**Error:** `401 Unauthorized` on API calls

**Solutions:**
1. Check token is stored:
   ```javascript
   console.log(localStorage.getItem('pharmacare_token'));
   ```

2. Verify api.js interceptor is working
3. Check Authorization header in Network tab
4. Clear localStorage and login again

### Component Not Updating

**Error:** Data doesn't refresh after create/update/delete

**Solutions:**
1. Ensure you're refetching data after operations:
   ```javascript
   await medicinesAPI.create(data);
   // Refresh data
   const response = await medicinesAPI.getAll();
   setMedicines(response.data.medicines);
   ```

2. Check for errors in console
3. Verify API call succeeded in Network tab

### Build Errors

**Error:** Various build/compile errors

**Solutions:**
1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   ```

3. Check Node.js version (needs 16+):
   ```bash
   node --version
   ```

## Common Development Issues

### Changes Not Reflecting

**Solutions:**
1. Hard refresh browser: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Clear browser cache
3. Restart dev server
4. Check file is saved

### Environment Variables Not Working

**Solutions:**
1. Restart dev server after changing `.env`
2. Ensure `.env` is in correct directory
3. Use correct prefix for Vite: `VITE_`
4. Access with `import.meta.env.VITE_API_URL`

### Database Out of Sync

**Solutions:**
1. Check schema version matches code
2. Re-import schema:
   ```bash
   mysql -u root -p pharmacy_db < config/schema.sql
   ```
3. Re-seed database:
   ```bash
   node scripts/seedDatabase.js
   ```

## API Testing Issues

### Postman/curl Not Working

**Solutions:**
1. Get token first:
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@pharmacare.com","password":"admin123"}'
   ```

2. Use token in subsequent requests:
   ```bash
   curl http://localhost:5000/api/medicines \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

3. Check token hasn't expired (7 days default)

### 403 Forbidden

**Error:** `Access forbidden. Insufficient permissions.`

**Solutions:**
1. Check user role has permission
2. Admin-only routes require Admin role
3. Login with correct user:
   - Admin: admin@pharmacare.com
   - Pharmacist: rahul@pharmacare.com

### 404 Not Found

**Error:** `Route not found`

**Solutions:**
1. Check API endpoint URL
2. Verify route exists in backend
3. Check HTTP method (GET, POST, PUT, DELETE)
4. Ensure backend is running

## Performance Issues

### Slow API Responses

**Solutions:**
1. Check database indexes are created
2. Optimize queries with EXPLAIN
3. Add pagination for large datasets
4. Use connection pooling (already configured)
5. Check MySQL performance:
   ```sql
   SHOW PROCESSLIST;
   ```

### Memory Leaks

**Solutions:**
1. Check for unclosed database connections
2. Use connection pool (already implemented)
3. Clean up useEffect hooks:
   ```javascript
   useEffect(() => {
       let mounted = true;
       fetchData().then(data => {
           if (mounted) setData(data);
       });
       return () => { mounted = false; };
   }, []);
   ```

## Production Issues

### Backend Won't Start

**Solutions:**
1. Check all environment variables are set
2. Verify database is accessible
3. Check logs for errors
4. Ensure port is available
5. Check firewall settings

### Frontend Build Fails

**Solutions:**
1. Check all dependencies are installed
2. Fix any TypeScript/ESLint errors
3. Ensure API URL is set for production
4. Check build logs for specific errors

### Database Connection Timeout

**Solutions:**
1. Increase connection timeout in database.js
2. Check network connectivity
3. Verify database server is running
4. Check firewall rules

## Debugging Tips

### Enable Detailed Logging

Backend:
```javascript
// In server.js
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
});
```

Frontend:
```javascript
// In api.js
api.interceptors.request.use(config => {
    console.log('Request:', config);
    return config;
});

api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('Error:', error.response);
        return Promise.reject(error);
    }
);
```

### Check Database State

```sql
-- Check users
SELECT * FROM users;

-- Check medicines
SELECT * FROM medicines;

-- Check recent sales
SELECT * FROM sales ORDER BY sale_date DESC LIMIT 10;

-- Check stock levels
SELECT name, stock FROM medicines WHERE stock < low_stock_threshold;
```

### Browser DevTools

1. **Console Tab** - Check for JavaScript errors
2. **Network Tab** - Inspect API calls and responses
3. **Application Tab** - Check localStorage for token
4. **Sources Tab** - Set breakpoints for debugging

### Backend Logs

Watch backend logs in real-time:
```bash
cd backend
npm run dev
# Watch for errors and API calls
```

## Getting Help

If you're still stuck:

1. Check the error message carefully
2. Search the error in browser/terminal
3. Check backend logs
4. Check browser console
5. Verify database state
6. Test API with curl/Postman
7. Check all environment variables
8. Restart everything:
   ```bash
   # Stop all servers
   # Restart MySQL
   # Restart backend
   # Restart frontend
   ```

## Quick Reset

If everything is broken, start fresh:

```bash
# 1. Reset database
mysql -u root -p
DROP DATABASE pharmacy_db;
CREATE DATABASE pharmacy_db;
exit;

# 2. Reimport schema
cd backend
mysql -u root -p pharmacy_db < config/schema.sql

# 3. Reseed data
node scripts/seedDatabase.js

# 4. Clear frontend
cd ../frontend
rm -rf node_modules package-lock.json
npm install
localStorage.clear() # In browser console

# 5. Restart everything
cd ../backend
npm run dev

# New terminal
cd ../frontend
npm run dev
```

## Prevention

To avoid issues:

1. ✅ Always check backend logs
2. ✅ Use browser DevTools Network tab
3. ✅ Test API endpoints with curl first
4. ✅ Keep dependencies updated
5. ✅ Use version control (git)
6. ✅ Commit working code frequently
7. ✅ Test after each change
8. ✅ Read error messages carefully
9. ✅ Keep documentation updated
10. ✅ Use environment variables correctly
