# 🚀 GDG Blog - Modern Full-Stack Blogging Platform

<div align="center">

![GDG Blog Logo](https://img.shields.io/badge/GDG-Blog-blue?style=for-the-badge&logo=google&logoColor=white)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

*A modern, responsive blogging platform built with React, Node.js, and Firebase*

[🌐 Live Demo](https://gdg-blog-99118.web.app) | [📚 Documentation](#table-of-contents) | [🐛 Report Bug](https://github.com/Nithish-1622/GDG-Blog/issues) | [💡 Request Feature](https://github.com/Nithish-1622/GDG-Blog/issues)

</div>

## ✨ Features

### 🔐 **Authentication & Security**
- **JWT-based Authentication** - Secure token-based user authentication
- **User Registration & Login** - Complete user management system
- **Protected Routes** - Secure access to authenticated features
- **Session Persistence** - Stay logged in across browser sessions
- **Password Security** - Secure password handling with backend validation

### 📝 **Blog Management**
- **Create Blog Posts** - Rich text editor with markdown support
- **Edit & Delete Posts** - Full CRUD operations for blog content
- **Blog Categories** - Organize posts with categories and tags
- **Responsive Design** - Beautiful UI that works on all devices
- **Real-time Updates** - Live content updates without page refresh

### 🎨 **Modern UI/UX**
- **Tailwind CSS Design** - Modern, clean, and professional interface
- **Mobile-First Responsive** - Optimized for mobile, tablet, and desktop
- **Dark/Light Mode Ready** - Theme support (easily extensible)
- **Smooth Animations** - Engaging user interactions and transitions
- **Loading States** - Professional loading indicators and skeletons

### 🏗️ **Architecture**
- **Backend-Frontend Separation** - Clean architectural design
- **RESTful API** - Well-structured API endpoints
- **Firebase Integration** - Cloud Firestore for data persistence
- **JWT Token Management** - Secure authentication flow
- **Error Handling** - Comprehensive error management and user feedback

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern React with hooks and context
- **Vite 7.1.7** - Lightning-fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **React Router 7.9.3** - Client-side routing
- **Axios 1.12.2** - HTTP client for API communication
- **React Toastify** - Beautiful toast notifications

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js 5.1.0** - Fast, unopinionated web framework
- **Firebase Admin SDK 13.5.0** - Firebase backend integration
- **JSON Web Tokens 9.0.2** - JWT authentication implementation
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Database & Storage
- **Firebase Firestore** - NoSQL cloud database
- **Firebase Authentication** - User management (backend only)
- **Local Storage** - Client-side token persistence

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Git** for version control
- **Firebase Account** - For database and authentication services

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Nithish-1622/GDG-Blog.git
cd GDG-Blog
```

### 2. Install Dependencies

#### Backend Setup
```bash
cd server
npm install
```

#### Frontend Setup
```bash
cd ../client
npm install
```

### 3. Firebase Configuration

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (Email/Password)
5. Generate Service Account Key

#### Download Service Account Key
1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save as `firebase-admin-key.json` in the `server/` directory

### 4. Environment Variables

#### Backend (.env in server/ directory)
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
```

#### Frontend (.env in client/ directory)
```env
# API Configuration
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=GDG Blog
```

### 5. Start the Application

#### Start Backend Server
```bash
cd server
npm start
# or for development with auto-reload
npm run dev
```

#### Start Frontend Development Server
```bash
cd client
npm run dev
```

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **API Documentation**: http://localhost:5000/api/docs (if implemented)

## 🌐 Live Deployment

### Current Deployment Status

- **✅ Frontend**: Deployed on Firebase Hosting
  - **URL**: [https://gdg-blog-99118.web.app](https://gdg-blog-99118.web.app)
  - **Status**: ✅ Live and functional
  - **Features**: Full React app with Tailwind CSS, responsive design

- **⚠️ Backend**: Requires Firebase Blaze Plan Upgrade
  - **Status**: Ready for deployment (code prepared)
  - **Requirements**: Firebase project upgrade to Blaze (pay-as-you-go) plan
  - **Alternative**: Can be deployed to Railway, Render, or Heroku

### How to Access

1. **🌐 Visit Live Demo**: [https://gdg-blog-99118.web.app](https://gdg-blog-99118.web.app)
2. **⚡ Full Functionality**: Requires backend deployment (see deployment section below)
3. **🔧 Local Development**: Follow the installation guide above for full features

## 📁 Project Structure

```
GDG-Blog/
├── client/                     # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   └── Navbar.jsx      # Navigation component
│   │   ├── contexts/           # React context providers
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx        # Home page
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Register.jsx    # Registration page
│   │   │   ├── CreateBlog.jsx  # Create blog post
│   │   │   ├── EditBlog.jsx    # Edit blog post
│   │   │   └── BlogDetail.jsx  # Blog post detail view
│   │   ├── services/           # API and external services
│   │   │   └── api.js          # Axios configuration and API calls
│   │   ├── assets/             # Static assets
│   │   ├── App.jsx             # Main application component
│   │   ├── main.jsx            # Application entry point
│   │   └── index.css           # Global styles
│   ├── public/                 # Public static files
│   ├── package.json            # Frontend dependencies
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── vite.config.js          # Vite build configuration
│   └── postcss.config.js       # PostCSS configuration
├── server/                     # Backend Node.js application
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   ├── .env                    # Environment variables
│   └── firebase-admin-key.json # Firebase service account key
├── README.md                   # Project documentation
└── .gitignore                  # Git ignore rules
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info (protected)

### Blog Posts
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get specific blog post
- `POST /api/blogs` - Create new blog post (protected)
- `PUT /api/blogs/:id` - Update blog post (protected)
- `DELETE /api/blogs/:id` - Delete blog post (protected)

### Health Check
- `GET /` - API health check
- `GET /api/health` - Detailed health status

## 🚀 Deployment

### Firebase Deployment (Recommended)

This project is optimized for Firebase deployment with both hosting and serverless functions.

#### Frontend Deployment (Firebase Hosting)

**Live Demo**: 🌐 [https://gdg-blog-99118.web.app](https://gdg-blog-99118.web.app)

1. **Prerequisites:**
   - Firebase CLI installed (`npm install -g firebase-tools`)
   - Firebase project created
   - Firebase project initialized in your directory

2. **Deploy Frontend:**
```bash
# Build the React app
cd client
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

#### Backend Deployment (Firebase Functions)

**Note**: Firebase Functions require a **Blaze (pay-as-you-go)** plan.

1. **Upgrade Firebase Plan:**
   - Visit [Firebase Console](https://console.firebase.google.com/project/gdg-blog-99118/usage/details)
   - Upgrade to Blaze plan (required for Cloud Functions)

2. **Deploy Functions:**
```bash
# Deploy Firebase Functions
firebase deploy --only functions

# Your API will be available at:
# https://us-central1-gdg-blog-99118.cloudfunctions.net/api
```

3. **Update Frontend Environment:**
   - Update `client/.env.production` with your Functions URL
   - Rebuild and redeploy frontend

#### Alternative Backend Deployment Options

If you prefer not to use Firebase Functions, you can deploy the backend to:

**Option 1: Railway**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd server
railway login
railway init
railway up
```

**Option 2: Render**
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables from your `.env` file

**Option 3: Heroku**
```bash
# Install Heroku CLI and deploy
cd server
heroku create your-app-name
heroku config:set JWT_SECRET=your-secret
heroku config:set NODE_ENV=production
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Production Environment Setup

1. **Update API URLs:**
   - Update `VITE_API_URL` in `client/.env.production`
   - Point to your deployed backend URL

2. **Environment Variables:**
   - Set all required environment variables in your hosting platform
   - Ensure Firebase credentials are properly configured
   - Use secure JWT secrets in production

### Domain Configuration (Optional)

1. **Custom Domain Setup:**
   - Go to Firebase Console → Hosting → Add custom domain
   - Follow the verification process
   - Update DNS records as instructed

2. **SSL Certificate:**
   - Firebase automatically provides SSL certificates
   - Your site will be available at both HTTP and HTTPS

## 🧪 Testing

### Backend Testing
```bash
cd server
npm test
```

### Frontend Testing
```bash
cd client
npm test
```

### End-to-End Testing
```bash
npm run test:e2e
```

## 🔧 Development Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with auto-reload
npm test           # Run tests
npm run lint       # Run ESLint
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
npm test           # Run tests
```



<div align="center">

**Built with ❤️ by the GDG Community**

[⬆ Back to Top](#-gdg-blog---modern-full-stack-blogging-platform)

</div>
