const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const DB_FILE = path.join(__dirname, "database", "cookie_orders.db");

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Initialize SQLite database
const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// Initialize orders table
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      items TEXT NOT NULL,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error("Error creating table:", err);
    } else {
      console.log("Orders table ready");
    }
  });
}

// Helper: Promisify db operations
function dbRun(query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

function dbAll(query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function dbGet(query, params = []) {
  return new Promise((resolve, reject) => {
    db.get(query, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// API: Get products
app.get("/api/products", (req, res) => {
  res.json([
    { id: 1, name: "Chocolate Chip", price: 25 },
    { id: 2, name: "Red Velvet", price: 30 },
    { id: 3, name: "Vanilla Almond", price: 28 }
  ]);
});

// API: POST /api/orders - Create new order
app.post("/api/orders", async (req, res) => {
  const { name, phone, items, notes } = req.body;

  // Validation
  if (!name || !phone || !items || items.length === 0) {
    return res.status(400).json({
      error: "Name, phone, and at least one item are required"
    });
  }

  try {
    const itemsJson = JSON.stringify(items);
    const result = await dbRun(
      "INSERT INTO orders (customer_name, phone, items, notes) VALUES (?, ?, ?, ?)",
      [name, phone, itemsJson, notes || ""]
    );

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      orderId: result.id
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});

// API: GET /api/orders - Retrieve all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await dbAll(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    // Parse items JSON
    const parsedOrders = orders.map(order => ({
      ...order,
      items: JSON.parse(order.items)
    }));

    res.json(parsedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// API: PATCH /api/orders/:id - Update order status
app.patch("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  // Validate status
  const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      error: "Invalid status. Valid options: " + validStatuses.join(", ")
    });
  }

  try {
    const result = await dbRun(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, message: "Order status updated" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
});

// Serve admin page
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
