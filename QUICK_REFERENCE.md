# CookieBliss - Quick Reference & Interview Guide

## 🎯 Project Overview
**What**: Full-stack Node.js e-commerce backend with JWT authentication and role-based access control  
**Why**: Demonstrates backend architecture, security best practices, and full CRUD operations  
**Size**: 207 lines server code + 79-line user model + 41-line middleware (clean, minimal)

---

## 🔐 Authentication Flow

### User Registration
```
POST /api/auth/register
{ "name": "John", "email": "john@example.com", "password": "pass123" }
→ Create user with bcrypt-hashed password (10 salt rounds)
→ Return { success: true }
```

### User Login
```
POST /api/auth/login
{ "email": "john@example.com", "password": "pass123" }
→ Verify credentials
→ Return JWT token with 24-hour expiration
→ Token includes: { id, email, role }
```

### How Tokens Work
1. Frontend stores JWT in `localStorage` after login
2. Frontend includes token in Authorization header: `Authorization: Bearer <token>`
3. Middleware verifies token signature and expiration
4. If invalid, return 401 Unauthorized
5. If valid, attach user data to `req.user` for use in route handlers

---

## 👥 Role-Based Access Control

### Two Roles: Customer & Admin

#### Customer
- Register, login
- View products
- Create orders (public endpoint)
- Cannot: View all orders, modify other orders

#### Admin
- Can do everything customer can do
- View ALL orders: `GET /api/orders`
- Update order status: `PATCH /api/orders/:id`
- Access admin dashboard
- Auto-seeded on startup from `.env` variables

### Protection Pattern
```javascript
// Public route
app.post("/api/orders", (req, res) => { ... })

// Protected route (requires login)
app.get("/api/orders", authenticateToken, authorizeRole("admin"), (req, res) => { ... })
//                      ↑ Verify token      ↑ Check role
```

---

## 🗄️ Database Schema

### Users Table
```
id (primary key)
name (text)
email (text, unique)
password (hashed with bcrypt)
role (customer or admin)
created_at (timestamp)
```

### Orders Table
```
id (primary key)
customer_name (text)
phone (text)
items (JSON array stored as text)
notes (text, optional)
status (pending/confirmed/completed/cancelled)
created_at (timestamp)
```

**Why separate tables?** Normalized schema prevents data duplication. Each table has one responsibility.

---

## 📋 API Endpoints

| Method | Endpoint | Auth? | Role | Purpose |
|--------|----------|-------|------|---------|
| POST | `/api/auth/register` | ❌ | - | Create new user |
| POST | `/api/auth/login` | ❌ | - | Get JWT token |
| GET | `/api/products` | ❌ | - | View menu |
| POST | `/api/orders` | ❌ | - | Create order (public) |
| GET | `/api/orders` | ✅ | admin | Get all orders |
| PATCH | `/api/orders/:id` | ✅ | admin | Update order status |

---

## 🔑 Key Design Decisions

### 1. Why JWT Instead of Sessions?
- ✅ Stateless (no server session storage needed)
- ✅ Scalable (works with multiple servers)
- ✅ Works great for SPAs
- ❌ Can't revoke tokens immediately (but 24-hour expiration mitigates)

### 2. Why Bcrypt?
- ✅ Automatic salt generation (built-in)
- ✅ Computationally expensive (prevents brute-force attacks)
- ✅ Industry standard for password hashing
- ❌ Slightly slower than alternatives (intentional for security)

### 3. Why SQLite?
- ✅ No database server needed (single file)
- ✅ Great for small projects and interviews
- ✅ SQL is portable (easy migration to PostgreSQL later)
- ❌ Not suitable for massive scale (but neither am I!)

### 4. Why Vanilla JavaScript Frontend?
- ✅ No build step needed (pure HTML/CSS/JS)
- ✅ Shows understanding of DOM manipulation
- ✅ Demonstrates how frameworks simplify (localStorage, state management)
- ❌ More verbose than React (but proves fundamentals)

---

## 💡 What You Fixed in Refactoring

### Before → After Comparisons

| Issue | Before | After | Impact |
|-------|--------|-------|--------|
| Circular dependency | Server imports Controller imports Middleware imports Server | One-way chain (Server → Controller → Middleware) | No circular imports |
| Code duplication | Database helpers in both User model and server | Shared dbRun/dbAll helpers in server only | DRY principle |
| Routes file | Separate `/routes/authRoutes.js` for 2 endpoints | Routes inlined in server.js | Simpler structure |
| Total backend lines | 574 lines | 427 lines | 26% reduction |
| File count | 10 files | 9 files | Easier to navigate |

### Why These Improvements Matter for Interviews:
- **No circular dependencies**: Shows you understand module dependency graphs
- **DRY code**: Shows you recognize patterns and eliminate duplication
- **Simpler structure**: Shows you value clarity over over-engineering
- **Self-documenting**: Shows you can explain code confidently in 2 minutes

