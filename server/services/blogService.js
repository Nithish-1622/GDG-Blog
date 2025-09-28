const { db } = require('../config/firebase');

const BLOGS_COLLECTION = 'blogs';

class BlogService {
  // Get all blogs
  static async getAllBlogs() {
    try {
      const snapshot = await db.collection(BLOGS_COLLECTION)
        .orderBy('createdAt', 'desc')
        .get();
      
      const blogs = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        blogs.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        });
      });
      
      return blogs;
    } catch (error) {
      console.error('Error getting blogs:', error);
      throw error;
    }
  }

  // Get single blog
  static async getBlog(id) {
    try {
      const doc = await db.collection(BLOGS_COLLECTION).doc(id).get();
      
      if (!doc.exists) {
        throw new Error('Blog not found');
      }

      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting blog:', error);
      throw error;
    }
  }

  // Create new blog
  static async createBlog(blogData, userId) {
    try {
      console.log('Creating blog with data:', blogData, 'for user:', userId);
      
      const docRef = await db.collection(BLOGS_COLLECTION).add({
        ...blogData,
        authorId: userId,
        createdAt: new Date()
      });
      
      console.log('Blog created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error;
    }
  }

  // Update existing blog
  static async updateBlog(id, blogData, userId) {
    try {
      console.log('Updating blog with ID:', id, 'Data:', blogData, 'User:', userId);
      
      // First check if the blog exists and user owns it
      const blogDoc = await db.collection(BLOGS_COLLECTION).doc(id).get();
      
      if (!blogDoc.exists) {
        throw new Error('Blog not found');
      }

      const blogData_existing = blogDoc.data();
      if (blogData_existing.authorId !== userId) {
        throw new Error('Permission denied. You can only edit your own posts.');
      }

      await db.collection(BLOGS_COLLECTION).doc(id).update({
        ...blogData,
        updatedAt: new Date()
      });
      
      console.log('Blog updated successfully');
      return id;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error;
    }
  }

  // Delete blog
  static async deleteBlog(id, userId) {
    try {
      console.log('Deleting blog with ID:', id, 'User:', userId);
      
      // First check if the blog exists and user owns it
      const blogDoc = await db.collection(BLOGS_COLLECTION).doc(id).get();
      
      if (!blogDoc.exists) {
        throw new Error('Blog not found');
      }

      const blogData = blogDoc.data();
      if (blogData.authorId !== userId) {
        throw new Error('Permission denied. You can only delete your own posts.');
      }

      await db.collection(BLOGS_COLLECTION).doc(id).delete();
      
      console.log('Blog deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error;
    }
  }
}

module.exports = BlogService;