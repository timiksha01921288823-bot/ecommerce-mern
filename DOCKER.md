# FASHN E-Commerce - Docker Deployment Guide

## Quick Start with Docker

### Prerequisites
- Docker (version 20.10+)
- Docker Compose (version 1.29+)

### Installation

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

## Project Structure

```
ecommerce-mern/
├── docker-compose.yml       # Main orchestration file
├── .env.docker              # Environment variables
├── backend/
│   └── Dockerfile           # Backend container image
├── frontend/
│   └── Dockerfile           # Frontend container image
└── nginx.conf               # Reverse proxy configuration
```

## Configuration

### 1. Copy Environment File

```bash
cp .env.docker .env
```

### 2. Update `.env` with Your Values

```bash
# Update MongoDB credentials
MONGODB_PASSWORD=your_secure_password

# Update JWT Secret
SECRET_KEY=your-secret-key-min-32-characters

# Update Razorpay credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Update domain
DOMAIN=yourdomain.com
API_DOMAIN=api.yourdomain.com
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

## Building and Running

### Option 1: Start All Services (Recommended)

```bash
# Build all images
docker-compose build

# Start all containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all containers
docker-compose down
```

### Option 2: Build Individually

```bash
# Build backend
docker build -t ecommerce-backend ./backend

# Build frontend
docker build -t ecommerce-frontend ./frontend
```

## Useful Commands

### Container Management

```bash
# List running containers
docker-compose ps

# View container logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb

# Execute command in container
docker-compose exec backend npm run dev
docker-compose exec mongodb mongosh -u admin -p password

# Restart service
docker-compose restart backend

# Stop specific service
docker-compose stop backend

# Remove containers (keeps volumes)
docker-compose down

# Remove everything including volumes
docker-compose down -v
```

### Debugging

```bash
# Check container status
docker-compose ps

# View resource usage
docker stats

# Access container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Check network
docker-compose exec backend ping frontend
```

## Services Exposed

| Service | Port | URL |
|---------|------|-----|
| Frontend | 80, 443 | http://localhost, https://yourdomain.com |
| Backend API | 5454 | http://localhost:5454 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Nginx | 80, 443 | Reverse proxy |

## Database Management

### Connect to MongoDB

```bash
# Using docker-compose
docker-compose exec mongodb mongosh -u admin -p your_password

# Using MongoDB client
mongosh "mongodb://admin:your_password@localhost:27017/ecommerce?authSource=admin"
```

### Backup Database

```bash
# Create backup
docker-compose exec mongodb mongodump \
  -u admin \
  -p your_password \
  --authenticationDatabase admin \
  --out /backup

# Copy backup to host
docker cp ecommerce-mongodb:/backup ./backup
```

### Restore Database

```bash
# Copy backup to container
docker cp ./backup ecommerce-mongodb:/

# Restore
docker-compose exec mongodb mongorestore \
  -u admin \
  -p your_password \
  --authenticationDatabase admin \
  /backup
```

## Persistence

### Data Volumes

The `docker-compose.yml` defines named volumes:
- `mongodb_data` - Database files
- `mongodb_config` - Database configuration

These persist data even when containers are stopped.

View volumes:
```bash
docker volume ls
docker volume inspect ecommerce-mern_mongodb_data
```

## Health Checks

Each service has a health check configured:

```bash
# View health status
docker-compose ps

# NAME                COMMAND             STATUS              PORTS
# ecommerce-backend   npm start           Up 2 minutes (healthy)
# ecommerce-frontend  serve build         Up 2 minutes (healthy)
# ecommerce-mongodb   mongod --bind_ip    Up 2 minutes (healthy)
```

## Production Deployment

### Scaling Services

```bash
# Scale backend to 3 instances (requires load balancer)
docker-compose up -d --scale backend=3
```

### Using External MongoDB

Edit `docker-compose.yml`:
```yaml
backend:
  environment:
    MONGODB_URI: mongodb+srv://user:pass@cluster.mongodb.net/ecommerce