---

## 🧪 Testing Checklist (What I Verified)

```javascript
✅ Register new user → stores hashed password
✅ Login with correct credentials → returns JWT
✅ Login with wrong password → 401 error
✅ Access protected route without token → 401 error
✅ Access protected route with token but wrong role → 403 error
✅ Create public order → stores in database
✅ View orders (admin with token) → sees all orders
✅ Update order status → reflects in database
✅ Admin seeding → admin user created on startup
✅ Token expiration → defined as 24 hours
✅ Password hashing → plaintext never stored
```

---

## 🎓 Interview Talking Points

### Opening
*"I built a Node.js backend that manages cookie orders with JWT authentication. It demonstrates cleaner architectural patterns: no circular dependencies, DRY principles, and role-based access control."*

### Architecture
*"I separated concerns into models for data, controllers for business logic, and middleware for authentication. This makes testing and modification easier."*

### Security
*"Passwords are hashed with bcrypt (10 salt rounds), making brute-force attacks computationally infeasible. JWTs are signed and verified on each request, preventing tampering. SQL queries are parameterized to prevent injection."*

### Scalability
*"JWT tokens are stateless, so this works behind multiple servers. The database schema is normalized, preventing data duplication. Adding a new feature (like email notifications) would just be new functions in a controller."*

### Trade-offs
*"SQLite is perfect for this project size but wouldn't scale to millions of orders. Vanilla JS on frontend works but becomes verbose—I'd use React for larger apps. 24-hour token expiration is good default but real systems might use refresh tokens."*

### If Asked About Issues
*"The main improvement was eliminating circular dependencies—moves require complexity. Inlining small route files was a judgement call—clear only because we have 2 endpoints."*

---

## 🚀 Running the Project

```bash
# Set admin credentials (optional - defaults provided)
export ADMIN_EMAIL=admin@cookiebliss.com
export ADMIN_PASSWORD=admin123456

# Start server
npm install
node server.js

# Server runs on http://localhost:3000
```

### Default Credentials
```
Email: admin@cookiebliss.com
Password: admin123456
```

---

## 📂 Project Structure (Final)

```
CookieBliss/
├── server.js                    # 207 lines (main entry point)
├── package.json                 # Dependencies
├── models/
│   └── User.js                 # 79 lines (user data & auth logic)
├── controllers/
│   └── authController.js       # 121 lines (register/login logic)
├── middleware/
│   └── authMiddleware.js       # 41 lines (JWT verification, role checks)
├── database/
│   └── cookie_orders.db        # SQLite database (auto-created)
├── public/
│   ├── index.html              # Home page
│   ├── login.html              # Login form
│   ├── register.html           # Registration form
│   ├── admin.html              # Admin dashboard
│   ├── js/
│   │   └── auth.js             # Frontend auth utilities
│   └── css/
│       └── styles.css          # Styling
└── README.md                    # Full documentation
```

---

## 🔍 Code You'd Be Explaining

### Middleware (Role Check Pattern)
```javascript
// middleware/authMiddleware.js - Line 20-25
const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    next();
  };
};
```
**Interview point**: *"This is a middleware factory that returns middleware. It checks if the user's role matches the required role and either allows or blocks access with a 403 Forbidden response."*

### Password Verification (Security Pattern)
```javascript
// models/User.js - Line 45-48
async verifyPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}
```
**Interview point**: *"bcrypt.compare does the heavy lifting—it takes the plaintext password, salts it the same way as the stored hash, and compares. Never store plaintext passwords or use simple comparison."*

### Protected Route (RBAC Pattern)
```javascript
// server.js - Line 162-164
app.get("/api/orders", authenticateToken, authorizeRole("admin"), async (req, res) => {
  // Only admin users reach here
});
```
**Interview point**: *"Express middleware chains let you stack protections. authenticateToken verifies the JWT exists and is valid. authorizeRole checks the role. If either fails, the route handler never runs."*

---

## 📖 Next Steps for Interviews

### If You Have Time:
1. Add email verification on registration
2. Implement refresh tokens (refresh when main token expires)
3. Add order history for customers
4. Add Google OAuth login

### If Asked "What Would You Do Differently?"
- *"For a larger app, I'd use a framework like Next.js for cleaner routing"*
- *"I'd add comprehensive integration tests using Jest"*
- *"I'd use PostgreSQL for serious data, but SQLite is smart for learning"*
- *"I might add input sanitization libraries like validator.js"*

---

## ✨ Key Takeaway

**This project proves you understand:**
- ✅ HTTP and REST principles
- ✅ Authentication (JWT) and authorization (RBAC)
- ✅ Backend architecture (MVC pattern)
- ✅ Database design (normalization, relationships)
- ✅ Security best practices (hashing, parameterized queries)
- ✅ Code organization and refactoring
- ✅ How frontend and backend integrate

**In an interview, you're not just showing code—you're showing you understand the "why" behind every decision.**
