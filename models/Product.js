// models/Product.js

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database/cookie_orders.db');

const Product = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM products WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });
  }
};

module.exports = Product;