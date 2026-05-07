const Product = require('../models/product.model');

const buildKeywordRegex = (text) => {
  const clean = String(text || '')
    .toLowerCase()
    .replace(/[.*+?^${}()|[\]\\]/g, '')
    .trim();

  if (!clean) {
    return null;
  }

  const tokens = clean
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => token.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);

  if (!tokens.length) {
    return null;
  }

  return new RegExp(tokens.join('|'), 'i');
};

const getTopProducts = async (limit = 8) => {
  return await Product.find({ quantity: { $gt: 0 } })
    .sort({ discountPersent: -1, discountedPrice: 1 })
    .limit(limit)
    .populate('category')
    .exec();
};

const normalizePreference = (preference) => {
  if (!preference) return '';
  return String(preference).trim().toLowerCase();
};

const buildBudgetFilter = (budget) => {
  if (!budget) return {};

  const map = {
    low: { discountedPrice: { $lt: 700 } },
    medium: { discountedPrice: { $gte: 700, $lte: 1500 } },
    high: { discountedPrice: { $gt: 1500 } },
  };

  return map[budget.toLowerCase()] || {};
};

const preferenceIntentMap = {
  wedding: ['saree', 'gown', 'lehenga', 'party', 'embroidered'],
  party: ['dress', 'evening', 'glam', 'sequins', 'bold'],
  office: ['formal', 'blazer', 'shirt', 'trouser', 'business', 'smart'],
  casual: ['t-shirt', 'jeans', 'denim', 'relaxed', 'street'],
  travel: ['comfortable', 'lightweight', 'linen', 'easy', 'day'],
};

const resolveIntentKeywords = (occasion, style, color) => {
  const intent = normalizePreference(occasion);
  const stylePref = normalizePreference(style);
  const colorPref = normalizePreference(color);

  const extraTerms = [];
  Object.entries(preferenceIntentMap).forEach(([key, terms]) => {
    if (intent.includes(key) || stylePref.includes(key)) {
      extraTerms.push(...terms);
    }
  });

  if (stylePref.includes('minimal')) {
    extraTerms.push('minimal', 'sleek', 'clean');
  }
  if (stylePref.includes('bold')) {
    extraTerms.push('bold', 'statement', 'vibrant');
  }
  if (colorPref) {
    extraTerms.push(colorPref);
  }

  return extraTerms.join(' ');
};

const searchAIProducts = async ({ text, budget }) => {
  const regex = buildKeywordRegex(text);
  const budgetFilter = buildBudgetFilter(budget);
  const filter = { quantity: { $gt: 0 }, ...budgetFilter };

  const query = regex
    ? {
        ...filter,
        $or: [
          { title: regex },
          { brand: regex },
          { description: regex },
          { color: regex },
        ],
      }
    : filter;

  const products = await Product.find(query)
    .sort({ discountPersent: -1, discountedPrice: 1 })
    .limit(8)
    .populate('category')
    .exec();

  return products.length ? products : await getTopProducts(8);
};

const getOutfitRecommendations = async ({ occasion, style, color, budget }) => {
  const queryText = [occasion, style, color, resolveIntentKeywords(occasion, style, color)]
    .filter(Boolean)
    .join(' ');
  const recommendations = await searchAIProducts({ text: queryText, budget });

  return {
    message: `Here are AI outfit recommendations for a ${occasion || 'stylish'} look with ${style || 'modern'} accents.`,
    recommendations,
  };
};

const simulateVirtualTryOn = async ({ photoDescription, stylePreference, budget }) => {
  const hint = [photoDescription, stylePreference].filter(Boolean).join(' ');
  const queryText = `try-on ${hint || 'modern outfit'}`;
  const recommendations = await searchAIProducts({ text: queryText, budget });

  return {
    message:
      photoDescription?.trim()
        ? `Virtual try-on simulation ready for: ${photoDescription}. These products match your look and mood.`
        : 'Virtual try-on simulation ready. Here are products that complement a modern, simulated style.',
    recommendations,
  };
};

module.exports = {
  getOutfitRecommendations,
  simulateVirtualTryOn,
};
