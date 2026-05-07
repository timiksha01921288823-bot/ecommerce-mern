const CartItem = require("../models/cartItem.model.js");
const userService=require("../services/user.service.js");


// Create a new cart item
async function createCartItem(cartItemData) {
  const cartItem = new CartItem(cartItemData);
  cartItem.quantity = 1;
  cartItem.price = cartItemData.price || 0;
  cartItem.discountedPrice = cartItemData.discountedPrice || 0;

  const createdCartItem = await cartItem.save();
  return createdCartItem;
}

// Update an existing cart item
async function updateCartItem(userId, cartItemId, cartItemData) {
  const item = await findCartItemById(cartItemId);

  if (!item) {
    throw new Error(`Cart item not found: ${cartItemId}`);
  }

  if (item.userId.toString() !== userId.toString()) {
    throw new Error("You can't update another user's cart item");
  }

  item.quantity = Number(cartItemData.quantity) || item.quantity;
  item.price = item.quantity * item.product.price;
  item.discountedPrice = item.quantity * item.product.discountedPrice;

  const updatedCartItem = await item.save();
  return updatedCartItem;
}

// Check if a cart item already exists in the user's cart
async function isCartItemExist(cart, product, size, userId) {
  const cartItem = await CartItem.findOne({ cart, product, size, userId });
  return cartItem;
}

// Remove a cart item
async function removeCartItem(userId, cartItemId) {
  const cartItem = await findCartItemById(cartItemId);

  if (cartItem.userId.toString() !== userId.toString()) {
    throw new Error("You can't remove another user's item");
  }

  await CartItem.findByIdAndDelete(cartItem.id);
}

// Find a cart item by its ID
async function findCartItemById(cartItemId) {
  const cartItem = await CartItem.findById(cartItemId).populate('product');
  if (cartItem) {
    return cartItem;
  }
  throw new Error(`CartItem not found with id: ${cartItemId}`);
}

module.exports = {
  createCartItem,
  updateCartItem,
  isCartItemExist,
  removeCartItem,
  findCartItemById,
};
