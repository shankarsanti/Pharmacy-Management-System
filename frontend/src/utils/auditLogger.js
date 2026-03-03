import { auditLogsAPI } from '../services/api';

/**
 * Create an audit log entry
 * @param {string} action - The action performed (e.g., "Medicine Added", "Sale Created")
 * @param {string} description - Detailed description of the action
 * @param {string} log_type - Type of log: 'inventory', 'sales', 'auth', 'supplier', 'system'
 */
export const createAuditLog = async (action, description, log_type = 'system') => {
    try {
        await auditLogsAPI.create({ action, description, log_type });
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // Don't throw error - audit logging should not break the main flow
    }
};

// Predefined audit log creators for common actions
export const auditLog = {
    // Inventory actions
    medicineAdded: (medicineName) => 
        createAuditLog('Medicine Added', `Added new medicine: ${medicineName}`, 'inventory'),
    
    medicineUpdated: (medicineName) => 
        createAuditLog('Medicine Updated', `Updated medicine: ${medicineName}`, 'inventory'),
    
    medicineDeleted: (medicineName) => 
        createAuditLog('Medicine Deleted', `Deleted medicine: ${medicineName}`, 'inventory'),
    
    // Sales actions
    saleCreated: (saleId, total) => 
        createAuditLog('Sale Created', `Created sale ${saleId} for ₹${total}`, 'sales'),
    
    // Stock actions
    stockAdded: (invoiceNo, totalQty) => 
        createAuditLog('Stock Entry', `Added stock via invoice ${invoiceNo} (${totalQty} items)`, 'inventory'),
    
    // Supplier actions
    supplierAdded: (supplierName) => 
        createAuditLog('Supplier Added', `Added new supplier: ${supplierName}`, 'supplier'),
    
    supplierUpdated: (supplierName) => 
        createAuditLog('Supplier Updated', `Updated supplier: ${supplierName}`, 'supplier'),
    
    supplierDeleted: (supplierName) => 
        createAuditLog('Supplier Deleted', `Deleted supplier: ${supplierName}`, 'supplier'),
    
    // Category actions
    categoryAdded: (categoryName) => 
        createAuditLog('Category Added', `Added new category: ${categoryName}`, 'inventory'),
    
    categoryUpdated: (categoryName) => 
        createAuditLog('Category Updated', `Updated category: ${categoryName}`, 'inventory'),
    
    categoryDeleted: (categoryName) => 
        createAuditLog('Category Deleted', `Deleted category: ${categoryName}`, 'inventory'),
    
    // User actions
    userAdded: (userName, role) => 
        createAuditLog('User Added', `Added new user: ${userName} (${role})`, 'auth'),
    
    userUpdated: (userName) => 
        createAuditLog('User Updated', `Updated user: ${userName}`, 'auth'),
    
    userDeleted: (userName) => 
        createAuditLog('User Deleted', `Deleted user: ${userName}`, 'auth'),
    
    // Auth actions
    login: (userName) => 
        createAuditLog('User Login', `${userName} logged in`, 'auth'),
    
    logout: (userName) => 
        createAuditLog('User Logout', `${userName} logged out`, 'auth'),
    
    passwordChanged: () => 
        createAuditLog('Password Changed', 'User changed their password', 'auth'),
    
    // Settings actions
    settingsUpdated: () => 
        createAuditLog('Settings Updated', 'System settings were updated', 'system'),
    
    doctorAdded: (doctorName) => 
        createAuditLog('Doctor Added', `Added new doctor: ${doctorName}`, 'system'),
    
    doctorUpdated: (doctorName) => 
        createAuditLog('Doctor Updated', `Updated doctor: ${doctorName}`, 'system'),
    
    doctorDeleted: (doctorName) => 
        createAuditLog('Doctor Deleted', `Deleted doctor: ${doctorName}`, 'system'),
};
