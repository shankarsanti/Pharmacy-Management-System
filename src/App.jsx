import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Layout from './components/common/Layout';

// Auth
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleGuard from './components/auth/RoleGuard';

// Pages
import Dashboard from './components/dashboard/Dashboard';
import Inventory from './components/inventory/Inventory';
import Categories from './components/categories/Categories';
import Suppliers from './components/suppliers/Suppliers';
import POS from './components/pos/POS';
import Sales from './components/sales/Sales';
import ExpiryManagement from './components/expiry/ExpiryManagement';

import Reports from './components/reports/Reports';
import Profile from './components/profile/Profile';
import Notifications from './components/notifications/Notifications';

import StockEntry from './components/stocks/StockEntry';
import RemainingStocks from './components/stocks/RemainingStocks';
import Settings from './components/settings/Settings';
import { NotFoundPage } from './components/errors/ErrorPages';

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="categories" element={<Categories />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="pos" element={<POS />} />
          <Route path="sales" element={<Sales />} />
          <Route path="expiry" element={<ExpiryManagement />} />

          <Route path="reports" element={<Reports />} />
          <Route path="profile" element={<Profile />} />

          <Route path="stock-entry" element={<StockEntry />} />
          <Route path="remaining-stocks" element={<RemainingStocks />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
