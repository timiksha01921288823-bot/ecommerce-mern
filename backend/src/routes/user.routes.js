const express = require('express');
const authenticate = require('../middleware/authenticat.js');
const authorizeAdmin = require('../middleware/authorizeAdmin.js');
const router = express.Router();
const userController = require('../controllers/user.controller.js');

// ==================== PUBLIC ROUTES ====================
router.get('/', userController.getAllUsers);
router.get('/profile', authenticate, userController.getUserProfile);

// ==================== ADMIN ROUTES ====================
router.get('/admin/:id', authenticate, authorizeAdmin, userController.getUserById);
router.put('/admin/:id', authenticate, authorizeAdmin, userController.updateUser);
router.delete('/admin/:id', authenticate, authorizeAdmin, userController.deleteUser);
router.put('/admin/:id/promote', authenticate, authorizeAdmin, userController.promoteToAdmin);
router.put('/admin/:id/remove-admin', authenticate, authorizeAdmin, userController.removeAdminRole);

module.exports = router;