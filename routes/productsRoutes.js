// routes/productsRoutes.js

const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// GET all products
router.get('/', productsController.getAllProducts);

// GET product by id
router.get('/:id', productsController.getProductById);

module.exports = router;