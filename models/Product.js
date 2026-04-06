// models/Product.js

const db = require('../config/db');

const Product = {
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM products');
    return rows;
  },

  getById: async (id) => {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    return rows[0];
  }
};

module.exports = Product;