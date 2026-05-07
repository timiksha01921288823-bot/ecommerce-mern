const { app } = require('.');
const { connectDb } = require('./config/db');

const PORT = process.env.PORT || 5454;

app.listen(PORT, async () => {
  await connectDb();
  console.log('Ecommerce API listening on port', PORT);
});