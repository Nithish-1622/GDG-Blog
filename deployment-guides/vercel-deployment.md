# Vercel Deployment Guide for GDG Blog Backend (FREE)

## ✅ Vercel Free Tier Benefits
- **100 GB bandwidth/month** (plenty for most apps)
- **100 deployments/day** (automatic from Git)
- **Unlimited static sites and serverless functions**
- **Automatic HTTPS and global CDN**
- **Custom domains included**
- **12-second execution limit per function**

## ⚠️ Important: Serverless Conversion Required

Vercel uses serverless functions, so we need to convert your Express app to API routes.

## Quick Setup (Keep Express Structure)

### Option 1: Simple Vercel Wrapper (Easiest)

1. **Create vercel.json in server directory:**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.js"
    }
  ],
  "functions": {
    "server.js": {
      "maxDuration": 10
    }
  }
}
```

2. **Modify server.js for Vercel:**
Add this at the end of your server.js file:
```javascript
// Export for Vercel
module.exports = app;
```

3. **Update package.json:**
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "echo 'Build complete'"
  }
}
```

## Step-by-Step Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Navigate to Backend Directory & Setup
```bash
cd server
```

### 4. Create the vercel.json file
Create the configuration file shown above in your server directory.

### 5. Update your server.js
Add this line at the very end of your `server.js` file:
```javascript
// Export for Vercel (add this at the end)
module.exports = app;
```

### 6. Deploy
```bash
vercel
# Follow the prompts:
# - Set up and deploy? Y
# - Link to existing project? N  
# - Project name: gdg-blog-backend
# - Directory: ./
# - Override settings? N
```

### 7. Set Environment Variables
After deployment, set your environment variables:
```bash
# Add each environment variable
vercel env add JWT_SECRET production
# Enter your JWT secret when prompted

vercel env add FIREBASE_PROJECT_ID production  
# Enter: gdg-blog-99118

vercel env add FIREBASE_PRIVATE_KEY_ID production
# Enter your Firebase private key ID

vercel env add FIREBASE_PRIVATE_KEY production
# Enter your Firebase private key (with \n for line breaks)

vercel env add FIREBASE_CLIENT_EMAIL production
# Enter your Firebase client email

vercel env add FIREBASE_CLIENT_ID production
# Enter your Firebase client ID

vercel env add FIREBASE_AUTH_URI production
# Enter: https://accounts.google.com/o/oauth2/auth

vercel env add FIREBASE_TOKEN_URI production  
# Enter: https://oauth2.googleapis.com/token
```

### 8. Redeploy with Environment Variables
```bash
vercel --prod
```

### 9. Test Your API
Your backend will be available at: `https://your-project-name.vercel.app`

Test it:
- Health check: `https://your-project-name.vercel.app/`
- API endpoint: `https://your-project-name.vercel.app/api/blogs`

### 10. Update Frontend Environment
Update `client/.env.production`:
```env
VITE_API_URL=https://your-project-name.vercel.app
```

Then rebuild and redeploy frontend:
```bash
cd ../client
npm run build
firebase deploy --only hosting
```

## ✅ Vercel Free Tier Features
- **✅ 100 GB bandwidth/month** - More than enough for most blogs
- **✅ 100 deployments/day** - Automatic from Git pushes
- **✅ Serverless functions** - Auto-scaling, pay only when used
- **✅ Global CDN** - Fast response times worldwide
- **✅ Automatic HTTPS** - SSL certificates included
- **✅ Custom domains** - Use your own domain for free
- **✅ Git integration** - Automatic deployments from GitHub
- **✅ Environment variables** - Secure configuration management

## 🚨 Limitations to Consider
- **⏱️ 12-second timeout** - Functions must complete within 12 seconds
- **🔄 Cold starts** - First request might be slower (1-2 seconds)
- **📊 100 GB bandwidth limit** - Should be plenty for most applications
- **🗄️ Stateless** - No persistent file storage (use Firebase/database)

## 💰 Cost Comparison
- **Vercel**: FREE (up to limits above)
- **Railway**: $5/month credit (usually covers small apps)
- **Render**: FREE with 15-minute sleep
- **Heroku**: Minimum $5/month
- **Firebase Functions**: FREE tier, then pay-per-use

## 🎯 Is Vercel Right for Your Blog?
**✅ Perfect for:**
- Blog APIs (lightweight, fast responses)
- Small to medium traffic
- Global audience (CDN benefits)
- Developers who want zero maintenance

**⚠️ Consider alternatives if:**
- You need persistent background jobs
- Heavy computational tasks (>12 seconds)
- Very high traffic (>100GB/month)

## Quick Test Commands
After deployment, test your API:
```bash
# Health check
curl https://your-project-name.vercel.app/

# Test blog endpoint  
curl https://your-project-name.vercel.app/api/blogs

# Test with your frontend
curl https://your-project-name.vercel.app/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```