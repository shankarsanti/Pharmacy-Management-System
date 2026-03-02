# 🚀 Deployment Guide - Pharmacy Management System

This guide will help you deploy your Pharmacy Management System to the web.

## 📋 Prerequisites

- GitHub account (already set up ✅)
- Vercel account (for frontend)
- Render/Railway account (for backend + database)

## 🎯 Deployment Options

### Option 1: Vercel (Frontend) + Render (Backend + Database) - RECOMMENDED

This is the easiest and most cost-effective option with free tiers.

#### Step 1: Deploy Database on Render

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "PostgreSQL" or use their MySQL option
3. Or use a managed MySQL service:
   - [PlanetScale](https://planetscale.com) - Free tier available
   - [Railway](https://railway.app) - MySQL with free tier
   - [Aiven](https://aiven.io) - Free MySQL tier

#### Step 2: Deploy Backend on Render

1. Go to [Render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: `shankarsanti/Pharmacy-Management-System`
4. Configure:
   - **Name:** pharmacy-backend
   - **Root Directory:** `backend`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5001
   DB_HOST=<your-database-host>
   DB_USER=<your-database-user>
   DB_PASSWORD=<your-database-password>
   DB_NAME=pharmacy_db
   JWT_SECRET=<generate-a-strong-secret>
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. Copy your backend URL (e.g., `https://pharmacy-backend.onrender.com`)

#### Step 3: Setup Database Schema

1. Connect to your database using MySQL client or the provider's console
2. Run the schema from `backend/config/schema.sql`
3. Run the seed script:
   ```bash
   # Update backend/.env with production database credentials
   node backend/scripts/seedDatabase.js
   ```

#### Step 4: Deploy Frontend on Vercel

1. Go to [Vercel.com](https://vercel.com) and sign up
2. Click "Add New" → "Project"
3. Import your GitHub repository: `shankarsanti/Pharmacy-Management-System`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://pharmacy-backend.onrender.com
   ```

6. Click "Deploy"
7. Wait for deployment (2-3 minutes)
8. Your app will be live at `https://your-app.vercel.app`

#### Step 5: Update CORS Settings

1. Go back to Render dashboard
2. Update the `CORS_ORIGIN` environment variable with your Vercel URL
3. Restart the backend service

---

### Option 2: Railway (Full Stack) - EASIEST

Railway can host both frontend, backend, and database in one place.

1. Go to [Railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect and deploy both services
5. Add a MySQL database from Railway's marketplace
6. Configure environment variables as shown above
7. Done! Railway provides URLs for both services

---

### Option 3: Netlify (Frontend) + Heroku (Backend)

Similar to Vercel + Render, but using different platforms.

---

## 🔧 Post-Deployment Configuration

### Update Frontend Environment

Make sure your frontend `.env` points to the production backend:

```env
VITE_API_URL=https://your-backend-url.com
```

### Update Backend Environment

Ensure CORS allows your frontend domain:

```env
CORS_ORIGIN=https://your-frontend-url.com
```

### Test the Deployment

1. Visit your frontend URL
2. Try logging in with default credentials:
   - Email: `admin@pharmacare.com`
   - Password: `admin123`
3. Test all features:
   - Dashboard loads
   - Inventory management works
   - POS system functions
   - Sales are recorded

---

## 🔒 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (at least 32 characters)
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set up database backups
- [ ] Configure proper CORS origins
- [ ] Review and update all default credentials
- [ ] Enable rate limiting (add to backend)
- [ ] Set up monitoring and logging

---

## 📊 Monitoring & Maintenance

### Render Dashboard
- Monitor backend performance
- View logs
- Check database connections
- Restart services if needed

### Vercel Dashboard
- Monitor frontend performance
- View deployment logs
- Check analytics
- Manage domains

---

## 🐛 Common Deployment Issues

### Issue: CORS Errors
**Solution:** Update `CORS_ORIGIN` in backend environment variables to match your frontend URL

### Issue: Database Connection Failed
**Solution:** 
- Verify database credentials
- Check if database allows external connections
- Ensure database is running

### Issue: 502 Bad Gateway
**Solution:**
- Check backend logs on Render
- Verify all environment variables are set
- Restart the backend service

### Issue: Frontend Can't Connect to Backend
**Solution:**
- Verify `VITE_API_URL` is set correctly
- Check if backend is running
- Test backend URL directly in browser

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Testing)
- **Vercel:** Free (Frontend hosting)
- **Render:** Free (Backend hosting with limitations)
- **PlanetScale/Railway:** Free tier for database
- **Total:** $0/month

### Production Tier (For Real Use)
- **Vercel Pro:** $20/month (optional)
- **Render Starter:** $7/month (better performance)
- **Database:** $5-15/month (managed MySQL)
- **Total:** ~$12-35/month

---

## 🚀 Quick Deploy Commands

### Deploy to Vercel (Frontend)
```bash
cd frontend
npm install -g vercel
vercel --prod
```

### Deploy to Render (Backend)
Use the Render dashboard or:
```bash
# Install Render CLI
npm install -g render-cli
render deploy
```

---

## 📱 Custom Domain Setup

### Vercel (Frontend)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render (Backend)
1. Go to Service Settings → Custom Domain
2. Add your API subdomain (e.g., api.yourdomain.com)
3. Update DNS records

---

## 🎉 You're Live!

Once deployed, your Pharmacy Management System will be accessible worldwide at:
- **Frontend:** https://your-app.vercel.app
- **Backend API:** https://pharmacy-backend.onrender.com

Share the link with your team and start managing your pharmacy online!

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review deployment logs on your hosting platform
3. Verify all environment variables are set correctly
4. Test the backend API directly using curl or Postman

---

**Last Updated:** March 2, 2026
**Status:** Ready for Deployment 🚀
