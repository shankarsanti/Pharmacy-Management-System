# Frontend Component Update Checklist

Track your progress updating components from mock data to backend API.

## Authentication ✅
- [x] AuthContext.jsx - Updated to use authAPI
- [x] LoginForm.jsx - Should work with updated AuthContext

## Core Components

### Dashboard
- [ ] Update to use `dashboardAPI.getStats()`
- [ ] Add loading state
- [ ] Add error handling
- [ ] Remove mock data imports

### Inventory Management
- [ ] Inventory.jsx
  - [ ] Fetch medicines with `medicinesAPI.getAll()`
  - [ ] Create medicine with `medicinesAPI.create()`
  - [ ] Update medicine with `medicinesAPI.update()`
  - [ ] Delete medicine with `medicinesAPI.delete()`
  - [ ] Add loading states
  - [ ] Add error handling

### Point of Sale (POS)
- [ ] POS.jsx
  - [ ] Fetch medicines for search
  - [ ] Create sale with `salesAPI.create()`
  - [ ] Update stock after sale
  - [ ] Add loading states
  - [ ] Add error handling

### Sales Management
- [ ] Sales.jsx
  - [ ] Fetch sales with `salesAPI.getAll()`
  - [ ] Filter by date range
  - [ ] View sale details
  - [ ] Add loading states
  - [ ] Add error handling

### Stock Management
- [ ] StockEntry.jsx
  - [ ] Fetch suppliers with `suppliersAPI.getAll()`
  - [ ] Fetch medicines for selection
  - [ ] Create stock entry with `stockEntriesAPI.create()`
  - [ ] Add loading states
  - [ ] Add error handling

- [ ] RemainingStocks.jsx
  - [ ] Fetch medicines with stock info
  - [ ] Show low stock alerts
  - [ ] Add loading states

### Supplier Management
- [ ] Suppliers.jsx
  - [ ] Fetch suppliers with `suppliersAPI.getAll()`
  - [ ] Create supplier with `suppliersAPI.create()`
  - [ ] Update supplier with `suppliersAPI.update()`
  - [ ] Delete supplier with `suppliersAPI.delete()`
  - [ ] Add loading states
  - [ ] Add error handling

### Category Management
- [ ] Categories.jsx
  - [ ] Fetch categories with `categoriesAPI.getAll()`
  - [ ] Create category with `categoriesAPI.create()`
  - [ ] Update category with `categoriesAPI.update()`
  - [ ] Delete category with `categoriesAPI.delete()`
  - [ ] Add loading states
  - [ ] Add error handling

### User Management
- [ ] UserManagement.jsx
  - [ ] Fetch users with `usersAPI.getAll()`
  - [ ] Create user with `usersAPI.create()`
  - [ ] Update user with `usersAPI.update()`
  - [ ] Delete user with `usersAPI.delete()`
  - [ ] Add loading states
  - [ ] Add error handling
  - [ ] Verify admin-only access

### Notifications
- [ ] Notifications.jsx
  - [ ] Fetch notifications with `notificationsAPI.getAll()`
  - [ ] Mark as read with `notificationsAPI.markAsRead()`
  - [ ] Mark all as read with `notificationsAPI.markAllAsRead()`
  - [ ] Delete notification with `notificationsAPI.delete()`
  - [ ] Generate notifications with `notificationsAPI.generate()`
  - [ ] Add loading states
  - [ ] Add error handling

### Expiry Management
- [ ] ExpiryManagement.jsx
  - [ ] Fetch expiring medicines with `medicinesAPI.getExpiring()`
  - [ ] Filter by days until expiry
  - [ ] Add loading states
  - [ ] Add error handling

### Reports
- [ ] Reports.jsx
  - [ ] Fetch sales data for reports
  - [ ] Fetch inventory data
  - [ ] Generate reports from API data
  - [ ] Add loading states
  - [ ] Add error handling

