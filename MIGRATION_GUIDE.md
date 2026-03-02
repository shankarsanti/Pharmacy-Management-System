# Migration Guide: From Mock Data to Backend API

This guide explains how to update your frontend components to use the real backend API instead of mock data.

## Changes Made

### 1. Removed Mock Data Dependencies

The mock data file (`frontend/src/data/mockData.js`) is no longer used. All data now comes from the MySQL database via the backend API.

### 2. Created API Service Layer

New file: `frontend/src/services/api.js`

This provides:
- Axios instance with automatic token injection
- API methods for all endpoints
- Error handling and token refresh
- Automatic redirect on 401 errors

### 3. Updated AuthContext

`frontend/src/context/AuthContext.jsx` now:
- Uses `authAPI.login()` instead of mock data
- Stores JWT token in localStorage
- Makes async API calls

## How to Update Components

### Pattern 1: Fetching Data

**Before (Mock Data):**
```javascript
import { mockMedicines } from '../data/mockData';

function Inventory() {
    const [medicines, setMedicines] = useState(mockMedicines);
}
```

**After (API):**
```javascript
import { medicinesAPI } from '../services/api';

function Inventory() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMedicines = async () => {
            try {
                const response = await medicinesAPI.getAll();
                setMedicines(response.data.medicines);
            } catch (error) {
                console.error('Failed to fetch medicines:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMedicines();
    }, []);
}
```

### Pattern 2: Creating Data

**Before (Mock Data):**
```javascript
const handleCreate = (newMedicine) => {
    setMedicines([...medicines, { ...newMedicine, id: 'M' + Date.now() }]);
};
```

**After (API):**
```javascript
const handleCreate = async (newMedicine) => {
    try {
        const response = await medicinesAPI.create(newMedicine);
        // Refresh list
        const updatedList = await medicinesAPI.getAll();
        setMedicines(updatedList.data.medicines);
        // Show success message
    } catch (error) {
        console.error('Failed to create medicine:', error);
        // Show error message
    }
};
```

### Pattern 3: Updating Data

**Before (Mock Data):**
```javascript
const handleUpdate = (id, updates) => {
    setMedicines(medicines.map(m => m.id === id ? { ...m, ...updates } : m));
};
```

**After (API):**
```javascript
const handleUpdate = async (id, updates) => {
    try {
        await medicinesAPI.update(id, updates);
        // Refresh list
        const response = await medicinesAPI.getAll();
        setMedicines(response.data.medicines);
    } catch (error) {
        console.error('Failed to update medicine:', error);
    }
};
```

### Pattern 4: Deleting Data

**Before (Mock Data):**
```javascript
const handleDelete = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
};
```

**After (API):**
```javascript
const handleDelete = async (id) => {
    try {
        await medicinesAPI.delete(id);
        setMedicines(medicines.filter(m => m.id !== id));
    } catch (error) {
        console.error('Failed to delete medicine:', error);
    }
};
```

## Component-Specific Updates

### Dashboard Component

```javascript
import { dashboardAPI } from '../services/api';

useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await dashboardAPI.getStats();
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        }
    };
    fetchStats();
}, []);
```

### Inventory Component

```javascript
import { medicinesAPI } from '../services/api';

// Fetch all medicines
const fetchMedicines = async () => {
    const response = await medicinesAPI.getAll();
    setMedicines(response.data.medicines);
};

// Get low stock alerts
const fetchLowStock = async () => {
    const response = await medicinesAPI.getLowStock();
    setLowStock(response.data.medicines);
};
```

### POS Component

```javascript
import { salesAPI, medicinesAPI } from '../services/api';

// Create sale
const handleCheckout = async (saleData) => {
    try {
        const response = await salesAPI.create({
            customer_name: customerName,
            items: cartItems.map(item => ({
                medicine_id: item.id,
                quantity: item.quantity,
                price: item.price,
                sale_type: item.saleType,
                tablets_deducted: item.tabletsDeducted
            })),
            subtotal,
            tax,
            discount,
            total,
            payment_method: paymentMethod
        });
        
        // Clear cart and show success
        setCart([]);
        alert('Sale completed: ' + response.data.saleId);
    } catch (error) {
        console.error('Sale failed:', error);
    }
};
```

### Sales Component

```javascript
import { salesAPI } from '../services/api';

// Fetch sales with date range
const fetchSales = async (startDate, endDate) => {
    const response = await salesAPI.getAll({ startDate, endDate });
    setSales(response.data.sales);
};
```

