# FASHN E-Commerce - Quick Reference Guide

## 🚀 Essential Commands Cheat Sheet

### Initial Setup

```bash
# Clone repository
git clone https://github.com/yourusername/ecommerce-mern.git
cd ecommerce-mern

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev  # Development

# Frontend setup
cd ../frontend
npm install
npm start    # Development

# Production build
npm run build
```

---

## 🔧 Development Commands

### Backend (Node.js)

```bash
# Development server with hot reload
npm run dev

# Production server
npm start

# Install new package
npm install package-name

# Remove package
npm uninstall package-name

# Update dependencies
npm update

# Check for security issues
npm audit
npm audit fix
```

### Frontend (React)

```bash
# Development server on localhost:3000
npm start

# Production build
npm run build

# Run tests
npm test

# Check build size
npm run build -- --analyze

# Preview production build locally
npm install -g serve
serve -s build
```

---

## 🐳 Docker Commands

### Build & Run

```bash
# Build all images
docker-compose build

# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View running services
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs backend
docker-compose logs frontend
```

### Database

```bash
# Access MongoDB in Docker
docker-compose exec mongodb mongosh -u admin -p password

# Backup database
docker-compose exec -T mongodb mongodump \
  -u admin -p password \
  --authenticationDatabase admin \
  --out /backup

# Restore database
docker-compose exec mongodb mongorestore \
  -u admin -p password \
  --authenticationDatabase admin \
  /backup
```

### Debugging

```bash
# Execute command in container
docker-compose exec backend npm list

# Access container shell
docker-compose exec backend sh

# View resource usage
docker stats

# Remove unused images/containers
docker system prune -a
```

---

## 🖥️ VPS/Server Commands

### System Management

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Check system resources
top
free -h
df -h
du -sh /var/lib/docker/

# Check running processes
ps aux | grep node
ps aux | grep nginx
```

### PM2 (Process Manager)

```bash
# Start process
pm2 start src/server.js --name "ecommerce-api"

# Stop process
pm2 stop ecommerce-api

# Restart process
pm2 restart ecommerce-api

# View all processes
pm2 status
pm2 list

# View logs
pm2 logs ecommerce-api
pm2 logs ecommerce-api --lines 100

# Monitor in real-time
pm2 monit

# Delete process
pm2 delete ecommerce-api

# Save configuration
pm2 save

# Startup on reboot
pm2 startup
pm2 startup systemd -u root --hp /root
```

### Nginx

```bash
# Check syntax
sudo nginx -t

# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl reload nginx

# View status
sudo systemctl status nginx

# Enable on boot
sudo systemctl enable nginx

# View logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
sudo journalctl -u nginx -f
```

### SSL/TLS (Let's Encrypt)

```bash
# Generate certificate
sudo certbot certonly --standalone \
  -d yourdomain.com \
  -d www.yourdomain.com \
  -d api.yourdomain.com

# Renew certificate
sudo certbot renew

# Auto-renewal test
sudo certbot renew --dry-run

# View certificates
ls -la /etc/letsencrypt/live/yourdomain.com/

# Check certificate expiry
openssl x509 -enddate -noout \
  -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem
```

---

## 🗄️ Database Commands

### MongoDB Connection

```bash
# Local MongoDB
mongosh mongodb://localhost:27017/ecommerce

# MongoDB Atlas (Cloud)
mongosh "mongodb+srv://user:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority"

# Show all databases
show databases
show dbs

# Select database
use ecommerce

# Show collections
show collections

# Count documents
db.products.countDocuments()
db.users.countDocuments()
db.orders.countDocuments()

# View sample document
db.products.findOne()

# Find documents
db.users.find({ email: "user@example.com" })

# Delete document
db.users.deleteOne({ _id: ObjectId("...") })

# Update document
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { firstName: "NewName" } }
)
```

---

## 🔍 Testing & Verification

### API Testing with curl

```bash
# Test basic endpoint
curl https://api.yourdomain.com/api/products

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" \
  https://api.yourdomain.com/api/users/profile

# POST request
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass"}'

# Check SSL
curl -I https://yourdomain.com

# Verbose output
curl -v https://yourdomain.com

# Check response time
curl -w "@curl-format.txt" -o /dev/null -s https://yourdomain.com

# Test CORS
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS https://api.yourdomain.com/api/products \
  -v
```

### DNS Testing

```bash
# Check DNS resolution
dig yourdomain.com
nslookup yourdomain.com
host yourdomain.com

# Check MX records
dig yourdomain.com MX
nslookup -query=MX yourdomain.com

# Trace DNS
dig yourdomain.com +trace
```

---

## 📊 Monitoring & Logs

### View Logs

```bash
# Backend logs (PM2)
pm2 logs ecommerce-api
pm2 logs ecommerce-api --lines 1000

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System logs
journalctl -u ecommerce-api -f
journalctl -u nginx -f

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker logs container-name
```

### Monitor Resources

```bash
# Real-time process monitoring
pm2 monit

# System resource usage
top
htop

# Memory usage
free -h
free -m

# Disk usage
df -h
du -sh /var/www/ecommerce-mern/

# Network connections
netstat -tlnp | grep LISTEN
ss -tlnp | grep LISTEN

# Check listening ports
lsof -i -P -n | grep LISTEN
```

---

## 🚨 Troubleshooting Commands

### Port Issues

```bash
# Find process using port
lsof -i :5454
lsof -i :80
lsof -i :443
lsof -i :27017

# Kill process
kill -9 <PID>

