const { app } = require('.');
const { connectDb } = require('./config/db');

connectDb().then(() => {
  console.log('Database connected');
});

module.exports = app;