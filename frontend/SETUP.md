# Frontend Setup Instructions

## Quick Start (Development)

```bash
cd frontend
npm install
npm start
```

Frontend will run on `http://localhost:3000` and proxy API calls to backend.

## Production Build

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.production` file in the frontend root:

```
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

Or update the existing `.env` with:
```
REACT_APP_API_BASE_URL=https://yourdomain.com
```

### 3. Build for Production

```bash
npm run build
```

This creates an optimized production build in the `/build` directory.

### 4. Deploy Build Files

#### Option A: Using Nginx (Recommended)
```bash
# Copy build files to web root
sudo cp -r build/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html/
```

#### Option B: Using PM2 + Serve
```bash
# Install serve globally
npm install -g serve

# Start serving build
pm2 start "serve -s build -l 3000" --name "ecommerce-frontend"
```

#### Option C: Using Docker
```bash
# Create Dockerfile (see example below)
docker build -t ecommerce-frontend .
docker run -p 80:3000 ecommerce-frontend
```

## Dockerfile Example

```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

## Nginx Configuration

Configure Nginx to serve the React app and proxy API requests:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Root directory
    root /var/www/ecommerce/frontend/build;
    index index.html index.htm;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript 
               application/x-javascript application/xml+rss 
               application/javascript application/json;
    gzip_min_length 1000;

    # Cache static assets (JS, CSS, images)
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Serve index.html for all routes (React Router)
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=0";
    }

    # Proxy API requests to backend
    location /api {
        proxy_pass http://localhost:5454;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
}
```

## File Structure in Build

```
build/
├── index.html          # Main entry point
├── favicon.ico         # App icon
├── manifest.json       # PWA manifest
├── robots.txt          # SEO
├── static/
│   ├── css/           # Minified CSS files
│   ├── js/            # Minified JS bundles
│   └── media/         # Optimized images
└── images/            # Public assets
```

## Performance Optimization

### 1. Code Splitting
React automatically code-splits at route level with React Router.

### 2. Image Optimization
```bash
# Install image optimizer
npm install sharp

# Optimize images before build
find public/images -name "*.png" -o -name "*.jpg" | xargs...
```

### 3. Bundle Analysis
```bash
# Analyze bundle size
npm install --save-dev webpack-bundle-analyzer

# Then add to build script
```

### 4. Environment Variables
- Only variables prefixed with `REACT_APP_` are embedded in the build
- All API URLs should use `REACT_APP_API_BASE_URL`

## Deployment Checklist

- [ ] Update `REACT_APP_API_BASE_URL` to production API URL
- [ ] Run `npm run build` and verify output
- [ ] Test build locally: `npm run serve` or `npx serve -s build`
- [ ] Check for console errors and warnings
- [ ] Verify all images load correctly
- [ ] Test all routes and navigation
- [ ] Test authentication flow
- [ ] Test cart and checkout
- [ ] Verify payment integration
- [ ] Test on mobile devices
- [ ] Check Google PageSpeed Insights
- [ ] Setup 404 error page routing
- [ ] Configure SSL certificate
- [ ] Enable Gzip compression
- [ ] Setup CDN for static assets

## Scripts

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject",
  "serve": "serve -s build"
}
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API URL | `https://api.yourdomain.com` |

## Troubleshooting

### Routes Return 404
- Ensure Nginx is configured with `try_files $uri $uri/ /index.html;`
- This ensures React Router handles all routes

### API Requests Fail
- Check `REACT_APP_API_BASE_URL` is correct
- Verify backend is running and accessible
- Check CORS configuration on backend

### Build Size Too Large
```bash
# Analyze bundle
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### CSS/Images Not Loading
- Verify public path is correct
- Check file permissions on server
- Clear browser cache

## Development Tips

### Hot Reload Development Server
```bash
npm start
```

### Build and Test Production Build Locally
```bash
npm run build
npx serve -s build
```

### Debug Environment Variables
```javascript
// In any component
console.log(process.env.REACT_APP_API_BASE_URL);
```

## Performance Benchmarks

After optimization, target these metrics:
- Lighthouse Score: > 90
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.5s

## Monitoring in Production

### Using Google Analytics
```javascript
// Add to public/index.html
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'YOUR_ID');
</script>
```

### Error Tracking (Sentry)
```bash
npm install @sentry/react

# Initialize in src/index.js
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "YOUR_DSN" });
```

## Security Best Practices

- [ ] Never commit `.env` files
- [ ] Use `REACT_APP_` prefix only for safe variables
- [ ] Don't store API keys in React code
- [ ] Validate all user inputs
- [ ] Implement proper HTTPS/SSL
- [ ] Set secure cookies (HttpOnly, Secure flags)
- [ ] Implement CSP headers
- [ ] Regular dependency updates

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build and Deploy

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy
        run: rsync -avz build/ user@server:/var/www/frontend/
```

Last Updated: May 5, 2026