```

Then remove the MongoDB service:
```bash
docker-compose down -v mongodb
docker-compose up -d
```

### SSL/TLS Setup

1. Obtain certificates from Let's Encrypt:
```bash
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com
```

2. Copy certificates to project:
```bash
mkdir -p ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/
sudo chown $USER:$USER ssl/*
```

3. Update `docker-compose.yml` volumes for Nginx

## Performance Optimization

### Resource Limits

Edit `docker-compose.yml` to add resource constraints:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

### Memory Management

```bash
# View memory usage
docker stats

# Increase Docker memory limit
# Edit /etc/docker/daemon.json
{
  "memory": "4g"
}

sudo systemctl restart docker
```

## Monitoring

### Using Portainer (Web UI)

```bash
docker run -d -p 8000:8000 -p 9000:9000 \
  --name=portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce
```

Access at: http://localhost:9000

### Container Logs

```bash
# Real-time logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Logs from specific date
docker-compose logs --since 2024-05-01 backend
```

## Troubleshooting

### Backend won't connect to MongoDB

```bash
# Test MongoDB connection from backend
docker-compose exec backend telnet mongodb 27017

# Check MongoDB logs
docker-compose logs mongodb

# Verify environment variables
docker-compose exec backend env | grep MONGODB
```

### Frontend API requests fail

```bash
# Verify backend is running
docker-compose exec frontend curl http://backend:5454/api/products

# Check environment variables
docker-compose exec frontend env | grep REACT_APP
```

### Port already in use

```bash
# Find process using port
lsof -i :80
lsof -i :5454

# Use different port in docker-compose.yml
ports:
  - "8000:3000"  # 8000 on host, 3000 in container
```

### Out of disk space

```bash
# Check disk usage
du -sh /var/lib/docker/

# Clean up unused images/containers
docker system prune -a

# Remove unused volumes
docker volume prune
```

## Upgrading Services

```bash
# Pull latest code
git pull origin main

# Rebuild images
docker-compose build --no-cache

# Restart services
docker-compose up -d

# Check health
docker-compose ps
```

## Backup Strategy

### Automated Backup Script

Create `backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/backups/ecommerce"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup MongoDB
docker-compose exec -T mongodb mongodump \
  -u admin -p ${MONGODB_PASSWORD} \
  --authenticationDatabase admin \
  --out /backup_${DATE}

# Copy to host
docker cp ecommerce-mongodb:/backup_${DATE} ${BACKUP_DIR}/

# Keep only last 7 days
find ${BACKUP_DIR} -type d -mtime +7 -exec rm -rf {} \;

echo "Backup completed: ${BACKUP_DIR}/backup_${DATE}"
```

Run daily with cron:
```bash
0 2 * * * /path/to/backup.sh
```

## CI/CD Integration

### GitHub Actions with Docker

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push images
        run: |
          docker-compose build
          docker tag ecommerce-backend myregistry/ecommerce-backend:latest
          docker push myregistry/ecommerce-backend:latest
      
      - name: Deploy
        run: |
          ssh user@server 'cd /var/www/ecommerce-mern && git pull && docker-compose up -d'
```

## Security Best Practices

- [ ] Never commit `.env` file to Git
- [ ] Use strong passwords for MongoDB
- [ ] Use secrets management (Docker Secrets, HashiCorp Vault)
- [ ] Run containers as non-root user
- [ ] Use read-only filesystems where possible
- [ ] Regular security updates
- [ ] Network isolation with custom networks
- [ ] Scan images for vulnerabilities

```bash
# Scan image for vulnerabilities
docker scan ecommerce-backend
```

## Next Steps

1. Configure domain DNS
2. Setup SSL certificates
3. Deploy to your server
4. Monitor logs and health
5. Setup backups
6. Configure monitoring alerts

## Support

- Docker Docs: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- MongoDB Docker: https://hub.docker.com/_/mongo
- Node.js Docker: https://hub.docker.com/_/node
