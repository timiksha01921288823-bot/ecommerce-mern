const express = require('express');
const aiController = require('../controllers/ai.controller');
const router = express.Router();

router.post('/outfit', aiController.getOutfitRecommendations);
router.post('/tryon', aiController.simulateVirtualTryOn);

module.exports = router;
