require('dotenv').config();
const jwt = require('jsonwebtoken');
const SECERET_KEY = process.env.SECRET_KEY || process.env.SECERET_KEY || 'default-secret-key';

const generateToken = (userId) => {
  return jwt.sign({ userId }, SECERET_KEY, { expiresIn: '48h' });
};

const getUserIdFromToken = (token) => {
  if (!token) {
    throw new Error('Missing authentication token');
  }
  const decodedToken = jwt.verify(token, SECERET_KEY);
  return decodedToken.userId;
};

module.exports = { generateToken, getUserIdFromToken };