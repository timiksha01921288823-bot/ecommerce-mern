const Order = require('../models/order.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const Review = require('../models/review.model');
const Rating = require('../models/rating.model');

// ==================== SALES ANALYTICS ====================

const getSalesAnalytics = async () => {
  try {
    const orders = await Order.find();
    
    let totalSales = 0;
    let totalOrders = orders.length;
    let totalRevenue = 0;
    const orderStatus = {
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };

    orders.forEach(order => {
      totalRevenue += order.totalPrice || 0;
      if (order.orderStatus) {
        const status = order.orderStatus.toLowerCase();
        if (orderStatus.hasOwnProperty(status)) {
          orderStatus[status]++;
        }
      }
    });

    return {
      totalOrders,
      totalRevenue,
      averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
      orderStatus
    };
  } catch (error) {
    throw new Error(`Error fetching sales analytics: ${error.message}`);
  }
};

// ==================== MONTHLY SALES ====================

const getMonthlySales = async () => {
  try {
    const orders = await Order.find()
      .select('totalPrice createdAt orderStatus');

    const monthlySales = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlySales[monthKey]) {
        monthlySales[monthKey] = {
          month: monthKey,
          sales: 0,
          orders: 0,
          delivered: 0
        };
      }
      
      monthlySales[monthKey].sales += order.totalPrice || 0;
      monthlySales[monthKey].orders += 1;
      
      if (order.orderStatus === 'delivered') {
        monthlySales[monthKey].delivered += 1;
      }
    });

    return Object.values(monthlySales).sort((a, b) => a.month.localeCompare(b.month));
  } catch (error) {
    throw new Error(`Error fetching monthly sales: ${error.message}`);
  }
};

// ==================== PRODUCT ANALYTICS ====================

const getProductAnalytics = async () => {
  try {
    const products = await Product.find()
      .select('title price quantity discountedPrice');

    const topSellingProducts = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $group: {
          _id: '$orderItems.product',
          totalSold: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productDetails'
        }
      }
    ]);

    const lowStockProducts = await Product.find()
      .where('quantity').lt(20)
      .select('title quantity');

    return {
      totalProducts: products.length,
      topSelling: topSellingProducts,
      lowStock: lowStockProducts,
      averagePrice: products.length > 0 
        ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length).toFixed(2)
        : 0
    };
  } catch (error) {
    throw new Error(`Error fetching product analytics: ${error.message}`);
  }
};

// ==================== USER ANALYTICS ====================

const getUserAnalytics = async () => {
  try {
    const totalUsers = await User.countDocuments();
    
    // Active users (users who placed orders in last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeUsers = await Order.distinct('user', {
      createdAt: { $gte: thirtyDaysAgo }
    });

    // New users this month
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    // Users by registration date
    const userGrowth = await User.aggregate([
      { $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return {
      totalUsers,
      activeUsers: activeUsers.length,
      newUsersThisMonth,
      userGrowth
    };
  } catch (error) {
    throw new Error(`Error fetching user analytics: ${error.message}`);
  }
};

// ==================== CUSTOMER BEHAVIOR ====================

const getCustomerBehavior = async () => {
  try {
    // Average order value per user
    const userOrderStats = await Order.aggregate([
      { $group: {
          _id: '$user',
          totalSpent: { $sum: '$totalPrice' },
          orderCount: { $sum: 1 }
        }
      },
      { $sort: { totalSpent: -1 } }
    ]);

    // Customer retention (repeat customers)
    const repeatCustomers = userOrderStats.filter(stat => stat.orderCount > 1).length;
    const newCustomers = userOrderStats.filter(stat => stat.orderCount === 1).length;

    // Average customer lifetime value
    const avgLifetimeValue = userOrderStats.length > 0
      ? (userOrderStats.reduce((sum, stat) => sum + stat.totalSpent, 0) / userOrderStats.length).toFixed(2)
      : 0;

    // Most valuable customers
    const topCustomers = userOrderStats.slice(0, 10);

    return {
      totalCustomers: userOrderStats.length,
      repeatCustomers,
      newCustomers,
      retentionRate: userOrderStats.length > 0 
        ? ((repeatCustomers / userOrderStats.length) * 100).toFixed(2)
        : 0,
      avgLifetimeValue,
      topCustomers
    };
  } catch (error) {
    throw new Error(`Error fetching customer behavior: ${error.message}`);
  }
};

// ==================== CATEGORY ANALYTICS ====================

const getCategoryAnalytics = async () => {
  try {
    const categoryStats = await Order.aggregate([
      { $unwind: '$orderItems' },
      { $lookup: {
          from: 'products',
          localField: 'orderItems.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      { $group: {
          _id: '$product.category',
          totalSales: { $sum: '$orderItems.quantity' },
          revenue: { $sum: { $multiply: ['$orderItems.price', '$orderItems.quantity'] } }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    return categoryStats;
  } catch (error) {
    throw new Error(`Error fetching category analytics: ${error.message}`);
  }
};

// ==================== RATING & REVIEW ANALYTICS ====================

const getReviewAnalytics = async () => {
  try {
    const totalReviews = await Review.countDocuments();
    const totalRatings = await Rating.countDocuments();

    const averageRating = await Rating.aggregate([
      { $group: {
          _id: null,
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    const ratingDistribution = await Rating.aggregate([
      { $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);

    return {
      totalReviews,
      totalRatings,
      averageRating: averageRating[0]?.avgRating.toFixed(2) || 0,
      ratingDistribution
    };
  } catch (error) {
    throw new Error(`Error fetching review analytics: ${error.message}`);
  }
};

// ==================== DASHBOARD SUMMARY ====================

const getDashboardSummary = async () => {
  try {
    const salesAnalytics = await getSalesAnalytics();
    const userAnalytics = await getUserAnalytics();
    const productAnalytics = await getProductAnalytics();
    const customerBehavior = await getCustomerBehavior();

    return {
      sales: salesAnalytics,
      users: userAnalytics,
      products: productAnalytics,
      customers: customerBehavior,
      lastUpdated: new Date()
    };
  } catch (error) {
    throw new Error(`Error fetching dashboard summary: ${error.message}`);
  }
};

module.exports = {
  getSalesAnalytics,
  getMonthlySales,
  getProductAnalytics,
  getUserAnalytics,
  getCustomerBehavior,
  getCategoryAnalytics,
  getReviewAnalytics,
  getDashboardSummary
};
