#!/bin/bash
# FASHN E-Commerce Platform - Production Deployment Script
# This script automates the deployment process for VPS/cPanel environments

set -e  # Exit on error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/ecommerce-mern"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
DOMAIN="yourdomain.com"
API_DOMAIN="api.yourdomain.com"
APP_NAME="ecommerce-api"
APP_PORT="5454"

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check if running as root
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "This script must be run as root. Use: sudo bash deploy.sh"
    fi
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_warning "Node.js not found. Installing..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        apt-get install -y nodejs
    else
        log_success "Node.js $(node --version) found"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm not found. Please install Node.js"
    else
        log_success "npm $(npm --version) found"
    fi
    
    # Check PM2
    if ! command -v pm2 &> /dev/null; then
        log_warning "PM2 not found. Installing..."
        npm install -g pm2
    else
        log_success "PM2 found"
    fi
    
    # Check Nginx
    if ! command -v nginx &> /dev/null; then
        log_warning "Nginx not found. Installing..."
        apt-get install -y nginx
    else
        log_success "Nginx $(nginx -v 2>&1) found"
    fi
}

# Clone/update repository
setup_repository() {
    log_info "Setting up repository..."
    
    if [ -d "$PROJECT_DIR" ]; then
        log_info "Repository exists. Pulling latest changes..."
        cd "$PROJECT_DIR"
        git pull origin main || git pull origin master
    else
        log_info "Cloning repository..."
        mkdir -p /var/www
        cd /var/www
        git clone https://github.com/yourusername/ecommerce-mern.git
    fi
    
    log_success "Repository ready at $PROJECT_DIR"
}

# Setup backend
setup_backend() {
    log_info "Setting up backend..."
    
    cd "$BACKEND_DIR"
    
    # Install dependencies
    log_info "Installing backend dependencies..."
    npm install --production
    
    # Check if .env exists
    if [ ! -f "$BACKEND_DIR/.env" ]; then
        log_warning ".env file not found. Copying from .env.example..."
        cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
        log_error "Please edit $BACKEND_DIR/.env with your production credentials"
    fi
    
    log_success "Backend setup complete"
}

# Setup frontend
setup_frontend() {
    log_info "Setting up frontend..."
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies
    log_info "Installing frontend dependencies..."
    npm install --production
    
    # Create .env.production if doesn't exist
    if [ ! -f "$FRONTEND_DIR/.env.production" ]; then
        log_warning "Creating .env.production..."
        echo "REACT_APP_API_BASE_URL=https://$API_DOMAIN" > "$FRONTEND_DIR/.env.production"
    fi
    
    # Build frontend
    log_info "Building frontend production bundle..."
    npm run build
    
    # Set permissions
    chown -R www-data:www-data "$FRONTEND_DIR/build"
    chmod -R 755 "$FRONTEND_DIR/build"
    
    log_success "Frontend build complete"
}

# Start backend with PM2
start_backend() {
    log_info "Starting backend with PM2..."
    
    # Stop existing process if running
    pm2 stop "$APP_NAME" 2>/dev/null || true
    
    # Start new process
    cd "$BACKEND_DIR"
    pm2 start src/server.js --name "$APP_NAME" --env production
    
    # Save PM2 config
    pm2 save
    
    # Setup startup script
    pm2 startup systemd -u root --hp /root
    
    log_success "Backend started with PM2"
    pm2 logs "$APP_NAME" --lines 10
}

# Configure Nginx
configure_nginx() {
    log_info "Configuring Nginx..."
    
    # Create Nginx config
    cat > /etc/nginx/sites-available/ecommerce << 'EOF'
# Backend API
upstream backend {
    server 127.0.0.1:5454;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

# Backend API Server
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        proxy_http_version 1.1;
        proxy_read_timeout 60s;
    }
}

# Frontend Application
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    root /var/www/ecommerce-mern/frontend/build;
    index index.html index.htm;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # React Router
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # API proxy
    location /api {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
}
EOF
    
    # Enable site
    ln -sf /etc/nginx/sites-available/ecommerce /etc/nginx/sites-enabled/ 2>/dev/null || true
    
    # Test configuration
    if ! nginx -t; then
        log_error "Nginx configuration is invalid"
    fi
    
    # Reload Nginx
    systemctl reload nginx
    log_success "Nginx configured and reloaded"
}

# Setup SSL with Certbot
setup_ssl() {
    log_info "Setting up SSL certificates with Let's Encrypt..."
    
    # Install Certbot if needed
    if ! command -v certbot &> /dev/null; then
        apt-get install -y certbot python3-certbot-nginx
    fi
    
    # Request certificate
    certbot certonly --standalone \
        -d "$DOMAIN" \
        -d "www.$DOMAIN" \
        -d "$API_DOMAIN" \
        --agree-tos \
        --email admin@example.com \
        -n || log_warning "SSL setup may have failed. Ensure domains point to this server."
    
    # Setup auto-renewal
    systemctl enable certbot.timer
    
    log_success "SSL certificate setup complete"
}

# Health check
health_check() {
    log_info "Running health checks..."
    
    # Check backend
    sleep 2
    if curl -s http://localhost:5454/api/products &> /dev/null; then
        log_success "Backend API is responding"
    else
        log_warning "Backend API may not be responding"
    fi
    
    # Check Nginx
    if systemctl is-active --quiet nginx; then
        log_success "Nginx is running"
    else
        log_error "Nginx is not running"
    fi
    
    # Check PM2
    if pm2 describe "$APP_NAME" &> /dev/null; then
        log_success "PM2 process is running"
    else
        log_error "PM2 process is not running"
    fi
}

# Display summary
display_summary() {
    echo ""
    echo "======================================"
    echo -e "${GREEN}Deployment Complete!${NC}"
    echo "======================================"
    echo ""
    echo "Frontend URL:     https://$DOMAIN"
    echo "Backend API:      https://$API_DOMAIN"
    echo "PM2 App Name:     $APP_NAME"
    echo "Backend Port:     $APP_PORT"
    echo ""
    echo "Useful Commands:"
    echo "  pm2 status                   - Check process status"
    echo "  pm2 logs $APP_NAME          - View logs"
    echo "  pm2 restart $APP_NAME       - Restart backend"
    echo "  nginx -t                    - Test Nginx config"
    echo "  systemctl restart nginx     - Reload Nginx"
    echo "  certbot renew               - Renew SSL certificate"
    echo ""
    echo "======================================"
}

# Main deployment flow
main() {
    log_info "Starting FASHN E-Commerce Deployment"
    log_info "========================================="
    
    check_root
    check_requirements
    setup_repository
    setup_backend
    setup_frontend
    configure_nginx
    setup_ssl
    start_backend
    health_check
    display_summary
    
    log_success "All deployment steps completed!"
}

# Run main function
main