# Change port in nginx config
sudo nano /etc/nginx/sites-available/ecommerce
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R www-data:www-data /var/www/ecommerce-mern/
sudo chown -R $USER:$USER /var/www/ecommerce-mern/

# Fix permissions
chmod -R 755 /var/www/ecommerce-mern/
chmod -R 644 /var/www/ecommerce-mern/frontend/build/*

# Check current permissions
ls -la /var/www/ecommerce-mern/
```

### Network Issues

```bash
# Test connection to MongoDB
nc -zv cluster.mongodb.net 27017
telnet cluster.mongodb.net 27017

# Test DNS
nslookup mongodb.net
dig mongodb.net

# Check firewall
sudo ufw status
sudo ufw allow 5454
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Restart Everything

```bash
# Restart all services
pm2 restart all
sudo systemctl restart nginx
sudo systemctl restart docker

# Or restart server
sudo reboot
```

---

## 🔒 Security Commands

### Check SSL Certificate

```bash
# View certificate details
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem -text -noout

# Check expiry date
openssl x509 -enddate -noout \
  -in /etc/letsencrypt/live/yourdomain.com/fullchain.pem

# Test SSL
openssl s_client -connect yourdomain.com:443 -showcerts

# Check certificate chain
openssl s_client -connect yourdomain.com:443 -showcerts < /dev/null
```

### Security Audits

```bash
# Node.js security audit
npm audit

# Check environment variables
echo $MONGODB_URI
echo $SECRET_KEY

# Check git history for secrets
git log -p | grep -i password
git log -p | grep -i secret

# Check for exposed secrets
git secrets --scan

# Docker image security scan
docker scan ecommerce-backend
```

---

## 📈 Performance Optimization

### Check Build Size

```bash
# Frontend build size
ls -lah frontend/build/
du -sh frontend/build/static/

# Analyze bundle
npm install -g webpack-bundle-analyzer
webpack-bundle-analyzer build/static/js/*.js
```

### Clear Cache

```bash
# npm cache
npm cache clean --force

# Docker cache
docker system prune -a

# Browser cache
# Dev Tools > Application > Clear site data

# CDN cache
# Depends on provider, usually dashboard
```

---

## 🔄 Deployment & Updates

### Deploy Changes

```bash
# Pull latest code
cd /var/www/ecommerce-mern
git pull origin main

# Backend update
cd backend
npm install
pm2 restart ecommerce-api

# Frontend update
cd ../frontend
npm install
npm run build
sudo chown -R www-data:www-data build/
sudo systemctl reload nginx
```

### Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Restart services
pm2 restart ecommerce-api
sudo systemctl reload nginx
```

---

## 📝 Common Workflows

### Complete Deployment Flow

```bash
# 1. Clone repo
git clone https://github.com/user/ecommerce-mern.git
cd ecommerce-mern

# 2. Setup backend
cd backend
npm install
cp .env.example .env
# Edit .env
pm2 start src/server.js --name "ecommerce-api"

# 3. Setup frontend
cd ../frontend
npm install
npm run build

# 4. Configure Nginx
sudo cp nginx.conf /etc/nginx/sites-available/ecommerce
sudo ln -s /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 5. Setup SSL
sudo certbot certonly --standalone -d yourdomain.com

# 6. Verify
curl https://api.yourdomain.com/api/products
curl https://yourdomain.com
```

### Daily Maintenance

```bash
# Check status
pm2 status
docker-compose ps

# Review logs
pm2 logs ecommerce-api | tail -50
tail -f /var/log/nginx/error.log

# Check disk space
df -h

# Check backups
ls -lah backups/
```

### Monthly Updates

```bash
# Update dependencies
cd backend && npm update && npm audit fix
cd ../frontend && npm update && npm audit fix

# Rebuild frontend
npm run build

# Restart services
pm2 restart ecommerce-api
sudo systemctl reload nginx

# Run tests
npm test

# Check logs for errors
pm2 logs ecommerce-api --lines 1000
```

---

## 🎯 Quick Links

- **MongoDB Atlas**: https://www.mongodb.com/cloud/atlas
- **Razorpay Dashboard**: https://dashboard.razorpay.com
- **Let's Encrypt**: https://letsencrypt.org
- **PM2 Dashboard**: https://pm2.io
- **Docker Hub**: https://hub.docker.com
- **GitHub**: https://github.com

---

## 📞 Emergency Procedures

### Website Down

```bash
# 1. Check services
pm2 status
sudo systemctl status nginx
docker-compose ps

# 2. View logs
pm2 logs ecommerce-api --lines 100
tail -f /var/log/nginx/error.log
docker-compose logs backend

# 3. Restart if needed
pm2 restart ecommerce-api
sudo systemctl restart nginx

# 4. If still down
sudo reboot
```

### Database Issues

```bash
# 1. Check connection
mongosh "mongodb://..."

# 2. Check MongoDB Atlas
# Login to MongoDB Atlas dashboard
# Check Metrics section

# 3. Backup and restore
mongodump -u admin -p password --out /backup
mongorestore -u admin -p password /backup
```

---

## 💡 Tips & Tricks

```bash
# Create alias for quick commands
alias pmstart="pm2 start src/server.js --name 'ecommerce-api'"
alias pmlog="pm2 logs ecommerce-api -f"
alias pmrestart="pm2 restart ecommerce-api"

# Add to ~/.bashrc or ~/.zshrc and reload:
source ~/.bashrc
# or
source ~/.zshrc

# Quick navigation
cd /var/www/ecommerce-mern
# or add to ~/.bashrc
alias goapp="cd /var/www/ecommerce-mern"
```

---

**Last Updated**: May 5, 2026  
**Quick Reference v1.0**
