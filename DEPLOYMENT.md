# 🚀 FASHN E-Commerce Platform - Deployment Guide

## Project Overview
**FASHN** is a modern, AI-powered MERN (MongoDB, Express, React, Node.js) e-commerce platform with smart search, outfit recommendations, and virtual try-on features.

---

## 📁 Project Structure

```
ecommerce-mern/
├── backend/                    # Node.js + Express API server
│   ├── src/
│   │   ├── config/            # Configuration files (DB, JWT, Razorpay)
│   │   ├── controllers/       # Request handlers for all routes
│   │   ├── models/            # MongoDB Mongoose schemas
│   │   ├── routes/            # API endpoint definitions
│   │   ├── services/          # Business logic (search, recommendations, AI)
│   │   ├── middleware/        # Authentication and custom middleware
│   │   ├── index.js           # Express app setup & route mounting
│   │   └── server.js          # Server startup entry point
│   ├── package.json
│   ├── .env.example
│   ├── .gitignore
│   └── README.md
│
├── frontend/                   # React SPA (Single Page Application)
│   ├── src/
│   │   ├── config/            # API client configuration
│   │   ├── Redux/             # State management (Auth, Cart, Products)
│   │   ├── Routers/           # React Router setup
│   │   ├── Pages/             # Page components (Homepage, etc.)
│   │   ├── customer/          # Customer-facing components
│   │   │   ├── Components/    # Reusable UI components
│   │   │   │   ├── AI/        # AI features (StyleAssistant, OutfitRec)
│   │   │   │   ├── Navbar/
│   │   │   │   ├── Cart/
│   │   │   │   ├── Home/
│   │   │   │   ├── Product/
│   │   │   │   └── ...
│   │   │   └── Pages/         # Page-level components
│   │   ├── Admin/             # Admin dashboard components
│   │   ├── Styles/            # CSS styles
│   │   ├── App.js
│   │   └── index.js
│   ├── public/                # Static assets
│   ├── package.json
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── build/                 # Production build (generated)
│   └── .gitignore
│
├── .env.example               # Environment variables template
├── Ecommerce Api.postman_collection.json  # API documentation
├── seed.js                    # Database seeding script
└── deployed link.txt          # Deployment link reference
```

---

## 🔧 Prerequisites

### System Requirements
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (or yarn)
- **MongoDB**: v4.0.0 or higher (Local or Atlas)
- **Git**: For version control
- **Linux/macOS/Windows** with terminal access

### External Services
1. **MongoDB Atlas** - Cloud database (recommended for production)
2. **Razorpay** - Payment gateway (Indian payment processing)
3. **Hosting Platform** - VPS, cPanel, or cloud (AWS, Heroku, Render, etc.)

---

## 🔐 Environment Configuration

### Backend `.env` File

Create `/backend/.env` from `.env.example`:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# JWT Secret (Generate a strong random string)
SECRET_KEY=your-super-secret-jwt-key-generate-with-openssl-rand-hex-32

# Razorpay Payment Gateway
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx

# Server Configuration
PORT=5454
NODE_ENV=production

# Frontend Callback
PAYMENT_CALLBACK_URL=https://yourdomain.com/payment

# CORS Configuration (in production)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Frontend `.env` File

Create `/frontend/.env.production`:

```bash
# API Base URL (Point to your backend API)
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

---

## 📦 Dependencies

### Backend Dependencies

```json
{
  "express": "^4.18.2",              // Web framework
  "mongoose": "^7.3.2",               // MongoDB ODM
  "jsonwebtoken": "^9.0.1",           // JWT authentication
  "bcrypt": "^5.1.0",                 // Password hashing
  "cors": "^2.8.5",                   // Cross-Origin Resource Sharing
  "dotenv": "^16.3.1",                // Environment variables
  "razorpay": "^2.9.1",               // Payment gateway
  "node-fetch": "^3.3.2",             // HTTP client
  "swagger-jsdoc": "^6.2.8",          // API documentation
  "swagger-ui-express": "^5.0.0",     // Swagger UI
  "nodemon": "^3.0.1"                 // Dev server auto-reload
}
```

### Frontend Dependencies

```json
{
  "react": "^18.2.0",                 // UI framework
  "react-router-dom": "^6.11.0",      // Client-side routing
  "redux": "^4.2.1",                  // State management
  "react-redux": "^8.0.5",            // Redux bindings
  "axios": "^1.4.0",                  // HTTP client
  "@mui/material": "^5.12.3",         // Material UI components
  "@emotion/react": "^11.10.8",       // CSS-in-JS
  "tailwindcss": "^3.0.0",            // Utility CSS
  "react-alice-carousel": "^2.7.1",   // Product carousel
  "react-apexcharts": "^1.4.0"        // Admin dashboard charts
}
```

---

## 🚀 Deployment Steps

### Step 1: Prepare Your Server

#### On Linux VPS / cPanel

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js & npm
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MongoDB (or use MongoDB Atlas)
# For production, use MongoDB Atlas: https://www.mongodb.com/cloud/atlas

# Install PM2 (Process Manager for Node.js)
sudo npm install -g pm2

# Install Nginx (Reverse proxy & static file server)
sudo apt install -y nginx

# Verify installations
node --version
npm --version
pm2 --version
```

### Step 2: Clone & Setup Backend

```bash
# Clone repository
cd /var/www
git clone https://github.com/yourusername/ecommerce-mern.git
cd ecommerce-mern/backend

# Install dependencies
npm install

# Create .env file with production values
cp .env.example .env
# Edit .env with your production credentials
nano .env

# Test the backend
npm run dev
# Ctrl+C to stop

# Build for production (if using build process)
npm run build
```

