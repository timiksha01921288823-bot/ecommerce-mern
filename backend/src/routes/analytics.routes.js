const express = require('express');
const authenticate = require('../middleware/authenticat.js');
const authorizeAdmin = require('../middleware/authorizeAdmin.js');
const analyticsController = require('../controllers/analytics.controller.js');

const router = express.Router();

// ==================== DASHBOARD ====================
router.get('/dashboard/summary', authenticate, authorizeAdmin, analyticsController.getDashboardSummary);

// ==================== SALES ====================
router.get('/sales', authenticate, authorizeAdmin, analyticsController.getSalesAnalytics);
router.get('/sales/monthly', authenticate, authorizeAdmin, analyticsController.getMonthlySales);

// ==================== PRODUCTS ====================
router.get('/products', authenticate, authorizeAdmin, analyticsController.getProductAnalytics);
router.get('/categories', authenticate, authorizeAdmin, analyticsController.getCategoryAnalytics);

// ==================== USERS ====================
router.get('/users', authenticate, authorizeAdmin, analyticsController.getUserAnalytics);

// ==================== CUSTOMERS ====================
router.get('/customers/behavior', authenticate, authorizeAdmin, analyticsController.getCustomerBehavior);

// ==================== REVIEWS & RATINGS ====================
router.get('/reviews', authenticate, authorizeAdmin, analyticsController.getReviewAnalytics);

module.exports = router;
