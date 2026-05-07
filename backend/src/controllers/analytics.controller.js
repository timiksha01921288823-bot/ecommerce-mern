const analyticsService = require('../services/analytics.service');

// ==================== GET DASHBOARD SUMMARY ====================

const getDashboardSummary = async (req, res) => {
  try {
    const summary = await analyticsService.getDashboardSummary();
    return res.status(200).json(summary);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==================== GET SALES ANALYTICS ====================

const getSalesAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getSalesAnalytics();
    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==================== GET MONTHLY SALES ====================

const getMonthlySales = async (req, res) => {
  try {
    const sales = await analyticsService.getMonthlySales();
    return res.status(200).json(sales);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==================== GET PRODUCT ANALYTICS ====================

const getProductAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getProductAnalytics();
    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==================== GET USER ANALYTICS ====================

const getUserAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getUserAnalytics();
    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==================== GET CUSTOMER BEHAVIOR ====================

const getCustomerBehavior = async (req, res) => {
  try {
    const behavior = await analyticsService.getCustomerBehavior();
    return res.status(200).json(behavior);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==================== GET CATEGORY ANALYTICS ====================

const getCategoryAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getCategoryAnalytics();
    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// ==================== GET REVIEW ANALYTICS ====================

const getReviewAnalytics = async (req, res) => {
  try {
    const analytics = await analyticsService.getReviewAnalytics();
    return res.status(200).json(analytics);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getSalesAnalytics,
  getMonthlySales,
  getProductAnalytics,
  getUserAnalytics,
  getCustomerBehavior,
  getCategoryAnalytics,
  getReviewAnalytics
};
