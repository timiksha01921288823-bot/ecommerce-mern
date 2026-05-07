const aiService = require('../services/ai.service');

const getOutfitRecommendations = async (req, res) => {
  try {
    const preferences = req.body || {};
    const recommendation = await aiService.getOutfitRecommendations(preferences);
    res.status(200).json(recommendation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const simulateVirtualTryOn = async (req, res) => {
  try {
    const input = req.body || {};
    const result = await aiService.simulateVirtualTryOn(input);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getOutfitRecommendations,
  simulateVirtualTryOn,
};