### Audit Logs
- [ ] AuditLogs.jsx
  - [ ] Fetch logs with `auditLogsAPI.getAll()`
  - [ ] Filter by type and date
  - [ ] Add loading states
  - [ ] Add error handling
  - [ ] Verify admin-only access

### Profile
- [ ] Profile.jsx
  - [ ] Fetch user data with `authAPI.getMe()`
  - [ ] Update profile
  - [ ] Change password with `authAPI.changePassword()`
  - [ ] Add loading states
  - [ ] Add error handling

### Settings
- [ ] Settings.jsx
  - [ ] Fetch settings from API
  - [ ] Update settings
  - [ ] Add loading states
  - [ ] Add error handling

## Common Updates Needed

For each component, ensure:

### 1. Import API Service
```javascript
import { medicinesAPI, salesAPI, etc } from '../services/api';
```

### 2. Remove Mock Data Imports
```javascript
// Remove this:
import { mockMedicines, mockSales } from '../data/mockData';
```

### 3. Add State Management
```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
```

### 4. Add useEffect for Data Fetching
```javascript
useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await medicinesAPI.getAll();
            setData(response.data.medicines);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);
```

### 5. Add Loading UI
```javascript
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
```

### 6. Update CRUD Operations
```javascript
// Create
const handleCreate = async (data) => {
    try {
        await medicinesAPI.create(data);
        // Refresh data
        const response = await medicinesAPI.getAll();
        setData(response.data.medicines);
        showToast('Created successfully', 'success');
    } catch (error) {
        showToast('Failed to create', 'error');
    }
};

// Update
const handleUpdate = async (id, data) => {
    try {
        await medicinesAPI.update(id, data);
        // Refresh data
        const response = await medicinesAPI.getAll();
        setData(response.data.medicines);
        showToast('Updated successfully', 'success');
    } catch (error) {
        showToast('Failed to update', 'error');
    }
};

// Delete
const handleDelete = async (id) => {
    try {
        await medicinesAPI.delete(id);
        setData(data.filter(item => item.id !== id));
        showToast('Deleted successfully', 'success');
    } catch (error) {
        showToast('Failed to delete', 'error');
    }
};
```

## Testing Checklist

After updating each component:

- [ ] Component loads without errors
- [ ] Data displays correctly
- [ ] Loading spinner shows while fetching
- [ ] Error messages display on failure
- [ ] Create operation works
- [ ] Update operation works
- [ ] Delete operation works
- [ ] Form validation works
- [ ] Toast notifications appear
- [ ] Authentication required
- [ ] Role-based access works
- [ ] No console errors
- [ ] No mock data references

## Final Steps

After all components are updated:

- [ ] Remove `frontend/src/data/mockData.js`
- [ ] Search codebase for any remaining mock data imports
- [ ] Test entire application flow
- [ ] Test with different user roles
- [ ] Test error scenarios
- [ ] Test with slow network
- [ ] Update documentation
- [ ] Create production build
- [ ] Deploy to staging
- [ ] Final testing
- [ ] Deploy to production

## Priority Order

Recommended update order:

1. ✅ AuthContext (Done)
2. Dashboard - Most visible
3. Inventory - Core functionality
4. POS - Critical for sales
5. Sales - Transaction history
6. Stock Entry - Inventory management
7. Suppliers - Supporting data
8. Categories - Supporting data
9. Notifications - User experience
10. User Management - Admin features
11. Reports - Analytics
12. Audit Logs - Admin features
13. Settings - Configuration
14. Profile - User features

## Notes

- Test each component thoroughly before moving to the next
- Keep mock data file until all components are updated
- Use git branches for each component update
- Commit after each successful component update
- Document any API issues or needed backend changes

## Progress Tracking

Total Components: 15
Completed: 1 (AuthContext)
Remaining: 14

Progress: [█░░░░░░░░░░░░░░] 7%

Update this checklist as you complete each component!
