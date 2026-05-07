
const ratingService = require('../services/rating.service.js');

const createRating = async (req, res) => {
  try {
    const user = req.user;
    const rating = await ratingService.createRating(req.body, user);
    return res.status(201).json(rating);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Something went wrong' });
  }
};

const getProductsRating = async (req, res) => {
  try {
    const productId = req.params.productId;
    const ratings = await ratingService.getProductsRating(productId);
    return res.status(200).json(ratings);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Something went wrong' });
  }
};

module.exports = {getProductsRating,createRating}
