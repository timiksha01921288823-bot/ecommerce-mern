const Product = require('../models/product.model');
const Order = require('../models/order.model');
const OrderItem = require('../models/orderItems');

const getTopDiscountedProducts = async (limit = 6) => {
  return await Product.find({ quantity: { $gt: 0 } })
    .sort({ discountPersent: -1 })
    .limit(limit)
    .populate('category')
    .exec();
};

const getUserRecommendations = async (userId) => {
  const orders = await Order.find({ user: userId })
    .populate({
      path: 'orderItems',
      populate: { path: 'product', populate: { path: 'category' } },
    })
    .exec();

  const purchasedProductIds = new Set();
  const categoryCount = {};
  const brandCount = {};

  orders.forEach((order) => {
    order.orderItems.forEach((item) => {
      if (!item || !item.product) return;
      purchasedProductIds.add(item.product._id.toString());
      if (item.product.category) {
        const categoryId = item.product.category._id.toString();
        categoryCount[categoryId] = (categoryCount[categoryId] || 0) + 1;
      }
      if (item.product.brand) {
        const brand = item.product.brand.toLowerCase();
        brandCount[brand] = (brandCount[brand] || 0) + 1;
      }
    });
  });

  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0]);

  const sortedBrands = Object.entries(brandCount)
    .sort((a, b) => b[1] - a[1])
    .map((entry) => entry[0]);

  if (!sortedCategories.length && !sortedBrands.length) {
    return await getTopDiscountedProducts(8);
  }

  const filter = { _id: { $nin: Array.from(purchasedProductIds) }, quantity: { $gt: 0 } };
  if (sortedCategories.length) {
    filter.category = { $in: sortedCategories };
  }

  let recommendations = await Product.find(filter)
    .sort({ discountPersent: -1 })
    .limit(8)
    .populate('category')
    .exec();

  if (recommendations.length < 4 && sortedBrands.length) {
    const fallback = await Product.find({
      brand: { $in: sortedBrands },
      _id: { $nin: Array.from(purchasedProductIds) },
      quantity: { $gt: 0 },
    })
      .sort({ discountPersent: -1 })
      .limit(8 - recommendations.length)
      .populate('category')
      .exec();

    recommendations = recommendations.concat(fallback);
  }

  return recommendations.length ? recommendations : await getTopDiscountedProducts(8);
};

const getProductRecommendations = async (productId) => {
  const product = await Product.findById(productId).populate('category').exec();
  if (!product) {
    throw new Error('Product not found');
  }

  const similarByCategory = await Product.find({
    category: product.category?._id,
    _id: { $ne: product._id },
    quantity: { $gt: 0 },
  })
    .sort({ discountPersent: -1 })
    .limit(6)
    .populate('category')
    .exec();

  if (similarByCategory.length >= 4) {
    return similarByCategory;
  }

  const similarByBrand = await Product.find({
    brand: product.brand,
    _id: { $ne: product._id },
    quantity: { $gt: 0 },
  })
    .sort({ discountPersent: -1 })
    .limit(6)
    .populate('category')
    .exec();

  return [...similarByCategory, ...similarByBrand].slice(0, 8);
};

module.exports = {
  getUserRecommendations,
  getProductRecommendations,
};
