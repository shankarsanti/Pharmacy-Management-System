# 🚀 Deployment Guide

## Deployment Options

This project can be deployed to various platforms. Here are the recommended options:

## Option 1: Render (Recommended)

### Backend Deployment on Render

1. **Create a Web Service:**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name:** pharmacy-backend
     - **Root Directory:** `backend`
     - **Environment:** Node
     - **Build Command:** `npm install`
     - **Start Command:** `npm start`
     - **Plan:** Free

2. **Environment Variables:**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5001
   DB_HOST=your_mysql_host
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_NAME=pharmacy_db
   DB_PORT=3306
   JWT_SECRET=your_strong_secret_key
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

3. **Database:**
   - Create a MySQL database on Render or use external service
   - Run schema: `mysql -h HOST -u USER -p DATABASE < config/schema.sql`
   - Run seeding: `node scripts/seedDatabase.js`

### Frontend Deployment on Vercel

1. **Deploy to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset:** Vite
     - **Root Directory:** `frontend`
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`

2. **Environment Variables:**
   Add in Vercel dashboard:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

3. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-app.vercel.app`

## Option 2: Vercel (Full Stack)

### Using vercel.json

The project includes `vercel.json` files for both frontend and backend.

**Root vercel.json:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

**Deploy:**
```bash
vercel --prod
```

## Option 3: Railway

### Backend on Railway

1. **Create New Project:**
   - Go to [Railway](https://railway.app/)
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

2. **Configure:**
   - **Root Directory:** `backend`
   - **Start Command:** `npm start`

3. **Add MySQL Database:**
   - Click "New" → "Database" → "MySQL"
   - Railway will auto-configure connection

4. **Environment Variables:**
   Railway auto-detects most variables, add:
   ```
   JWT_SECRET=your_secret
   CORS_ORIGIN=your_frontend_url
   ```

### Frontend on Railway

1. **Create Another Service:**
   - Same project, click "New" → "GitHub Repo"
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Start Command:** `npm run preview`

## Option 4: DigitalOcean App Platform

### Backend

1. **Create App:**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub
   - **Source Directory:** `backend`
   - **Build Command:** `npm install`
   - **Run Command:** `npm start`

2. **Add Database:**
   - Add MySQL database component
   - Configure connection in environment variables

### Frontend

1. **Add Component:**
   - Add static site component
   - **Source Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

## Option 5: Self-Hosted (VPS)

### Requirements
- Ubuntu 20.04+ or similar
- Node.js 16+
- MySQL 8.0+
- Nginx (for reverse proxy)
- PM2 (for process management)

### Setup Steps

1. **Install Dependencies:**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   
   # Install MySQL
   sudo apt install -y mysql-server
   
   # Install Nginx
   sudo apt install -y nginx
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Setup MySQL:**
   ```bash
   sudo mysql_secure_installation
   sudo mysql -u root -p
   CREATE DATABASE pharmacy_db;
   CREATE USER 'pharmacy_user'@'localhost' IDENTIFIED BY 'strong_password';
   GRANT ALL PRIVILEGES ON pharmacy_db.* TO 'pharmacy_user'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

3. **Clone and Setup Backend:**
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/pharmacy-management-system.git
   cd pharmacy-management-system/backend
   npm install --production
   
   # Create .env file
   cp .env.example .env
   nano .env  # Edit with your settings
   
   # Import schema
   mysql -u pharmacy_user -p pharmacy_db < config/schema.sql
   
   # Seed database
   node scripts/seedDatabase.js
   
   # Start with PM2
   pm2 start server.js --name pharmacy-backend
   pm2 save
   pm2 startup
   ```

4. **Build and Setup Frontend:**
   ```bash
   cd /var/www/pharmacy-management-system/frontend
   npm install
   
   # Update .env with production API URL
   echo "VITE_API_URL=https://yourdomain.com/api" > .env
   
   # Build
   npm run build
   
   # Copy to nginx directory
   sudo cp -r dist/* /var/www/html/
   ```

5. **Configure Nginx:**
   ```bash
   sudo nano /etc/nginx/sites-available/pharmacy
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
       # Frontend
       location / {
           root /var/www/html;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:5001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   Enable and restart:
   ```bash
   sudo ln -s /etc/nginx/sites-available/pharmacy /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

6. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d yourdomain.com
   ```

## Environment Variables Reference

### Backend
```env
# Server
NODE_ENV=production
PORT=5001

# Database
DB_HOST=your_host
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=pharmacy_db
DB_PORT=3306

# JWT
JWT_SECRET=your_very_strong_secret_key_here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.com
```

### Frontend
```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Post-Deployment Checklist

- [ ] Backend is accessible and returns 200 on `/health`
- [ ] Database is connected and seeded
- [ ] Frontend can reach backend API
- [ ] Authentication works (login/logout)
- [ ] All CRUD operations work
- [ ] CORS is properly configured
- [ ] SSL/HTTPS is enabled
- [ ] Environment variables are set correctly
- [ ] Database backups are configured
- [ ] Monitoring is set up
- [ ] Error logging is configured

## Monitoring & Maintenance

### PM2 Commands (Self-Hosted)
```bash
pm2 status              # Check status
pm2 logs pharmacy-backend  # View logs
pm2 restart pharmacy-backend  # Restart
pm2 stop pharmacy-backend     # Stop
pm2 delete pharmacy-backend   # Remove
```

### Database Backup
```bash
# Backup
mysqldump -u pharmacy_user -p pharmacy_db > backup_$(date +%Y%m%d).sql

# Restore
mysql -u pharmacy_user -p pharmacy_db < backup_20260303.sql
```

### Update Deployment
```bash
cd /var/www/pharmacy-management-system
git pull origin main
cd backend && npm install && pm2 restart pharmacy-backend
cd ../frontend && npm install && npm run build && sudo cp -r dist/* /var/www/html/
```

## Troubleshooting

### Backend Issues
- Check logs: `pm2 logs pharmacy-backend`
- Verify database connection
- Check environment variables
- Ensure port 5001 is not blocked

### Frontend Issues
- Clear browser cache
- Check API URL in .env
- Verify CORS settings
- Check browser console for errors

### Database Issues
- Verify MySQL is running: `sudo systemctl status mysql`
- Check connection: `mysql -u pharmacy_user -p`
- Review error logs: `sudo tail -f /var/log/mysql/error.log`

## Support

For deployment issues, check:
1. Platform-specific documentation
2. Project README.md
3. GitHub Issues
4. Community forums
