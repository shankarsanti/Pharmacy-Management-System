# 💊 PharmaCare — Pharmacy Management System

A modern, feature-rich **Pharmacy Management System** frontend built with **React 19**, **Vite 7**, and **TailwindCSS 4**. Designed for pharmacies to efficiently manage inventory, POS billing, sales tracking, supplier relationships, and day-to-day operations through a premium, responsive interface.

---

## 🖼️ Overview

PharmaCare provides a comprehensive dashboard-driven interface for pharmacy staff and administrators. It supports **three user roles** (Admin, Pharmacist, Cashier) and covers the full pharmacy workflow — from point-of-sale billing and inventory management to expiry tracking, multi-format reporting, and audit logging.

---

## 🚀 Tech Stack

| Technology            | Version  | Purpose                          |
| --------------------- | -------- | -------------------------------- |
| **React**             | 19.2     | UI library (with hooks & context)|
| **Vite**              | 7.3      | Build tool & dev server (HMR)    |
| **React Router DOM**  | 7.13     | Client-side routing & navigation |
| **TailwindCSS**       | 4.2      | Utility-first CSS framework      |
| **ESLint**            | 9.39     | Code linting & quality           |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd pharmacy-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** (default Vite port).

### Available Scripts

| Command           | Description                        |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Start the development server       |
| `npm run build`   | Build for production               |
| `npm run preview` | Preview the production build       |
| `npm run lint`    | Run ESLint for code quality checks |

### Demo Credentials

| Role           | Email                      | Password     |
| -------------- | -------------------------- | ------------ |
| **Admin**      | `admin@pharmacare.com`     | `admin123`   |
| **Pharmacist** | `rahul@pharmacare.com`     | `pharma123`  |
| **Cashier**    | `priya@pharmacare.com`     | `cashier123` |

---

## ✨ Features — Detailed Breakdown

### 🔐 Authentication & Authorization

- **Glassmorphism login page** with dark gradient background and frosted-glass card
- **Role-based user system** with 3 roles: Admin, Pharmacist, Cashier
- **Show/hide password toggle** for secure credential entry
- **Remember me** checkbox for session persistence
- **Persistent login** via `localStorage` — sessions survive page refreshes
- **Protected routes** — unauthenticated users are redirected to `/login`
- **Auto-redirect** — authenticated users visiting `/login` are sent to the dashboard
- **Quick-fill demo credentials** — one-click buttons to auto-fill login fields
- **Form validation** with inline error messages
- **Role-based access control** helper (`hasRole`) for conditional rendering

### 📊 Dashboard

- **6 KPI stat cards** with gradient accents and hover animations:
  - Total Medicines (unit count + product count)
  - Sales Today (revenue + invoice count)
  - Low Stock Alerts (low + out of stock combined)
  - Expiring Soon (within 60 days)
  - Total Revenue (all-time)
  - Active Suppliers (active + pending count)
- **Interactive weekly sales bar chart** (CSS-based, no chart library) with hover effects
- **Stock by category distribution** with animated progress bars for 6 categories
- **Recent sales panel** showing latest 4 invoices with payment method badges (Cash/UPI/Card)
- **Alerts panel** combining out-of-stock, low stock, and expiry warnings with severity indicators (critical/warning/info)
- **Quick action buttons** — "Add Medicine" and "New Bill" shortcuts

### 📦 Inventory Management

- **Full CRUD operations** — Add, Edit, and Delete medicines via modal forms
- **9-field medicine form**: Name, Generic Name, Category, Batch Number, Supplier, Purchase Price, Selling Price, Stock Quantity, Expiry Date
- **Real-time search** across medicine names and generic names
- **Category filter** dropdown populated from master category data
- **Stock level filter** — All / Out of Stock / Low Stock (≤10) / In Stock
- **Paginated data table** (8 items/page) with page navigation
- **Color-coded category badges** per medicine
- **Stock status badges** — "Out of Stock" (red), low stock count (amber), normal (green)
- **Expiry date highlighting** — red for ≤30 days, amber for ≤90 days
- **Hover-reveal action buttons** (Edit / Delete) per row
- **Delete confirmation dialog** before removal
- **Toast notifications** on add, edit, and delete actions

### 🏷️ Category Management

