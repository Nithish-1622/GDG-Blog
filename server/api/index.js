const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Import services and middleware
const BlogService = require('../services/blogService');
const AuthService = require('../services/authService');
const { authenticateUser, optionalAuth } = require('../middleware/auth');

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    console.log('🔍 CORS Debug - Origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Allow localhost for development
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      console.log('✅ CORS: Allowing localhost origin');
      return callback(null, true);
    }
    
    // Allow any Vercel deployment URL for this project
    if (origin.includes('gdg-blog-') && origin.includes('vercel.app')) {
      console.log('✅ CORS: Allowing Vercel deployment URL');
      return callback(null, true);
    }
    
    // Allow Firebase hosting
    if (origin.includes('gdg-blog-99118.web.app') || origin.includes('gdg-blog-99118.firebaseapp.com')) {
      console.log('✅ CORS: Allowing Firebase hosting URL');
      return callback(null, true);
    }
    
    // Allow specific CORS_ORIGIN from environment
    if (process.env.CORS_ORIGIN && origin === process.env.CORS_ORIGIN) {
      console.log('✅ CORS: Allowing environment CORS_ORIGIN');
      return callback(null, true);
    }
    
    console.log('❌ CORS: Rejecting origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'GDG Blog API Server is running on Vercel!',
    version: '1.0.0',
    platform: 'Vercel Serverless',
    endpoints: {
      blogs: {
        'GET /api/blogs': 'Get all blogs',
        'GET /api/blogs/:id': 'Get single blog',
        'POST /api/blogs': 'Create new blog (auth required)',
        'PUT /api/blogs/:id': 'Update blog (auth required)',
        'DELETE /api/blogs/:id': 'Delete blog (auth required)'
      },
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'Login user',
        'GET /api/auth/user': 'Get current user info (auth required)'
      }
    }
  });
});

// Blog Routes

// Get all blogs (public)
app.get('/api/blogs', async (req, res) => {
  try {
    console.log('📚 Fetching all blogs...');
    const blogs = await BlogService.getAllBlogs();
    console.log(`✅ Successfully fetched ${blogs.length} blogs`);
    res.json(blogs);
  } catch (error) {
    console.error('❌ Error fetching blogs:', error.message);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get single blog (public)
app.get('/api/blogs/:id', async (req, res) => {
  try {
    console.log('📖 Fetching blog with ID:', req.params.id);
    const blog = await BlogService.getBlog(req.params.id);
    console.log('✅ Successfully fetched blog:', blog.title);
    res.json(blog);
  } catch (error) {
    console.error('❌ Error fetching blog:', error.message);
    if (error.message === 'Blog not found') {
      res.status(404).json({ error: 'Blog not found' });
    } else {
      res.status(500).json({ error: 'Failed to fetch blog' });
    }
  }
});

// Create new blog (auth required)
app.post('/api/blogs', authenticateUser, async (req, res) => {
  try {
    console.log('✍️ Creating new blog for user:', req.user.uid);
    const { title, content, author } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    if (title.length < 5) {
      return res.status(400).json({ error: 'Title must be at least 5 characters long' });
    }
    
    if (content.length < 50) {
      return res.status(400).json({ error: 'Content must be at least 50 characters long' });
    }

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      author: author || req.user.name || req.user.email?.split('@')[0] || 'Anonymous',
      authorEmail: req.user.email
    };

    const blogId = await BlogService.createBlog(blogData, req.user.uid);
    console.log('✅ Blog created successfully with ID:', blogId);
    
    res.status(201).json({ 
      message: 'Blog created successfully',
      blogId: blogId
    });
  } catch (error) {
    console.error('❌ Error creating blog:', error.message);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Update blog (auth required)
app.put('/api/blogs/:id', authenticateUser, async (req, res) => {
  try {
    console.log('📝 Updating blog with ID:', req.params.id, 'for user:', req.user.uid);
    const { title, content } = req.body;
    
    // Validation
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    if (title.length < 5) {
      return res.status(400).json({ error: 'Title must be at least 5 characters long' });
    }
    
    if (content.length < 50) {
      return res.status(400).json({ error: 'Content must be at least 50 characters long' });
    }

    const blogData = {
      title: title.trim(),
      content: content.trim()
    };

    await BlogService.updateBlog(req.params.id, blogData, req.user.uid);
    console.log('✅ Blog updated successfully');
    
    res.json({ message: 'Blog updated successfully' });
  } catch (error) {
    console.error('❌ Error updating blog:', error.message);
    if (error.message.includes('Permission denied')) {
      res.status(403).json({ error: error.message });
    } else if (error.message === 'Blog not found') {
      res.status(404).json({ error: 'Blog not found' });
    } else {
      res.status(500).json({ error: 'Failed to update blog' });
    }
  }
});

// Delete blog (auth required)
app.delete('/api/blogs/:id', authenticateUser, async (req, res) => {
  try {
    console.log('🗑️ Deleting blog with ID:', req.params.id, 'for user:', req.user.uid);
    
    await BlogService.deleteBlog(req.params.id, req.user.uid);
    console.log('✅ Blog deleted successfully');
    
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting blog:', error.message);
    if (error.message.includes('Permission denied')) {
      res.status(403).json({ error: error.message });
    } else if (error.message === 'Blog not found') {
      res.status(404).json({ error: 'Blog not found' });
    } else {
      res.status(500).json({ error: 'Failed to delete blog' });
    }
  }
});

// Auth Routes

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    console.log('👤 Registering new user...');
    const { email, password, displayName } = req.body;
    
    // Validation
    if (!email || !password || !displayName) {
      return res.status(400).json({ error: 'Email, password, and display name are required' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    const user = await AuthService.createUser(email, password, displayName);
    console.log('✅ User registered successfully:', user.uid);
    
    res.status(201).json({ 
      message: 'User registered successfully',
      user: user
    });
  } catch (error) {
    console.error('❌ Error registering user:', error.message);
    
    if (error.code === 'auth/email-already-exists') {
      res.status(409).json({ error: 'Email already exists' });
    } else if (error.code === 'auth/invalid-email') {
      res.status(400).json({ error: 'Invalid email format' });
    } else if (error.code === 'auth/weak-password') {
      res.status(400).json({ error: 'Password is too weak' });
    } else {
      res.status(500).json({ error: 'Failed to register user' });
    }
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('🔑 User login attempt...');
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
      // Get user by email to verify user exists
      const userRecord = await AuthService.getUserByEmail(email);
      
      if (!userRecord) {
        return res.status(401).json({ error: 'No account found with this email address' });
      }
      
      // Create JWT token for authentication
      const jwtSecret = process.env.JWT_SECRET || 'gdg-blog-secret-key-change-in-production';
      const token = jwt.sign(
        { 
          uid: userRecord.uid, 
          email: userRecord.email,
          displayName: userRecord.displayName
        },
        jwtSecret,
        { expiresIn: '24h' }
      );
      
      console.log('✅ Login successful for user:', userRecord.uid);
      
      res.json({ 
        message: 'Login successful',
        token: token,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified
        }
      });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        res.status(401).json({ error: 'No account found with this email address' });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('❌ Error during login:', error.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// Get current user info (auth required)
app.get('/api/auth/user', authenticateUser, async (req, res) => {
  try {
    console.log('👤 Getting user info for:', req.user.uid);
    const user = await AuthService.getUser(req.user.uid);
    console.log('✅ User info retrieved successfully');
    
    res.json(user);
  } catch (error) {
    console.error('❌ Error getting user info:', error.message);
    res.status(500).json({ error: 'Failed to get user info' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Export the Express app for Vercel
module.exports = app;