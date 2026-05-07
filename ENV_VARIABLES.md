# Environment Variables Configuration Guide

## 📋 Overview

This guide explains all environment variables needed for FASHN deployment.

---

## 🔑 Backend Environment Variables

### Location
Create file: `/backend/.env`

### Template with Descriptions

```bash
# ============================================
# 🗄️  DATABASE CONFIGURATION
# ============================================

# MongoDB Connection String
# Local: mongodb://127.0.0.1:27017/ecommerce
# Atlas: mongodb+srv://username:password@cluster.mongodb.net/ecommerce
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# ============================================
# 🔐 SECURITY & AUTHENTICATION
# ============================================

# JWT Secret Key for token signing
# Generate with: openssl rand -hex 32
# MUST be at least 32 characters long
SECRET_KEY=your-secret-key-min-32-characters-generated-with-openssl-rand-hex-32

# Node Environment
# development | production | staging
NODE_ENV=production

# ============================================
# 💳 PAYMENT GATEWAY (RAZORPAY)
# ============================================

# Razorpay API Key ID (Public)
# Get from: https://dashboard.razorpay.com/app/keys
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx

# Razorpay API Key Secret (Private)
# Get from: https://dashboard.razorpay.com/app/keys
# KEEP THIS SECRET - Never commit to git
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx

# Callback URL after payment
# Points to your frontend payment success page
PAYMENT_CALLBACK_URL=https://yourdomain.com/payment

# ============================================
# 🌐 SERVER CONFIGURATION
# ============================================

# Server Port
# Standard: 5454 (can be any available port)
PORT=5454

# ============================================
# 🔗 CORS (CROSS-ORIGIN RESOURCE SHARING)
# ============================================

# Comma-separated list of allowed origins
# Example: https://yourdomain.com,https://www.yourdomain.com,http://localhost:3000
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

```

---

## 🌐 Frontend Environment Variables

### Location
Create file: `/frontend/.env.production`

### Template with Descriptions

```bash
# ============================================
# 🔌 API CONFIGURATION
# ============================================

# Base URL for API requests
# Local: http://localhost:5454
# Production: https://api.yourdomain.com
# The frontend will use this to call the backend
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

---

## 🐳 Docker Environment Variables

### Location
File: `.env` (for docker-compose)

### Template with Descriptions

```bash
# ============================================
# 🗄️  MONGODB CONFIGURATION
# ============================================

# MongoDB root user
MONGODB_USER=admin

# MongoDB root password
# Change this to a secure password
MONGODB_PASSWORD=your_secure_password_here_change_this

# MongoDB connection URI
# format: mongodb://user:password@host:port/database
MONGODB_URI=mongodb://admin:your_secure_password_here@mongodb:27017/ecommerce?authSource=admin

# ============================================
# 🔐 SECURITY & AUTHENTICATION
# ============================================

# JWT Secret Key
# Generate with: openssl rand -hex 32
SECRET_KEY=your-secret-key-min-32-characters-long-change-this

# Node Environment
NODE_ENV=production

# ============================================
# 💳 PAYMENT GATEWAY (RAZORPAY)
# ============================================

# Razorpay credentials
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxx
PAYMENT_CALLBACK_URL=https://yourdomain.com/payment

# ============================================
# 🌐 DOMAIN & URL CONFIGURATION
# ============================================

# Your domain
DOMAIN=yourdomain.com

# Your API subdomain
API_DOMAIN=api.yourdomain.com

# Frontend API URL
REACT_APP_API_BASE_URL=https://api.yourdomain.com

# ============================================
# 🔗 CORS CONFIGURATION
# ============================================

# Allowed origins (comma-separated)
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# ============================================
# 🔒 SSL/TLS PATHS (FOR DOCKER)
# ============================================

# Path to SSL certificate
SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem

# Path to SSL private key
SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
```

---

## 🔐 How to Generate Secure Keys

### Generate SECRET_KEY

**Option 1: Using OpenSSL (Recommended)**
```bash
openssl rand -hex 32
# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Output: similar to above
```

**Option 3: Using Python**
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

### Generate Strong Database Password

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(24).toString('base64'))"
```