- **Card-based grid layout** (responsive 1–4 columns) with gradient-colored icons
- **Full CRUD** — Add, Edit, Delete categories via modals
- **Live medicine count** — shows how many medicines belong to each category
- **Color-coded category cards** with 8 rotating gradient themes
- **Hover-reveal edit/delete actions** per card
- **Delete confirmation** with safety message ("Medicines won't be affected")
- **Toast notifications** for all operations

### 🏭 Supplier Management

- **Searchable data table** with ID, Company, Contact, Phone, Email, Status, Orders columns
- **Full CRUD** — Add, Edit, Delete suppliers via modal forms
- **7-field supplier form**: Company Name, Contact Person, Phone, Email, Company Brand, Address, Status
- **Status badges** — Active (green), Inactive (gray), Pending (amber)
- **Supplier detail modal** — click a supplier name to view:
  - Full contact information (Contact, Phone, Email, Address, Status, Last Order)
  - List of all medicines supplied by them with pricing
- **Search** by supplier name or contact person
- **Hover-reveal action buttons** per row
- **Result count footer** — "Showing X of Y suppliers"
- **Delete confirmation dialog** and toast notifications

### 🛒 Point of Sale (POS) / Billing

- **Split-panel layout** — Medicine catalog (left) + Shopping cart (right)
- **Real-time medicine search** — filters available medicines (in-stock only)
- **Add to cart** with stock validation — prevents exceeding available stock
- **Cart item management**:
  - Increment / decrement quantity with +/− buttons
  - Direct quantity input field
  - Remove individual items
  - Cart item count badge
- **Live bill calculation**:
  - Subtotal (auto-calculated)
  - Tax at configurable rate (5%)
  - Discount input field
  - Grand Total
- **Payment method selection modal** — Cash 💵, UPI 📱, Card 💳 with descriptions
- **Invoice / Receipt generation** after payment:
  - Auto-generated Invoice ID
  - Date and time stamp
  - Itemized table (Item, Qty, Price, Total)
  - Subtotal, Tax, Discount, Grand Total breakdown
  - Payment method display
- **Print invoice** — browser print dialog
- **Empty cart state** with cart icon illustration
- **Toast notification** on successful sale

### 💰 Sales Management

- **Summary cards** — Total Revenue, Total Invoices, Items Sold
- **Date filter tabs** — All / Today / Yesterday
- **Comprehensive sales table**: Invoice ID, Date, Time, Customer, Items, Total, Payment Method, Billed By
- **Payment method badges** — Cash (green), UPI (violet), Card (blue)
- **Clickable rows** to view sale details
- **Sale detail modal**:
  - Date, Time, Customer, Payment method info
  - Itemized medicine table (Medicine, Qty, Price, Total)
  - Full bill breakdown (Subtotal, Tax, Discount, Total)

### ⏰ Expiry Tracking

- **4 summary cards** with ring-styled count indicators:
  - Expired (red)
  - Within 30 Days (orange)
  - 30–60 Days (amber)
  - 60–90 Days (yellow)
- **Filter tabs** — All / Expired / ≤30 Days / ≤60 Days / ≤90 Days
- **Data table** with: ID, Medicine (name + generic), Category badge, Batch, Stock, Expiry Date, Days Left, Status badge
- **Row highlighting** — pink background for expired, light orange for ≤30 days
- **Days-left badges**:
  - "Expired" (red, bordered)
  - ≤30 days (red)
  - ≤60 days (amber)
  - ≤90 days (yellow)
  - >90 days (green)
- **Auto-sorted** by days remaining (most urgent first)

### 🔔 Notifications

- **Unread count** displayed in header
- **"Mark all as read"** button (appears only when unread items exist)
- **Filter tabs** — All / Unread / Low Stock / Out of Stock / Expiry
- **Notification cards** with:
  - Type icons — 📦 Low Stock, 🚫 Out of Stock, ⏰ Expiry
  - Colored backgrounds for unread (amber/red/blue based on type)
  - Severity badges — Critical (red), Warning (amber), Info (blue)
  - Timestamp display
  - Click to mark as read (with blue dot indicator for unread)
- **Empty state** with bell icon and "You're all caught up!" message

### 📈 Reports — 4 Report Types

- **Tab-based navigation** — Inventory / Sales / Expiry / Supplier
- **Export buttons** — PDF and CSV export (with format-specific styling)
- **Inventory Report**:
  - 4 KPI cards: Total Products, Total Stock, Stock Value (₹), Low/Out Stock count
  - Stock Summary by Category table (Category, Products, Total Stock, Total Value)
  - 8 categories tracked
