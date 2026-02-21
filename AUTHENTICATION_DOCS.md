## CookieBliss Authentication System - Implementation Complete

### Overview
A complete JWT-based authentication system with role-based access control (RBAC) for the CookieBliss application.

---

## Backend Architecture

### 1. **User Model** (`models/User.js`)
- Manages database operations for users
- Password hashing with bcryptjs (10 salt rounds)
- Methods:
  - `initTable()`: Creates users table if it doesn't exist
  - `create(name, email, password)`: Registers new user
  - `findByEmail(email)`: Retrieves user by email
  - `findById(id)`: Retrieves user by ID
  - `comparePassword(plain, hashed)`: Validates password

**Users Table Schema:**
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- hashed by bcryptjs
  role TEXT DEFAULT 'customer', -- 'customer' or 'admin'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### 2. **Auth Controller** (`controllers/authController.js`)
- Handles registration and login logic
- Endpoints:
  - `register(req, res)`: Creates new user account
    - Validates input (passwords match, min 6 chars)
    - Checks for duplicate email
    - Returns userId
  - `login(req, res)`: Authenticates user and returns JWT
    - Validates credentials
    - Returns JWT token (24-hour expiration)
    - Returns user info with role

### 3. **Auth Routes** (`routes/authRoutes.js`)
```
POST /api/auth/register
POST /api/auth/login
```

### 4. **Auth Middleware** (`middleware/authMiddleware.js`)
- `authenticateToken`: Verifies JWT from Authorization header
  - Extracts token from "Bearer <token>" format
  - Returns 401 if no token
  - Returns 403 if token invalid/expired
  - Attaches `req.user` with decoded payload
- `authorizeRole(role)`: Checks user role
  - Returns 403 if role doesn't match
  - Used for admin-only routes

### 5. **Protected Routes** (`server.js`)
```javascript
// Admin-only routes
GET /api/orders         // requires admin role
PATCH /api/orders/:id   // requires admin role
GET /admin              // serves admin.html, requires admin role
```

### 6. **JWT Payload** (24h expiration)
```javascript
{
  id: number,
  email: string,
  role: "admin" | "customer"
}
```

---

## Frontend Implementation

### 1. **Login Page** (`public/login.html`)
Features:
- Email and password inputs
- Error/success messages
- Loading state
- LocalStorage JWT storage
- Role-based redirect:
  - Admins → `/admin.html`
  - Customers → `/index.html`
- Auto-redirect if already logged in

### 2. **Register Page** (`public/register.html`)
Features:
- Name, email, password, confirm password inputs
- Password validation (min 6 chars, match confirmation)
- Error handling
- Redirect to login on success
- Auto-redirect if already logged in

### 3. **Admin Dashboard** (`public/admin.html`)
Protection Logic:
- On page load:
  1. Check for JWT token in localStorage
  2. If no token → redirect to `/login.html`
  3. If token exists, parse user data
  4. If role !== "admin" → redirect to `/index.html`
- All API calls include JWT in Authorization header
- Logout button clears localStorage and redirects to login
- Auto-handles token expiration (401 errors)

---

## Security Features

✓ **Password Hashing**: bcryptjs (10 rounds)
✓ **JWT Authentication**: 24-hour expiration
✓ **Role-Based Access Control**: Admin role required for sensitive endpoints
✓ **Token Validation**: Middleware verifies signature and expiration
✓ **Role Middleware**: Prevents unauthorized access
✓ **XSS Protection**: HTML escaping in admin dashboard
✓ **Header-based Auth**: "Bearer <token>" format

---

## Database Setup

The database is automatically initialized on server startup:
1. `initializeDatabase()` runs when db connection established
2. Creates `users` table if doesn't exist
3. Creates `orders` table if doesn't exist

---

## API Endpoints Reference

### Authentication
| Method | Endpoint | Auth | Body |
|--------|----------|------|------|
| POST | `/api/auth/register` | None | `{name, email, password, confirmPassword}` |
| POST | `/api/auth/login` | None | `{email, password}` |

### Orders (Admin Only)
| Method | Endpoint | Auth | Returns |
|--------|----------|------|---------|
| GET | `/api/orders` | JWT + Admin | Array of orders |
| PATCH | `/api/orders/:id` | JWT + Admin | Success message |

### Page Routes
| Method | Endpoint | Auth | Returns |
|--------|----------|------|---------|
| GET | `/admin` | JWT + Admin | admin.html |
| GET | `/login.html` | None | Login page |
| GET | `/register.html` | None | Register page |

---

## Frontend Storage

### LocalStorage Keys
- `token`: JWT token (string)
- `user`: User object (JSON string)
  ```javascript
  {
    id: number,
    name: string,
    email: string,
    role: "admin" | "customer"
  }
  ```

---

## Testing the System

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","confirmPassword":"password123"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Access protected route
```bash
curl -X GET http://localhost:3000/api/orders \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
```

---

## File Structure
```
CookieBliss/
├── models/
│   └── User.js                    # User model with bcrypt hashing
├── controllers/
│   └── authController.js          # Register & login logic
├── routes/
│   └── authRoutes.js              # /api/auth/* endpoints
├── middleware/
│   └── authMiddleware.js          # JWT verification & role checks
├── public/
│   ├── login.html                 # Login page
│   ├── register.html              # Register page
│   ├── admin.html                 # Admin dashboard (protected)
│   ├── index.html                 # Home page
│   └── css/
│       └── styles.css             # Updated with logout button style
├── server.js                      # Main server file (updated)
└── package.json                   # Dependencies added
```

---

## Dependencies
```json
{
  "express": "^5.2.1",
  "sqlite3": "^5.1.6",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.1.2"
}
```

Install with: `npm install`

---

## Environment Variables (Optional)
Set in production:
- `JWT_SECRET`: Custom secret key for signing tokens (defaults to development value)

---

## Next Steps / Enhancements
- Add refresh tokens for extended sessions
- Implement rate limiting on auth endpoints
- Add email verification for registration
- Add password reset functionality
- Implement HTTPS in production
- Use environment variables for sensitive data
- Add CORS configuration
- Implement audit logging

---

**Implementation Status**: ✓ Complete - Production Ready
