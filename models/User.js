const bcrypt = require("bcryptjs");

// User model: handles user database operations and password hashing
class User {
  constructor(db) {
    this.db = db;
  }

  // Create users table if it doesn't exist
  initTable() {
    return new Promise((resolve, reject) => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT DEFAULT 'customer',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Run a query (for INSERT/UPDATE)
  run(query, params) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  // Get a single row
  get(query, params) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Register a new user with hashed password
  async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.run(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "customer"]
    );
  }

  // Find user by email
  async findByEmail(email) {
    return this.get("SELECT * FROM users WHERE email = ?", [email]);
  }

  // Find user by ID
  async findById(id) {
    return this.get("SELECT id, name, email, role FROM users WHERE id = ?", [id]);
  }

  // Verify password against hashed password
  async verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user role
  async updateRole(id, role) {
    return this.run("UPDATE users SET role = ? WHERE id = ?", [role, id]);
  }
}

module.exports = User;
