const express = require('express');
const authenticate = require('../middleware/authenticat.js');
const authorizeAdmin = require('../middleware/authorizeAdmin.js');
const router = express.Router();
const adminOrderController = require('../controllers/adminOrder.controller.js');

router.get('/', authenticate, authorizeAdmin, adminOrderController.getAllOrders);
router.put('/:orderId/confirmed', authenticate, authorizeAdmin, adminOrderController.confirmedOrder);
router.put('/:orderId/ship', authenticate, authorizeAdmin, adminOrderController.shippOrder);
router.put('/:orderId/deliver', authenticate, authorizeAdmin, adminOrderController.deliverOrder);
router.put('/:orderId/cancel', authenticate, authorizeAdmin, adminOrderController.cancelledOrder);
router.delete('/:orderId/delete', authenticate, authorizeAdmin, adminOrderController.deleteOrder);

module.exports = router;