- **Sales Report**:
  - 3 KPI cards: Total Revenue, Total Invoices, Average Transaction Value
  - Sales by Payment Method breakdown (Cash, UPI, Card) with transaction counts
- **Expiry Report**:
  - Count of medicines expiring within 90 days
  - Table with Medicine, Batch, Stock, Expiry Date, Value at Risk (₹)
- **Supplier Report**:
  - Table with Supplier name, Status badge, Medicines Supplied, Total Orders, Last Order date

### 👤 User Profile

- **Profile hero card** with gradient header banner and avatar
- **User info display** — Name, Role, Email
- **Editable personal information** — toggle edit mode for: Full Name, Email, Phone, Address
- **Change password form**:
  - Current Password, New Password, Confirm Password fields
  - Validation: empty field check, password match verification
  - Success/error toast feedback
- **Two-column layout** — Personal Info (left) + Change Password (right)

### ⚙️ Application Settings

- **Pharmacy Details section**:
  - Pharmacy Name, Phone, Email (text inputs)
  - Address (textarea)
- **System Configuration section**:
  - Currency selector (₹ INR, $ USD, € EUR)
  - Tax Rate (%) — numeric input
  - Low Stock Threshold — configurable number with helper text
  - Theme toggle — Light ☀️ / Dark 🌙 with visual selection buttons
- **"Save All Settings"** button with toast confirmation

### 📝 Audit Logs

- **Filter tabs** — All / Inventory / Sales / Auth / Supplier / System
- **Data table** with: Icon, Action badge, Description, User, Role, Timestamp
- **5 action types** with unique icons & colors:
  - 📦 Inventory (blue badge)
  - 💰 Sales (green badge)
  - 🔐 Auth (violet badge)
  - 🚚 Supplier (cyan badge)
  - ⚙️ System (gray badge)
- **Hover row highlighting** for readability
- **Monospace timestamps** for precise tracking

### 🚫 Error Pages

- **404 Not Found page** — custom error page for invalid routes

---

## 🧩 Shared Components Library

The `components/common/` directory contains **8 reusable UI components** used across the application:

| Component          | Description                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **Layout**         | Main app layout wrapper with Sidebar + Navbar + Outlet for page content                          |
| **Navbar**         | Top navigation bar with search, notifications, and user menu                                     |
| **Sidebar**        | Dark gradient sidebar with grouped navigation (Main, Inventory, Management, System), user card & logout |
| **Modal**          | Generic modal dialog with configurable sizes (sm, md, lg), title, and close button               |
| **ConfirmDialog**  | Destructive action confirmation prompt with customizable title, message, and confirm/cancel       |
| **Pagination**     | Table pagination component with page numbers and navigation controls                              |
| **LoadingSpinner** | Animated loading indicator                                                                        |
| **EmptyState**     | Friendly placeholder UI for empty data views                                                      |

---

## 🔄 State Management

| Context            | Purpose                                                                                          |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **AuthContext**     | Manages user authentication state, login/logout, role checking, and `localStorage` persistence    |
| **ToastContext**    | Global toast notification system with 4 types (success ✅, error ❌, warning ⚠️, info ℹ️) and auto-dismiss |

---

## 🛣️ Routes

| Path              | Component          | Auth Required | Description               |
| ----------------- | ------------------ | ------------- | ------------------------- |
| `/login`          | LoginForm          | ❌            | User authentication       |
| `/`               | Dashboard          | ✅            | Main dashboard            |
| `/inventory`      | Inventory          | ✅            | Inventory management      |
| `/categories`     | Categories         | ✅            | Category management       |
| `/suppliers`      | Suppliers          | ✅            | Supplier management       |
| `/pos`            | POS                | ✅            | Point of Sale / Billing   |
| `/sales`          | Sales              | ✅            | Sales records             |
| `/expiry`         | ExpiryManagement   | ✅            | Expiry tracking           |
| `/notifications`  | Notifications      | ✅            | Notification center       |
| `/reports`        | Reports            | ✅            | Reports & analytics       |
| `/profile`        | Profile            | ✅            | User profile              |
| `/settings`       | Settings           | ✅            | App settings              |
| `/audit`          | AuditLogs          | ✅            | Audit log viewer          |
| `*`               | NotFoundPage       | ❌            | 404 error page            |