---

## 🗺️ Environment Variables by Deployment Type

### VPS/Linux Deployment

**Create `/backend/.env`:**
```bash
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ecommerce
SECRET_KEY=<generate-with-openssl>
RAZORPAY_KEY_ID=rzp_live_xxx
RAZORPAY_KEY_SECRET=xxx
PAYMENT_CALLBACK_URL=https://yourdomain.com/payment
PORT=5454
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

**Create `/frontend/.env.production`:**
```bash
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

### Docker Deployment

**Create `.env` (in root):**
- Use `.env.docker` as template
- Replace all `yourdomain.com` values
- Replace MongoDB password
- Replace SECRET_KEY

### PaaS Deployment (Heroku/Render/Railway)

Set in platform dashboard:
```
MONGODB_URI = mongodb+srv://...
SECRET_KEY = <generated>
RAZORPAY_KEY_ID = rzp_live_xxx
RAZORPAY_KEY_SECRET = xxx
PAYMENT_CALLBACK_URL = https://yourdomain.com/payment
PORT = 5454
NODE_ENV = production
ALLOWED_ORIGINS = https://yourdomain.com
REACT_APP_API_BASE_URL = https://api.yourdomain.com
```

---

## ✅ Validation Checklist

### Before Deployment

- [ ] **SECRET_KEY**
  - Length: minimum 32 characters
  - Format: hexadecimal (0-9, a-f)
  - Example: `a1b2c3d4e5f6...` (32+ chars)

- [ ] **MONGODB_URI**
  - Format: `mongodb+srv://user:password@host/database`
  - Include all special characters (URL encoded)
  - Test connection: `mongosh "your_uri_here"`

- [ ] **RAZORPAY Keys**
  - Key ID starts with: `rzp_live_` (production) or `rzp_test_` (testing)
  - Key Secret: Long alphanumeric string
  - Both must be from same environment (live/test)

- [ ] **Domain URLs**
  - Must include protocol: `https://yourdomain.com`
  - No trailing slash
  - Match actual domain routing

- [ ] **ALLOWED_ORIGINS**
  - Comma-separated list
  - Each entry with `https://`
  - Include both with/without `www.`

---

## 🚨 Common Mistakes

### ❌ Wrong Format
```bash
# ❌ BAD
SECRET_KEY=mysecret
MONGODB_URI=mongodb://localhost/ecommerce
PAYMENT_CALLBACK_URL=yourdomain.com/payment
ALLOWED_ORIGINS=yourdomain.com

# ✅ GOOD
SECRET_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ecommerce
PAYMENT_CALLBACK_URL=https://yourdomain.com/payment
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### ❌ Missing in Frontend
```bash
# ❌ If .env.production doesn't exist, frontend won't know API URL
# ✅ Always create .env.production in frontend directory

# ✅ CORRECT
frontend/
  ├── .env.production
  └── src/
```

### ❌ Hardcoded Values
```bash
# ❌ BAD - Hardcoded in code
const API_URL = "http://localhost:5454";

# ✅ GOOD - Using environment variable
const API_URL = process.env.REACT_APP_API_BASE_URL;
```

### ❌ Committed to Git
```bash
# ❌ DANGER - .env file committed to git
git add .env
git commit -m "Add env"

# ✅ SAFE - .env in .gitignore
# .gitignore should contain:
# .env
# .env.local
# .env.production

# If accidentally committed:
git rm --cached .env
git commit -m "Remove .env"
```

---

## 🔄 Updating Variables

### Change Database

```bash
# Stop application
pm2 stop ecommerce-api

# Update .env
nano backend/.env
# Change MONGODB_URI to new database

# Restart
pm2 restart ecommerce-api

# Verify
curl https://api.yourdomain.com/api/products
```

### Change API Domain

```bash
# Update frontend
nano frontend/.env.production
# Change REACT_APP_API_BASE_URL

# Rebuild frontend
npm run build

