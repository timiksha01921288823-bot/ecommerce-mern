const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticat.js');
const authorizeAdmin = require('../middleware/authorizeAdmin.js');
const productController = require('../controllers/product.controller.js');

router.post('/', authenticate, authorizeAdmin, productController.createProduct);
router.post('/creates', authenticate, authorizeAdmin, productController.createMultipleProduct);
router.delete('/:id', authenticate, authorizeAdmin, productController.deleteProduct);
router.put('/:id', authenticate, authorizeAdmin, productController.updateProduct);

module.exports = router;