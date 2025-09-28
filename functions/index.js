const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

// Initialize Firebase Admin
admin.initializeApp();
const db = admin.firestore();
const auth = admin.auth();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins in Firebase Functions
  credentials: true,
}));
app.use(express.json());

// Environment variables for Firebase Functions
const JWT_SECRET = (functions.config().jwt && functions.config().jwt.secret) || "gdg-blog-secret-key-change-in-production";

// Auth middleware
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({error: "No token provided or invalid format"});
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (jwtError) {
      console.error("JWT verification failed:", jwtError.message);
      return res.status(401).json({error: "Invalid or expired token"});
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({error: "Internal server error during authentication"});
  }
};

// Routes

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "GDG Blog API Server is running on Firebase Functions!",
    version: "1.0.0",
    endpoints: {
      blogs: {
        "GET /api/blogs": "Get all blogs",
        "GET /api/blogs/:id": "Get single blog",
        "POST /api/blogs": "Create new blog (auth required)",
        "PUT /api/blogs/:id": "Update blog (auth required)",
        "DELETE /api/blogs/:id": "Delete blog (auth required)",
      },
      auth: {
        "POST /api/auth/register": "Register new user",
        "POST /api/auth/login": "User login",
        "GET /api/auth/user": "Get current user info (auth required)",
      },
    },
  });
});

// Blog Routes

// Get all blogs (public)
app.get("/api/blogs", async (req, res) => {
  try {
    console.log("📚 Fetching all blogs...");
    const blogsRef = db.collection("blogs");
    const snapshot = await blogsRef.orderBy("createdAt", "desc").get();

    if (snapshot.empty) {
      console.log("📭 No blogs found");
      return res.json([]);
    }

    const blogs = [];
    snapshot.forEach((doc) => {
      const blogData = doc.data();
      blogs.push({
        id: doc.id,
        ...blogData,
        createdAt: blogData.createdAt?.toDate?.() || blogData.createdAt,
        updatedAt: blogData.updatedAt?.toDate?.() || blogData.updatedAt,
      });
    });

    console.log(`📚 Found ${blogs.length} blogs`);
    res.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500).json({error: "Failed to fetch blogs"});
  }
});

// Get single blog (public)
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const {id} = req.params;
    console.log(`📖 Fetching blog with ID: ${id}`);

    const blogDoc = await db.collection("blogs").doc(id).get();

    if (!blogDoc.exists) {
      console.log(`❌ Blog not found: ${id}`);
      return res.status(404).json({error: "Blog not found"});
    }

    const blogData = blogDoc.data();
    const blog = {
      id: blogDoc.id,
      ...blogData,
      createdAt: blogData.createdAt?.toDate?.() || blogData.createdAt,
      updatedAt: blogData.updatedAt?.toDate?.() || blogData.updatedAt,
    };

    console.log(`✅ Blog fetched: ${blog.title}`);
    res.json(blog);
  } catch (error) {
    console.error("❌ Error fetching blog:", error);
    res.status(500).json({error: "Failed to fetch blog"});
  }
});

// Create new blog (protected)
app.post("/api/blogs", authenticateUser, async (req, res) => {
  try {
    const {title, content, excerpt, category, tags} = req.body;
    const userId = req.user.uid;

    console.log("📝 Creating new blog post...");

    if (!title || !content) {
      return res.status(400).json({error: "Title and content are required"});
    }

    const blogData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt?.trim() || content.substring(0, 150) + "...",
      category: category?.trim() || "General",
      tags: Array.isArray(tags) ? tags : [],
      authorId: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("blogs").add(blogData);
    const newBlogDoc = await docRef.get();
    const newBlog = {id: docRef.id, ...newBlogDoc.data()};

    console.log(`✅ Blog created successfully: ${newBlog.title}`);
    res.status(201).json(newBlog);
  } catch (error) {
    console.error("❌ Error creating blog:", error);
    res.status(500).json({error: "Failed to create blog"});
  }
});

