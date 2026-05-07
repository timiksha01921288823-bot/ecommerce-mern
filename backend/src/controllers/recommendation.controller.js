const recommendationService = require('../services/recommendation.service');

const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.user?._id;
    const recommendations = await recommendationService.getUserRecommendations(userId);
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductRecommendations = async (req, res) => {
  try {
    const { productId } = req.params;
    const recommendations = await recommendationService.getProductRecommendations(productId);
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserRecommendations,
  getProductRecommendations,
};
