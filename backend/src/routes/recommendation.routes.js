const express = require('express');
const authenticate = require('../middleware/authenticat.js');
const recommendationController = require('../controllers/recommendation.controller');

const router = express.Router();

router.get('/user', authenticate, recommendationController.getUserRecommendations);
router.get('/product/:productId', recommendationController.getProductRecommendations);

module.exports = router;
