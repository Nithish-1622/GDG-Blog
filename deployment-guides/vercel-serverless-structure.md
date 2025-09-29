# Vercel Serverless API Routes

## Convert Express Routes to Vercel API Routes

Since Vercel uses serverless functions, we need to restructure your Express app into individual API route files.

### Project Structure for Vercel:
```
server/
├── api/
│   ├── index.js              # Health check route
│   ├── blogs/
│   │   ├── index.js          # GET all blogs
│   │   └── [id].js          # GET/PUT/DELETE specific blog
│   └── auth/
│       ├── login.js          # POST login
│       └── register.js       # POST register
├── utils/
│   ├── firebase.js           # Firebase setup
│   ├── auth.js              # JWT middleware
│   └── cors.js              # CORS setup
├── package.json
└── vercel.json
```

### Example API Route (api/index.js):
```javascript
// api/index.js - Health check
import { cors, runMiddleware } from '../utils/cors';

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  res.json({ 
    message: 'GDG Blog API Server is running on Vercel!',
    version: '1.0.0',
    endpoints: {
      blogs: {
        'GET /api/blogs': 'Get all blogs',
        'GET /api/blogs/[id]': 'Get single blog',
        'POST /api/blogs': 'Create new blog (auth required)',
        'PUT /api/blogs/[id]': 'Update blog (auth required)',
        'DELETE /api/blogs/[id]': 'Delete blog (auth required)'
      },
      auth: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'User login'
      }
    }
  });
}
```

### Example Blog Routes (api/blogs/index.js):
```javascript
// api/blogs/index.js - Handle blog operations
import admin from 'firebase-admin';
import { cors, runMiddleware } from '../../utils/cors';
import { authenticateUser } from '../../utils/auth';

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
    }),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'GET') {
    // Get all blogs
    try {
      const snapshot = await db.collection('blogs')
        .orderBy('createdAt', 'desc')
        .get();
      
      const blogs = [];
      snapshot.forEach(doc => {
        const blogData = doc.data();
        blogs.push({
          id: doc.id,
          ...blogData,
          createdAt: blogData.createdAt?.toDate?.() || blogData.createdAt,
          updatedAt: blogData.updatedAt?.toDate?.() || blogData.updatedAt
        });
      });

      res.json(blogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      res.status(500).json({ error: 'Failed to fetch blogs' });
    }
  } else if (req.method === 'POST') {
    // Create new blog (requires authentication)
    try {
      const user = await authenticateUser(req);
      if (!user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { title, content, excerpt, category, tags } = req.body;

      if (!title || !content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }

      const blogData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt?.trim() || content.substring(0, 150) + '...',
        category: category?.trim() || 'General',
        tags: Array.isArray(tags) ? tags : [],
        authorId: user.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('blogs').add(blogData);
      const newBlogDoc = await docRef.get();
      const newBlog = { id: docRef.id, ...newBlogDoc.data() };

      res.status(201).json(newBlog);
    } catch (error) {
      console.error('Error creating blog:', error);
      res.status(500).json({ error: 'Failed to create blog' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
```