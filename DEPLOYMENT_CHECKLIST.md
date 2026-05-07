# 🚀 FASHN E-Commerce Deployment Checklist

## Phase 1: Pre-Deployment Planning

### Domain & Hosting Setup
- [ ] Register domain name (e.g., yourdomain.com)
- [ ] Register API subdomain (e.g., api.yourdomain.com)
- [ ] Choose hosting provider (VPS, Docker, PaaS)
- [ ] Purchase/provision server (if VPS)
- [ ] Note server IP address and login credentials
- [ ] Test SSH access to server

### Database Setup
- [ ] Sign up for MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
- [ ] Create MongoDB cluster
- [ ] Create database user (not root)
- [ ] Whitelist server IP in MongoDB Atlas
- [ ] Copy MongoDB connection string
- [ ] Test MongoDB connection locally

### Payment Gateway Setup
- [ ] Sign up for Razorpay (https://razorpay.com)
- [ ] Verify business account
- [ ] Get API Key ID (production)
- [ ] Get API Key Secret (production)
- [ ] Enable Payment Links in Razorpay dashboard
- [ ] Configure webhook (optional, for advanced features)
- [ ] Test payment gateway in test mode first

### Code Preparation
- [ ] Clone repository to local machine
- [ ] Review .env.example file
- [ ] Identify all environment variables needed
- [ ] Generate secure SECRET_KEY
  ```bash
  openssl rand -hex 32
  ```
- [ ] Update .env.example if needed
- [ ] Commit code to Git repository

---

## Phase 2: Environment Configuration

### Backend Configuration
- [ ] Create `.env` file in `/backend` directory
- [ ] Set `MONGODB_URI` with production credentials
- [ ] Set `SECRET_KEY` to generated secure value
- [ ] Set `RAZORPAY_KEY_ID` from Razorpay dashboard
- [ ] Set `RAZORPAY_KEY_SECRET` from Razorpay dashboard
- [ ] Set `PAYMENT_CALLBACK_URL` to frontend domain
- [ ] Set `PORT=5454`
- [ ] Set `NODE_ENV=production`
- [ ] Set `ALLOWED_ORIGINS` to your domain(s)
- [ ] Verify no sensitive data in git history
  ```bash
  git log --all -- .env
  ```

### Frontend Configuration
- [ ] Create `.env.production` in `/frontend` directory
- [ ] Set `REACT_APP_API_BASE_URL` to API domain
  ```
  REACT_APP_API_BASE_URL=https://api.yourdomain.com
  ```
- [ ] Update `frontend/src/config/api.js` if needed
- [ ] Verify no hardcoded localhost URLs
  ```bash
  grep -r "localhost" src/
  grep -r "3000" src/
  ```

---

## Phase 3: Choose Deployment Method

### Option A: VPS Deployment (Linux)

#### Server Setup
- [ ] SSH into server
- [ ] Update system packages
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```
- [ ] Install Node.js
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
  ```
- [ ] Install PM2 globally
  ```bash
  sudo npm install -g pm2
  ```
- [ ] Install Nginx
  ```bash
  sudo apt install -y nginx
  ```
- [ ] Install Certbot for SSL
  ```bash
  sudo apt install -y certbot python3-certbot-nginx
  ```
- [ ] Verify all installations
  ```bash
  node --version
  npm --version
  pm2 --version
  ```

#### Repository Setup
- [ ] Clone repository
  ```bash
  cd /var/www
  git clone https://github.com/yourusername/ecommerce-mern.git
  ```
- [ ] Set proper permissions
  ```bash
  sudo chown -R $USER:$USER /var/www/ecommerce-mern
  ```

#### Backend Deployment
- [ ] Navigate to backend
  ```bash
  cd /var/www/ecommerce-mern/backend
  ```
- [ ] Copy .env.example to .env
  ```bash
  cp .env.example .env
  ```
- [ ] Edit .env with production values
  ```bash
  nano .env
  ```
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Test backend manually
  ```bash
  npm run dev
  # Test with: curl http://localhost:5454/api/products
  # Stop with: Ctrl+C
  ```
- [ ] Start with PM2
  ```bash
  pm2 start src/server.js --name "ecommerce-api"
  ```
- [ ] Save PM2 configuration
  ```bash
  pm2 save
  pm2 startup systemd -u $USER --hp $HOME
  ```
- [ ] Verify process is running
  ```bash
  pm2 status
  pm2 logs ecommerce-api
  ```

#### Frontend Deployment
- [ ] Navigate to frontend
  ```bash
  cd /var/www/ecommerce-mern/frontend
  ```
- [ ] Create .env.production
  ```bash
  echo "REACT_APP_API_BASE_URL=https://api.yourdomain.com" > .env.production
  ```
- [ ] Install dependencies
  ```bash
  npm install
  ```
- [ ] Build production bundle
  ```bash
  npm run build
  ```
- [ ] Verify build succeeded
  ```bash
  ls -la build/
  ```
- [ ] Set permissions
  ```bash
  sudo chown -R www-data:www-data build/
  ```

#### Nginx Configuration
- [ ] Create Nginx config file
  ```bash
  sudo nano /etc/nginx/sites-available/ecommerce
  ```
- [ ] Copy and paste configuration from DEPLOYMENT.md
- [ ] Enable site
  ```bash
  sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
  ```
- [ ] Test configuration
  ```bash
  sudo nginx -t
  ```
- [ ] Restart Nginx
  ```bash
  sudo systemctl restart nginx
  ```
- [ ] Enable Nginx on boot
  ```bash
  sudo systemctl enable nginx
  ```

#### SSL/TLS Setup
- [ ] Request SSL certificate
  ```bash
  sudo certbot certonly --standalone \
    -d yourdomain.com \
    -d www.yourdomain.com \
    -d api.yourdomain.com \
    --agree-tos \
    -m admin@yourdomain.com
  ```
- [ ] Verify certificate files
  ```bash
  ls -la /etc/letsencrypt/live/yourdomain.com/
  ```
- [ ] Configure auto-renewal
  ```bash
  sudo systemctl enable certbot.timer
  ```
- [ ] Test renewal
  ```bash
  sudo certbot renew --dry-run
  ```

#### DNS Configuration
- [ ] Point yourdomain.com to server IP
- [ ] Point api.yourdomain.com to server IP
- [ ] Point www.yourdomain.com to server IP
- [ ] Wait for DNS propagation (can take 24-48 hours)
  ```bash
  dig yourdomain.com
  nslookup yourdomain.com
  ```

### Option B: Docker Deployment

#### Docker Installation
- [ ] Install Docker
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  ```
- [ ] Install Docker Compose
  ```bash
  sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
  ```
- [ ] Add user to docker group
  ```bash
  sudo usermod -aG docker $USER
  newgrp docker
  ```
- [ ] Verify installation
  ```bash
  docker --version
  docker-compose --version
  ```

#### Repository Setup
- [ ] Clone repository
  ```bash
  git clone https://github.com/yourusername/ecommerce-mern.git
  cd ecommerce-mern
  ```

#### Environment Configuration
- [ ] Copy Docker environment file
  ```bash
  cp .env.docker .env
  ```
- [ ] Edit .env with your values
  ```bash
  nano .env
  ```
- [ ] Update all required variables:
  - MONGODB_PASSWORD
  - SECRET_KEY
  - RAZORPAY_KEY_ID
  - RAZORPAY_KEY_SECRET
  - DOMAIN
  - API_DOMAIN

#### Build and Deploy
- [ ] Build all images
  ```bash
  docker-compose build
  ```
- [ ] Start all services
  ```bash
  docker-compose up -d
  ```
- [ ] Verify services are running
  ```bash
  docker-compose ps
  ```
- [ ] Check logs
  ```bash
  docker-compose logs -f backend
  docker-compose logs -f frontend
  docker-compose logs -f mongodb
  ```
- [ ] Test API
  ```bash
  curl http://localhost:5454/api/products
  ```

#### SSL/TLS (Docker)
- [ ] Install Certbot outside Docker
  ```bash
  sudo apt install -y certbot
  ```
- [ ] Request certificates
  ```bash
  sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com
  ```
- [ ] Update Nginx config with SSL paths
- [ ] Reload Nginx in Docker
  ```bash
  docker-compose exec nginx nginx -s reload
  ```

---

## Phase 4: Database Setup

### Seed Initial Data
- [ ] Connect to MongoDB
  ```bash
  mongosh "mongodb+srv://user:pass@cluster.mongodb.net/ecommerce"
  ```
- [ ] Verify collections created
  ```
  show collections
  ```
- [ ] (Optional) Run seed script
  ```bash
  cd /var/www/ecommerce-mern
  node seed.js
  ```
- [ ] Verify data exists
  ```bash
  db.products.countDocuments()
  ```

### Backup Configuration
- [ ] Setup automated backups
  - MongoDB Atlas: Enable backup in dashboard
  - Local MongoDB: Configure mongodump script
- [ ] Test restore procedure
- [ ] Document backup location and retention

---

## Phase 5: Testing & Verification

### API Testing
- [ ] Test homepage load
  ```bash
  curl https://yourdomain.com
  ```
- [ ] Test API health check
  ```bash
  curl https://api.yourdomain.com/api/products
  ```
- [ ] Test with Postman
  - Import `Ecommerce Api.postman_collection.json`
  - Update base URL to production API
  - Run collection tests

### Frontend Testing
- [ ] Load frontend in browser
  ```
  https://yourdomain.com
  ```
- [ ] Check browser console for errors
- [ ] Test navigation between pages
- [ ] Test product browsing
- [ ] Test search functionality
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Test user authentication

### Payment Gateway Testing
- [ ] Use Razorpay test credentials first
- [ ] Test payment creation
- [ ] Test payment verification
- [ ] Verify payment callback
- [ ] Switch to production credentials
- [ ] Test one live payment
- [ ] Verify order creation after payment

### Performance Testing
- [ ] Test page load times
  ```bash
  curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com
  ```
- [ ] Check Google PageSpeed Insights
- [ ] Test on mobile devices
- [ ] Check responsiveness

### Security Testing
- [ ] Test HTTPS redirect
- [ ] Check SSL certificate validity
  ```bash
  openssl s_client -connect api.yourdomain.com:443 -showcerts
  ```
- [ ] Test CORS headers
  ```bash
  curl -i https://api.yourdomain.com/api/products
  ```
- [ ] Verify no sensitive data in responses
- [ ] Check for SQL injection vulnerabilities
- [ ] Test XSS prevention

---

## Phase 6: Monitoring & Logging

### Server Monitoring
- [ ] Setup PM2 monitoring (VPS)
  ```bash
  pm2 monit
  ```
- [ ] Monitor system resources
  ```bash
  top
  df -h
  free -h
  ```
- [ ] Setup log rotation
  ```bash
  sudo nano /etc/logrotate.d/ecommerce
  ```

### Application Logging
- [ ] Check backend logs
  ```bash
  pm2 logs ecommerce-api
  tail -f /var/log/nginx/access.log
  tail -f /var/log/nginx/error.log
  ```
- [ ] Verify error logging is enabled
- [ ] Setup log aggregation (optional)

### Monitoring Tools
- [ ] Setup Uptime Monitoring (Uptimerobot, Statuspage)
- [ ] Configure email alerts
- [ ] Setup error tracking (Sentry, Rollbar)
- [ ] Enable Google Analytics
- [ ] Configure database monitoring (MongoDB Atlas)

---

## Phase 7: Maintenance & Operations

### Regular Maintenance
- [ ] Weekly: Review logs for errors
- [ ] Weekly: Check disk space usage
- [ ] Weekly: Verify backups are running
- [ ] Monthly: Update dependencies
  ```bash
  cd backend && npm update
  cd ../frontend && npm update
  ```
- [ ] Monthly: Review security updates
- [ ] Quarterly: Performance optimization review

### Backup & Recovery
- [ ] Test backup restoration procedure monthly
- [ ] Document recovery steps
- [ ] Store backups in multiple locations
- [ ] Encrypt sensitive backups
- [ ] Verify backup integrity

### Updates & Patches
- [ ] Monitor Node.js security advisories
- [ ] Update dependencies regularly
  ```bash
  npm audit
  npm audit fix
  ```
- [ ] Test updates in development first
- [ ] Plan deployment window for updates

---

## Phase 8: Post-Deployment

### Documentation
- [ ] Document deployment process
- [ ] Document server access details (securely)
- [ ] Document environment variables used
- [ ] Document backup procedures
- [ ] Document emergency contacts

### Team Communication
- [ ] Inform team of deployment
- [ ] Share production URL and API endpoint
- [ ] Share Postman collection for API testing
- [ ] Document any custom configurations
- [ ] Share monitoring dashboard access

### Client Communication
- [ ] Provide frontend URL to client
- [ ] Share admin login credentials (securely)
- [ ] Provide user documentation
- [ ] Setup email notifications for errors
- [ ] Schedule post-launch support

---

## Troubleshooting Guide

### Port Already in Use
```bash
# Find process
lsof -i :5454
lsof -i :80
# Kill process
kill -9 <PID>
```

### Database Connection Issues
```bash
# Test connection
mongosh "mongodb+srv://user:pass@cluster.mongodb.net/ecommerce"
# Check IP whitelist in MongoDB Atlas
# Verify credentials
```

### SSL Certificate Issues
```bash
# Check certificate
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -text
# Renew certificate
sudo certbot renew --force-renewal
```

### API Response Errors
```bash
# Check backend logs
pm2 logs ecommerce-api
# Test API manually
curl https://api.yourdomain.com/api/products
# Check CORS configuration
```

### Frontend Not Loading
```bash
# Check Nginx logs
tail -f /var/log/nginx/error.log
# Verify build exists
ls -la /var/www/ecommerce-mern/frontend/build/
# Check Nginx config
sudo nginx -t
```

---

## Final Verification

- [ ] All services running smoothly
- [ ] Frontend loads without errors
- [ ] API responds correctly
- [ ] Database connected
- [ ] Payment gateway working
- [ ] SSL certificate valid
- [ ] All features tested
- [ ] Performance acceptable
- [ ] Monitoring active
- [ ] Backups configured
- [ ] Team trained on deployment
- [ ] Documentation complete

---

## Emergency Contacts

| Role | Name | Email | Phone |
|------|------|-------|-------|
| DevOps | | | |
| Backend | | | |
| Frontend | | | |
| Database | | | |

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Deployer | | | |
| QA | | | |
| Manager | | | |

---

**Deployment Date**: _______________  
**Deployment Time**: _______________  
**Status**: ☐ Successful ☐ Partial ☐ Failed  
**Notes**: _____________________________________________________________

---

**Keep this checklist for future reference and updates.**
