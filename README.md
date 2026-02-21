# CookieBliss - Node.js + Express + SQLite + JWT Authentication

A production-ready e-commerce backend for a cookie shop with authentication and admin dashboard.

## Quick Start

### Prerequisites
- Node.js 16+
- npm

### Installation

```bash
# Install dependencies
npm install

# Start the server
npm start
```

Server runs on **http://localhost:3000**

---

## Project Structure

```
CookieBliss/
├── models/
│   └── User.js              # User database model
├── controllers/
│   └── authController.js    # Login and registration handlers
├── middleware/
│   └── authMiddleware.js    # JWT verification
├── public/
│   ├── index.html           # Home page
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── admin.html           # Admin dashboard (protected)
│   ├── css/styles.css       # Styling
│   ├── images/              # Images
│   └── js/auth.js           # Frontend JWT utilities
├── database/
│   └── cookie_orders.db     # SQLite database (auto-created)
├── server.js                # Main server (129 lines)
├── package.json             # Dependencies
└── README.md                # This file
```

---

## Authentication

### How It Works

1. **Register**: Create account with email/password (hashed with bcryptjs)
2. **Login**: Get JWT token (24-hour expiration)
3. **Protected Routes**: Use token to access admin features
4. **Role-Based Access**: Admin-only endpoints secured

### Default Admin Account

Auto-seeded when server starts:

```
Email: admin@cookiebliss.com
Password: admin123456
```

**To change credentials**, create `.env` file:

```
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=YourSecurePassword123
```

---

## API Endpoints

### Authentication

```bash
# Register
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}

# Login
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response includes JWT token and user info.

### Products

```bash
GET /api/products
# Returns: [{id, name, price}, ...]
```

### Orders

```bash
# Create order (public)
POST /api/orders
{
  "name": "Jane Smith",
  "phone": "555-1234",
  "items": [{name, price}, ...],
  "notes": "Special requests"
}

# Get orders (admin only - requires JWT)
GET /api/orders
  -H "Authorization: Bearer YOUR_TOKEN"

# Update order (admin only)
PATCH /api/orders/1
  -H "Authorization: Bearer YOUR_TOKEN"
{
  "status": "confirmed"
}
```

Valid statuses: `pending`, `confirmed`, `completed`, `cancelled`

---

## Database Schema

### Users Table
```sql
users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,      -- bcrypt hashed
  role TEXT DEFAULT 'customer', -- 'customer' or 'admin'
  created_at DATETIME
)
```

### Orders Table
```sql
orders (
  id INTEGER PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  items TEXT NOT NULL,          -- JSON array
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME
)
```

---

## Code Architecture

### server.js (129 lines)

Setup and routes:
- Express middleware
- Database initialization  
- Admin seeding
- All API endpoints

### models/User.js (70 lines)

Database operations:
- Create users table
- Register user with password hashing
- Find user by email or ID
- Verify password
- Update user role

### controllers/authController.js (110 lines)

Request handlers:
- `register()` - Validate and create account
- `login()` - Authenticate and return JWT

### middleware/authMiddleware.js (40 lines)

Middleware:
- `authenticateToken` - Verify JWT
- `authorizeRole(role)` - Check user role

---

## Security Features

✅ Password hashing (bcryptjs, 10 rounds)  
✅ JWT tokens (24-hour expiration)  
✅ Role-based access control  
✅ Input validation  
✅ SQL injection protection (parameterized queries)  
✅ XSS protection (HTML escaping)

---

## User Roles

**Customer**: Create orders, view products  
**Admin**: Create orders, manage all orders, access dashboard

---

## Frontend Pages

- **index.html**: Home page with order form
- **login.html**: Login with email/password
- **register.html**: Create new account
- **admin.html**: Order management dashboard (protected)

All use vanilla JavaScript with JWT stored in localStorage.

---

## Dependencies

```json
{
  "express": "^5.2.1",
  "sqlite3": "^5.1.6",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.2"
}
```

---

## Testing Workflow

1. **Register**: http://localhost:3000/register.html
2. **Login**: http://localhost:3000/login.html
3. **Place order**: Click "Order Now" on home page  
4. **Admin dashboard** (as admin): Click "Admin" link
5. **Update order**: Change status in dropdown

---


**Architecture highlights:**
- MVC pattern kept simple and clean
- No unnecessary abstractions
- Secure password handling
- Token-based authentication
- Protected admin routes

---

## Environment Variables

Create `.env` file:

```env
ADMIN_EMAIL=admin@cookiebliss.com
ADMIN_PASSWORD=admin123456
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

---

## Commands

```bash
npm install    # Install dependencies
npm start      # Start server on port 3000
```

---

## License

ISC