### Step 3: Setup & Deploy Backend with PM2

```bash
# Start backend with PM2
pm2 start src/server.js --name "ecommerce-api"

# Save PM2 configuration
pm2 save

# Enable PM2 auto-restart on system reboot
pm2 startup
# Follow the command output to complete setup

# Monitor the process
pm2 monit
pm2 logs ecommerce-api
```

### Step 4: Build & Deploy Frontend

```bash
cd /var/www/ecommerce-mern/frontend

# Install dependencies
npm install

# Build production bundle
npm run build
# Output will be in /build directory

# Verify build
ls -la build/
```

### Step 5: Configure Nginx

Create `/etc/nginx/sites-available/ecommerce`:

```nginx
# Backend API server
upstream backend {
    server 127.0.0.1:5454;
}

server {
    listen 80;
    server_name api.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL certificates (Use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # API proxy
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
    }
}

# Frontend server
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Frontend files
    root /var/www/ecommerce-mern/frontend/build;
    index index.html index.htm;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # React Router - Serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the Nginx configuration:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Enable auto-start on reboot
sudo systemctl enable nginx
```

### Step 6: Setup SSL/TLS with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot certonly --standalone -d api.yourdomain.com -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
sudo systemctl enable certbot.timer
```

### Step 7: Database Setup

#### Using MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/ecommerce`
5. Use in `.env` file

#### Using Local MongoDB

```bash
# Install MongoDB
sudo apt install -y mongodb

# Start service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Seed initial data
cd /var/www/ecommerce-mern
node seed.js
```

---

## 🧪 Health Checks & Monitoring

### Test Backend API

```bash
# Check health endpoint
curl https://api.yourdomain.com/api/products

# Check authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.yourdomain.com/api/users/profile
```

### Monitor Logs

```bash
# PM2 logs
pm2 logs ecommerce-api

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u nginx -f
```

### Performance Monitoring

```bash
# Check PM2 status
pm2 status

# Check resource usage
pm2 monit

# Check server resources
free -h
df -h
top
```

---

## 🔒 Security Checklist

- [ ] Change all default credentials in `.env`
- [ ] Use strong `SECRET_KEY` (at least 32 random characters)
- [ ] Enable HTTPS/SSL with valid certificates
- [ ] Configure CORS properly (only allow your domains)
- [ ] Hide sensitive errors in production (set `NODE_ENV=production`)
- [ ] Implement rate limiting on API endpoints
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB authentication
- [ ] Backup database regularly
- [ ] Monitor logs for suspicious activity
- [ ] Keep dependencies updated

---

## 📊 Scaling Considerations

### Load Balancing
```bash
# Use multiple PM2 instances
pm2 start src/server.js -i max --name "ecommerce-api"
```

### Database Optimization
- Use MongoDB indexes on frequently queried fields
- Implement caching layer (Redis)
- Archive old data regularly

### Frontend Optimization
- Use CDN for static assets
- Enable Gzip compression in Nginx
- Minify and bundle assets

---

## 🆘 Troubleshooting

### Port Already in Use
```bash
# Find process on port 5454
lsof -i :5454
# Kill process
kill -9 <PID>
```

### Database Connection Fails
```bash
# Test MongoDB connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/ecommerce"
# Check firewall/IP whitelist
```

### Nginx Not Serving Frontend
```bash
# Check file permissions
ls -la /var/www/ecommerce-mern/frontend/build/
chmod -R 755 /var/www/ecommerce-mern/frontend/build/
```

### PM2 Not Starting
```bash
# Clear PM2 cache
pm2 kill
pm2 start src/server.js --name "ecommerce-api"
```

---

## 📈 Monitoring & Maintenance

### Daily Tasks
- Monitor PM2 logs for errors
- Check Nginx error logs
- Verify API response times

### Weekly Tasks
- Review security logs
- Check disk space usage
- Test backup processes

### Monthly Tasks
- Update dependencies: `npm update`
- Review and optimize database queries
- Audit access logs
- Performance analysis

---

## 🚀 Deployment on Popular Platforms

### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add environment variables
heroku config:set MONGODB_URI=your_mongodb_uri

# Deploy
git push heroku main
```

### AWS EC2
- Use this guide for VPS setup (same as above)
- Use RDS for MongoDB or Atlas

### DigitalOcean
- Similar to VPS setup
- Use DigitalOcean App Platform for easier deployment

### Render
```bash
# Connect GitHub repository
# Set environment variables in Render dashboard
# Auto-deploy on push
```

---

## 📝 Quick Reference

| Task | Command |
|------|---------|
| Start Backend | `pm2 start src/server.js` |
| Stop Backend | `pm2 stop ecommerce-api` |
| Restart Backend | `pm2 restart ecommerce-api` |
| View Logs | `pm2 logs ecommerce-api` |
| Build Frontend | `npm run build` |
| Deploy Frontend | Copy `/build` to `/var/www/frontend` |
| Check Nginx | `sudo nginx -t` |
| Restart Nginx | `sudo systemctl restart nginx` |
| SSL Renewal | `sudo certbot renew` |
| Seed Database | `node seed.js` |

---

## 📞 Support & Resources

- **MongoDB Documentation**: https://docs.mongodb.com
- **Express.js Guide**: https://expressjs.com
- **React Documentation**: https://react.dev
- **Nginx Documentation**: https://nginx.org/en/docs
- **PM2 Documentation**: https://pm2.keymetrics.io
- **Razorpay API**: https://razorpay.com/developers

---

**Last Updated**: May 5, 2026
**Status**: Production Ready ✅