### Stock Entry Component

```javascript
import { stockEntriesAPI } from '../services/api';

// Create stock entry
const handleSubmit = async (stockData) => {
    try {
        await stockEntriesAPI.create({
            supplier_id: supplierId,
            invoice_number: invoiceNumber,
            invoice_date: invoiceDate,
            payment_mode: paymentMode,
            items: items.map(item => ({
                medicine_id: item.medicineId,
                batch_number: item.batchNumber,
                strips_purchased: item.stripsPurchased,
                loose_tablets_purchased: item.looseTabletsPurchased,
                tablets_per_strip: item.tabletsPerStrip,
                quantity: item.quantity,
                purchase_price: item.purchasePrice,
                selling_price: item.sellingPrice,
                mfg_date: item.mfgDate,
                expiry_date: item.expiryDate
            })),
            remarks
        });
        // Show success and refresh
    } catch (error) {
        console.error('Failed to create stock entry:', error);
    }
};
```

### Notifications Component

```javascript
import { notificationsAPI } from '../services/api';

// Fetch notifications
const fetchNotifications = async () => {
    const response = await notificationsAPI.getAll();
    setNotifications(response.data.notifications);
};

// Mark as read
const markAsRead = async (id) => {
    await notificationsAPI.markAsRead(id);
    fetchNotifications();
};

// Generate new notifications
const generateNotifications = async () => {
    await notificationsAPI.generate();
    fetchNotifications();
};
```

## Error Handling Best Practices

### Add Loading States

```javascript
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await medicinesAPI.getAll();
            setMedicines(response.data.medicines);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };
    fetchData();
}, []);

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage message={error} />;
```

### Use Toast Notifications

```javascript
import { useToast } from '../context/ToastContext';

const { showToast } = useToast();

const handleCreate = async (data) => {
    try {
        await medicinesAPI.create(data);
        showToast('Medicine created successfully', 'success');
    } catch (error) {
        showToast(error.response?.data?.message || 'Failed to create medicine', 'error');
    }
};
```

## Data Structure Changes

### Medicine Object

Backend returns:
```javascript
{
    id: "M001",
    name: "Amoxicillin 500mg",
    generic_name: "Amoxicillin",
    category_id: "C001",
    category_name: "Antibiotic",  // Joined from categories table
    supplier_id: "S001",
    supplier_name: "MedPharma",   // Joined from suppliers table
    batch_number: "BT-2024-001",
    purchase_price: 100,
    selling_price: 150,
    stock: 120,
    expiry_date: "2026-10-15",
    // ... other fields
}
```

### Sale Object

Backend returns:
```javascript
{
    id: "INV-001",
    sale_date: "2026-02-25",
    sale_time: "09:15:00",
    customer_name: "Walk-in",
    subtotal: 555,
    tax: 27.75,
    discount: 0,
    total: 582.75,
    payment_method: "Cash",
    billed_by: "U002",
    billed_by_name: "Rahul Sharma",  // Joined from users table
    items: [
        {
            medicine_id: "M001",
            medicine_name: "Amoxicillin 500mg",
            quantity: 2,
            price: 150,
            sale_type: "strip",
            tablets_deducted: 20
        }
    ]
}
```

## Testing Checklist

After updating each component:

- [ ] Component loads without errors
- [ ] Data fetches correctly from API
- [ ] Loading states display properly
- [ ] Error messages show when API fails
- [ ] Create operations work
- [ ] Update operations work
- [ ] Delete operations work
- [ ] Authentication required for protected routes
- [ ] Role-based access control works
- [ ] Token refresh works on 401 errors

## Common Issues

### CORS Errors
- Ensure backend CORS_ORIGIN matches frontend URL
- Check backend is running

### 401 Unauthorized
- Token expired - logout and login again
- Token not being sent - check api.js interceptor

### Data Not Updating
- Refresh data after create/update/delete
- Check network tab for API responses

### Null/Undefined Errors
- Add optional chaining: `data?.medicines`
- Check API response structure matches expectations

## Next Steps

1. Update all components one by one
2. Test each component thoroughly
3. Remove mock data file when all components updated
4. Add comprehensive error handling
5. Implement optimistic updates for better UX
6. Add data caching if needed
7. Implement real-time updates with WebSockets (optional)

## Need Help?

- Check backend logs for API errors
- Use browser DevTools Network tab
- Check API response structure
- Verify token is being sent in headers
- Test API endpoints with Postman/curl first
