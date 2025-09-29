# Railway Deployment Guide for GDG Blog Backend

## Prerequisites
- Railway account (free): https://railway.app
- Railway CLI installed

## Step-by-Step Deployment

### 1. Install Railway CLI
```bash
npm install -g @railway/cli
```

### 2. Login to Railway
```bash
railway login
```

### 3. Navigate to Backend Directory
```bash
cd server
```

### 4. Initialize Railway Project
```bash
railway init
# Select: "Empty Project"
# Give it a name like "gdg-blog-backend"
```

### 5. Add Environment Variables
```bash
# Set all your environment variables
railway variables set JWT_SECRET="your-jwt-secret-key"
railway variables set FIREBASE_PROJECT_ID="gdg-blog-99118"
railway variables set FIREBASE_PRIVATE_KEY_ID="your-private-key-id"
railway variables set FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-key-here\n-----END PRIVATE KEY-----"
railway variables set FIREBASE_CLIENT_EMAIL="your-service-account@gdg-blog-99118.iam.gserviceaccount.com"
railway variables set FIREBASE_CLIENT_ID="your-client-id"
railway variables set NODE_ENV="production"
railway variables set PORT="5000"
```

### 6. Deploy
```bash
railway up
```

### 7. Get Your Deployment URL
```bash
railway domain
# This will give you a URL like: https://your-app.up.railway.app
```

### 8. Update Frontend Environment
Update `client/.env.production`:
```env
VITE_API_URL=https://your-app.up.railway.app
```

Then rebuild and redeploy frontend:
```bash
cd ../client
npm run build
firebase deploy --only hosting
```

## Railway Features
- ✅ Free tier: $5/month credit (usually enough for small apps)
- ✅ Automatic deployments from Git
- ✅ Built-in database options
- ✅ Easy environment variable management
- ✅ Custom domains
- ✅ SSL certificates included