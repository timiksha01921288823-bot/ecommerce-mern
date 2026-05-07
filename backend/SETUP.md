# Backend Setup Instructions

## Quick Start (Development)

```bash
cd backend
npm install
npm run dev
```

Backend will run on `http://localhost:5454`

## Production Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend root directory:

```
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Security
SECRET_KEY=your-secret-key-min-32-characters-long
NODE_ENV=production

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
PAYMENT_CALLBACK_URL=https://yourdomain.com/payment

# Server
PORT=5454

# CORS (comma-separated domains)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 3. Start Production Server

Using PM2 (recommended):
```bash
npm install -g pm2
pm2 start src/server.js --name "ecommerce-api"
pm2 save
pm2 startup
```

Or directly:
```bash
npm run start
```

### 4. Generate Secret Key

```bash
# Using OpenSSL
openssl rand -hex 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## API Routes Overview

### Authentication Routes (`/api/auth`)
- `POST /login` - User login
- `POST /signup` - User registration
- `GET /verify` - Verify JWT token

### Product Routes (`/api/products`)
- `GET /` - Get all products
- `GET /:id` - Get product by ID
- `GET /smart-search/:query` - AI-powered smart search
- `GET /category/:category` - Products by category
- Admin: Create, update, delete products

### Cart Routes (`/api/cart`)
- `GET /` - Get user's cart
- `POST /` - Add to cart
- `PUT /:id` - Update cart item
- `DELETE /:id` - Remove from cart

### Order Routes (`/api/orders`)
- `GET /` - Get user's orders
- `POST /` - Create order
- `GET /:id` - Get order details
- Admin: View all orders, update status

### Payment Routes (`/api/payments`)
- `POST /create` - Create Razorpay order
- `POST /verify` - Verify payment

### Recommendation Routes (`/api/recommendations`)
- `GET /user/:userId` - Get personalized recommendations
- `GET /product/:productId` - Get similar products

### AI Routes (`/api/ai`)
- `POST /outfit` - AI outfit recommendation
- `POST /tryon` - Virtual try-on simulation

## Database Schema

### User Model
- `_id`: MongoDB ID
- `firstName`, `lastName`: Name
- `email`: Email (unique)
- `password`: Hashed password
- `addresses`: Array of address objects
- `role`: "CUSTOMER" or "ADMIN"
- `createdAt`, `updatedAt`: Timestamps

### Product Model
- `_id`: MongoDB ID
- `title`, `brand`: Product info
- `description`: Details
- `price`, `discountPersent`: Pricing
- `quantity`: Stock count
- `category`: Reference to Category
- `color`, `sizes`: Variants
- `imageUrl`: Product images
- `ratings`, `reviews`: Nested arrays

### Order Model
- `_id`: MongoDB ID
- `user`: Reference to User
- `orderItems`: Array of items
- `totalPrice`: Order total
- `status`: "PENDING", "PLACED", "CONFIRMED", "SHIPPED", "DELIVERED"
- `createdAt`: Order date

## Monitoring

### Check Server Status
```bash
pm2 status
pm2 logs ecommerce-api
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:5454/api/products

# With authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5454/api/users/profile
```

## Troubleshooting

### Port Already in Use
```bash
lsof -i :5454
kill -9 <PID>
```

### Database Connection Error
- Verify `MONGODB_URI` in `.env`
- Check MongoDB Atlas IP whitelist
- Ensure network connectivity

### JWT Authentication Fails
- Verify `SECRET_KEY` is set correctly
- Token may be expired (48h validity)
- Check Authorization header format: `Bearer <token>`

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce` |
| `SECRET_KEY` | JWT signing secret | `your-secret-key-here` |
| `RAZORPAY_KEY_ID` | Razorpay public key | `rzp_live_xxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | `xxxxx` |
| `PAYMENT_CALLBACK_URL` | Frontend callback URL | `https://yourdomain.com/payment` |
| `PORT` | Server port | `5454` |
| `NODE_ENV` | Environment | `production` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://yourdomain.com` |

## Scripts

```json
{
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "seed": "node seed.js"
}
```

Run with: `npm run <script-name>`
