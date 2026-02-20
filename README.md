# CookieBliss

CookieBliss is a simple commercial website for selling homemade cookies with an integrated order management system.
The project is built as a real client product while applying university-level web development skills.

## Features

### Customer Facing
- Responsive product listing
- Clean order form modal
- Real-time form validation
- Order submission with fetch API

### Admin Features
- Order management dashboard (`/admin`)
- View all customer orders
- Update order status (pending → confirmed → completed/cancelled)
- Auto-refresh orders every 30 seconds
- Responsive admin table

## Technologies
- **Frontend**: HTML5, CSS3, JavaScript (ES6)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Styling**: Pure CSS (no frameworks)

## Installation & Setup

```bash
# Install dependencies
npm install

# Start the server
npm start
```

The app will run on `http://localhost:3000`

## Project Structure

```
.
├── index.html          # Customer homepage with order form
├── admin.html          # Order management dashboard
├── server.js           # Express backend & API endpoints
├── styles.css          # All styling (responsive design)
├── package.json        # Dependencies
└── cookie_orders.db    # SQLite database (auto-created)
```

## API Endpoints

### Products
- `GET /api/products` - Get all available products

### Orders
- `POST /api/orders` - Create new order
  ```json
  {
    "name": "John Doe",
    "phone": "+46 123 456 789",
    "items": [{"id": 1, "name": "Chocolate Chip", "price": 25}],
    "notes": "No nuts please"
  }
  ```

- `GET /api/orders` - Retrieve all orders (admin)

- `PATCH /api/orders/:id` - Update order status
  ```json
  {
    "status": "confirmed"
  }
  ```
  Valid statuses: `pending`, `confirmed`, `completed`, `cancelled`

## Database Schema

**orders** table:
```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  items TEXT NOT NULL,        -- JSON array
  notes TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Usage

### Placing an Order (Customer)
1. Click "Order Now" button on homepage
2. Fill in name and phone
3. Select items
4. Add special instructions (optional)
5. Submit order

### Managing Orders (Admin)
1. Navigate to `/admin`
2. View all submitted orders
3. Update status using dropdown menu
4. Changes apply immediately
5. Orders auto-refresh every 30 seconds
