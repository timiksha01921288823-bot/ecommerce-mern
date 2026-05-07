require('dotenv').config();
const mongoose = require("mongoose")

const mongoDbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce'
const connectDb = async () => {
    await mongoose.connect(mongoDbUrl)
    console.log("connected to mongodb:", mongoDbUrl)
}

module.exports={connectDb}