const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple in-memory storage for now (we'll replace with Firebase later)
let blogs = [
  {
    id: 1,
    title: 'Welcome to GDG Blog',
    content: 'This is our first blog post! We are excited to share knowledge and experiences with the developer community.',
    author: 'GDG Team',
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Getting Started with React',
    content: 'React is a powerful library for building user interfaces. In this post, we will explore the basics of React development.',
    author: 'John Developer',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

let users = []; // Simple user storage
let nextBlogId = 3;
let nextUserId = 1;

// Routes

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'GDG Blog API is running!' });
});

// Get all blogs
app.get('/api/blogs', (req, res) => {
  res.json(blogs);
});

// Get single blog
app.get('/api/blogs/:id', (req, res) => {
  const blog = blogs.find(b => b.id === parseInt(req.params.id));
  if (!blog) {
    return res.status(404).json({ error: 'Blog not found' });
  }
  res.json(blog);
});

// Create new blog
app.post('/api/blogs', (req, res) => {
  const { title, content, author } = req.body;
  
  if (!title || !content || !author) {
    return res.status(400).json({ error: 'Title, content, and author are required' });
  }

  const newBlog = {
    id: nextBlogId++,
    title,
    content,
    author,
    createdAt: new Date().toISOString()
  };

  blogs.unshift(newBlog); // Add to beginning of array
  res.status(201).json(newBlog);
});

// Register user
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: 'User with this email already exists' });
  }

  const newUser = {
    id: nextUserId++,
    name,
    email,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  res.status(201).json({ user: newUser, message: 'User registered successfully' });
});

// Login user
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Simple authentication (in real app, check password hash)
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ user, message: 'Login successful' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
});