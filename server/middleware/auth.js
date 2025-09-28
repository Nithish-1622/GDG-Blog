const AuthService = require('../services/authService');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided or invalid format' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'gdg-blog-secret-key-change-in-production';
    const decodedToken = jwt.verify(token, jwtSecret);
    
    req.user = decodedToken; // Add user info to request
    
    next();
  } catch (error) {
    console.error('Authentication middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    } else {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  }
};

// Optional authentication middleware (for routes that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split('Bearer ')[1];
      
      // Verify JWT token
      const jwtSecret = process.env.JWT_SECRET || 'gdg-blog-secret-key-change-in-production';
      const decodedToken = jwt.verify(token, jwtSecret);
      req.user = decodedToken;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

module.exports = { authenticateUser, optionalAuth };