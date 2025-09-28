import api from './api';

// Get all blogs
export async function getAllBlogs() {
  try {
    const response = await api.get('/blogs');
    return response.data;
  } catch (error) {
    console.error('Error getting blogs:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch blogs');
  }
}

// Get single blog
export async function getBlog(id) {
  try {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting blog:', error);
    if (error.response?.status === 404) {
      throw new Error('Blog not found');
    }
    throw new Error(error.response?.data?.error || 'Failed to fetch blog');
  }
}

// Create new blog
export async function createBlog(blogData) {
  try {
    const response = await api.post('/blogs', blogData);
    return response.data.blogId;
  } catch (error) {
    console.error('Error creating blog:', error);
    throw new Error(error.response?.data?.error || 'Failed to create blog');
  }
}

// Update existing blog
export async function updateBlog(id, blogData) {
  try {
    const response = await api.put(`/blogs/${id}`, blogData);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw new Error(error.response?.data?.error || 'Failed to update blog');
  }
}

// Delete blog
export async function deleteBlog(id) {
  try {
    const response = await api.delete(`/blogs/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting blog:', error);
    throw new Error(error.response?.data?.error || 'Failed to delete blog');
  }
}