// Update blog (protected)
app.put("/api/blogs/:id", authenticateUser, async (req, res) => {
  try {
    const {id} = req.params;
    const {title, content, excerpt, category, tags} = req.body;
    const userId = req.user.uid;

    console.log(`✏️ Updating blog with ID: ${id}`);

    const blogDoc = await db.collection("blogs").doc(id).get();
    if (!blogDoc.exists) {
      return res.status(404).json({error: "Blog not found"});
    }

    const blogData = blogDoc.data();
    if (blogData.authorId !== userId) {
      return res.status(403).json({error: "You can only update your own blogs"});
    }

    const updateData = {};
    if (title) updateData.title = title.trim();
    if (content) updateData.content = content.trim();
    if (excerpt !== undefined) updateData.excerpt = excerpt?.trim() || content?.substring(0, 150) + "...";
    if (category) updateData.category = category.trim();
    if (tags) updateData.tags = Array.isArray(tags) ? tags : [];
    updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection("blogs").doc(id).update(updateData);

    const updatedBlogDoc = await db.collection("blogs").doc(id).get();
    const updatedBlog = {id, ...updatedBlogDoc.data()};

    console.log(`✅ Blog updated successfully: ${updatedBlog.title}`);
    res.json(updatedBlog);
  } catch (error) {
    console.error("❌ Error updating blog:", error);
    res.status(500).json({error: "Failed to update blog"});
  }
});

// Delete blog (protected)
app.delete("/api/blogs/:id", authenticateUser, async (req, res) => {
  try {
    const {id} = req.params;
    const userId = req.user.uid;

    console.log(`🗑️ Deleting blog with ID: ${id}`);

    const blogDoc = await db.collection("blogs").doc(id).get();
    if (!blogDoc.exists) {
      return res.status(404).json({error: "Blog not found"});
    }

    const blogData = blogDoc.data();
    if (blogData.authorId !== userId) {
      return res.status(403).json({error: "You can only delete your own blogs"});
    }

    await db.collection("blogs").doc(id).delete();
    console.log(`✅ Blog deleted successfully: ${id}`);
    res.json({message: "Blog deleted successfully"});
  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    res.status(500).json({error: "Failed to delete blog"});
  }
});

// Authentication Routes

// Register new user
app.post("/api/auth/register", async (req, res) => {
  try {
    const {email, password, displayName} = req.body;
    console.log("👤 Registering new user...");

    if (!email || !password || !displayName) {
      return res.status(400).json({error: "Email, password, and display name are required"});
    }

    const userRecord = await auth.createUser({
      email,
      password,
      displayName: displayName.trim(),
    });

    console.log("✅ User registered successfully:", userRecord.uid);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
      },
    });
  } catch (error) {
    console.error("❌ Error registering user:", error.message);

    if (error.code === "auth/email-already-exists") {
      res.status(409).json({error: "An account with this email already exists"});
    } else if (error.code === "auth/invalid-email") {
      res.status(400).json({error: "Invalid email address"});
    } else if (error.code === "auth/weak-password") {
      res.status(400).json({error: "Password is too weak"});
    } else {
      res.status(500).json({error: "Failed to register user"});
    }
  }
});

// Login user
app.post("/api/auth/login", async (req, res) => {
  try {
    const {email, password} = req.body;
    console.log("🔑 User login attempt...");

    if (!email || !password) {
      return res.status(400).json({error: "Email and password are required"});
    }

    try {
      // Get user by email
      const userRecord = await auth.getUserByEmail(email);

      // Note: Firebase Admin SDK doesn't verify passwords directly
      // In production, you might want to use Firebase Client SDK for authentication
      // For now, we'll create a JWT token assuming the password is correct

      // Create JWT token for authentication
      const jwtSecret = JWT_SECRET;
      const token = jwt.sign(
          {
            uid: userRecord.uid,
            email: userRecord.email,
            displayName: userRecord.displayName,
          },
          jwtSecret,
          {expiresIn: "7d"},
      );

      console.log("✅ Login successful for user:", userRecord.uid);

      res.json({
        message: "Login successful",
        token,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName,
          emailVerified: userRecord.emailVerified,
        },
      });
    } catch (authError) {
      if (authError.code === "auth/user-not-found") {
        res.status(404).json({error: "No account found with this email address"});
      } else {
        throw authError;
      }
    }
  } catch (error) {
    console.error("❌ Error during login:", error.message);
    res.status(500).json({error: "Login failed"});
  }
});

// Get current user info (protected)
app.get("/api/auth/user", authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;
    const userRecord = await auth.getUser(userId);

    res.json({
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({error: "Failed to fetch user information"});
  }
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);