---

## 🗂️ Project Structure

```
pharmacy-app/
├── public/                          # Static assets
├── src/
│   ├── assets/                      # Images, icons, and other assets
│   ├── components/
│   │   ├── audit/
│   │   │   └── AuditLogs.jsx        # System activity & user action logs
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx        # Glassmorphism login with demo credentials
│   │   │   └── ProtectedRoute.jsx   # Auth guard for protected pages
│   │   ├── categories/
│   │   │   └── Categories.jsx       # Category cards with CRUD & medicine counts
│   │   ├── common/
│   │   │   ├── ConfirmDialog.jsx    # Reusable delete confirmation dialog
│   │   │   ├── EmptyState.jsx       # Empty data placeholder
│   │   │   ├── Layout.jsx           # App shell (Sidebar + Navbar + Outlet)
│   │   │   ├── LoadingSpinner.jsx   # Animated loader
│   │   │   ├── Modal.jsx            # Configurable modal (sm/md/lg)
│   │   │   ├── Navbar.jsx           # Top navigation bar
│   │   │   ├── Pagination.jsx       # Table pagination controls
│   │   │   └── Sidebar.jsx          # Dark gradient sidebar navigation
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx        # 6 KPI cards, charts, sales & alerts
│   │   ├── errors/
│   │   │   └── ErrorPages.jsx       # 404 Not Found page
│   │   ├── expiry/
│   │   │   └── ExpiryManagement.jsx # Expiry tracking with summary & filters
│   │   ├── inventory/
│   │   │   └── Inventory.jsx        # Medicine CRUD, search, filters, pagination
│   │   ├── notifications/
│   │   │   └── Notifications.jsx    # Alert cards with read/unread & severity
│   │   ├── pos/
│   │   │   └── POS.jsx              # Split-panel POS with cart & invoicing
│   │   ├── profile/
│   │   │   └── Profile.jsx          # User info editing & password change
│   │   ├── reports/
│   │   │   └── Reports.jsx          # 4-tab reports with export options
│   │   ├── sales/
│   │   │   └── Sales.jsx            # Sales table, date filters, detail modal
│   │   ├── settings/
│   │   │   └── Settings.jsx         # Pharmacy details & system configuration
│   │   └── suppliers/
│   │       └── Suppliers.jsx        # Supplier CRUD, search, detail modal
│   ├── context/
│   │   ├── AuthContext.jsx          # Auth state, login/logout, role checking
│   │   └── ToastContext.jsx         # Global toast notification system
│   ├── data/
│   │   └── mockData.js             # Mock data & helper functions (15KB+)
│   ├── App.jsx                      # Root component with routing configuration
│   ├── App.css                      # Global app styles
│   ├── index.css                    # Base/reset styles & Tailwind imports
│   └── main.jsx                     # Entry point with AuthProvider & ToastProvider
├── index.html                       # HTML entry point
├── vite.config.js                   # Vite + React + TailwindCSS configuration
├── eslint.config.js                 # ESLint configuration
├── package.json                     # Dependencies & scripts
└── README.md                        # You are here!
```

---

## 🎨 UI / UX Highlights

- **Premium glassmorphism login** with backdrop blur and gradient decorations
- **Dark gradient sidebar** with grouped navigation, active route highlighting, and hover animations
- **Gradient stat cards** with icon hover scale animations
- **CSS-based bar charts** (no external chart library required)
- **Animated progress bars** for category distribution
- **Hover-reveal action buttons** on table rows for a clean interface
- **Toast notification system** with 4 severity levels and auto-dismiss
- **Responsive design** — works on desktop and tablet screens
- **Smooth transitions** and micro-interactions throughout
- **Color-coded badges** for categories, payment methods, stock status, and expiry urgency
- **Empty state illustrations** for empty carts, notifications, and search results
- **INR (₹) currency formatting** with Indian locale number formatting

---

## 🔧 Configuration

### Vite Config

The project uses Vite with the React plugin and TailwindCSS integration. Configuration is in `vite.config.js`.

### Environment Variables

To configure environment-specific settings, create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

> **Note:** All environment variables must be prefixed with `VITE_` to be accessible in client-side code.

---

## 📄 License

This project is private and not licensed for public distribution.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Built with ❤️ using React + Vite + TailwindCSS
</p>