# Deploy new build
sudo cp -r build/* /var/www/html/
sudo systemctl reload nginx
```

### Rotate SECRET_KEY (Advanced)

```bash
# Generate new key
openssl rand -hex 32

# Update .env
nano backend/.env

# Restart backend
pm2 restart ecommerce-api

# Note: Existing tokens will be invalid
# Users will need to login again
```

---

## 🔗 Getting Values from External Services

### MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Login to your account
3. Go to **Databases** → Your cluster
4. Click **Connect** button
5. Select **Drivers** → **Node.js**
6. Copy connection string
7. Replace `<password>` and `<username>`
8. Add database name: `/ecommerce`

Example:
```
mongodb+srv://myuser:mypassword@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### Razorpay API Keys

1. Go to https://dashboard.razorpay.com/app/keys
2. Copy **Key ID** (Public key)
3. Copy **Key Secret** (Private key)
4. Ensure you're in **Live** mode (not Test)

Example:
```
RAZORPAY_KEY_ID=rzp_live_1a2b3c4d5e6f7g8h
RAZORPAY_KEY_SECRET=aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
```

---

## 📊 Variable Reference Table

| Variable | Required | Format | Example |
|----------|----------|--------|---------|
| `MONGODB_URI` | Yes | mongodb+srv://... | mongodb+srv://user:pass@cluster.mongodb.net/ecommerce |
| `SECRET_KEY` | Yes | Hex (32+ chars) | a1b2c3d4e5f6... (32 chars min) |
| `NODE_ENV` | Yes | production | production |
| `RAZORPAY_KEY_ID` | Yes | Text | rzp_live_xxxxxxxxxx |
| `RAZORPAY_KEY_SECRET` | Yes | Text | xxxxxxxxxxxxxxxxxx |
| `PAYMENT_CALLBACK_URL` | Yes | HTTPS URL | https://yourdomain.com/payment |
| `PORT` | Yes | Number | 5454 |
| `ALLOWED_ORIGINS` | Yes | URL List | https://yourdomain.com |
| `REACT_APP_API_BASE_URL` | Yes | HTTPS URL | https://api.yourdomain.com |

---

## 🆘 Troubleshooting

### "MONGODB_URI is not set"
```bash
# Check if .env exists in backend
ls -la backend/.env

# Check content
cat backend/.env | grep MONGODB

# If empty or missing:
cp backend/.env.example backend/.env
nano backend/.env
```

### "Invalid JWT secret"
```bash
# Verify SECRET_KEY is set
cat backend/.env | grep SECRET_KEY

# Regenerate if needed
openssl rand -hex 32

# Update .env and restart
pm2 restart ecommerce-api
```

### "API requests return 401 Unauthorized"
```bash
# Check RAZORPAY keys
cat backend/.env | grep RAZORPAY

# Verify in Razorpay dashboard:
# - Keys are for production (rzp_live_)
# - Account is verified
# - Keys are not rotated recently
```

### "Frontend can't reach API"
```bash
# Check frontend config
cat frontend/.env.production | grep REACT_APP_API

# Verify backend is running
pm2 status

# Test API directly
curl https://api.yourdomain.com/api/products
```

---

## 🔐 Security Best Practices

1. **Never commit .env files**
   ```bash
   # Add to .gitignore
   .env
   .env.local
   .env.production
   .env.docker
   ```

2. **Rotate SECRET_KEY periodically**
   ```bash
   # Generate new key every 3-6 months
   openssl rand -hex 32
   ```

3. **Use strong database passwords**
   ```bash
   # Minimum 20 characters, mix of:
   # - Uppercase (A-Z)
   # - Lowercase (a-z)
   # - Numbers (0-9)
   # - Special chars (!@#$%^&*)
   ```

4. **Store in secure location**
   - Use password manager (1Password, Bitwarden)
   - Store encrypted backup
   - Document in secure wiki
   - Never send in plain text

5. **Audit environment variables**
   ```bash
   # Check what's set
   env | grep -i mongo
   env | grep -i razorpay
   env | grep -i secret
   ```

---

**Last Updated**: May 5, 2026  
**Version**: 1.0
