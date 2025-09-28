import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { getBlog, updateBlog } from '../services/blogService';

function EditBlog() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBlog, setLoadingBlog] = useState(true);
  const [originalBlog, setOriginalBlog] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // Check if user is logged in
  if (!currentUser) {
    return (
      <div className="form-container">
        <h2>Please login to edit blog posts</h2>
        <Link to="/login" className="btn btn-primary">Login</Link>
      </div>
    );
  }

  // Fetch the blog post
  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const blogData = await getBlog(id);
      if (!blogData) {
        setError('Blog post not found');
        setLoadingBlog(false);
        return;
      }

      // Check if current user is the author
      if (blogData.authorId !== currentUser.uid) {
        setError('You can only edit your own blog posts');
        setLoadingBlog(false);
        return;
      }

      setOriginalBlog(blogData);
      setTitle(blogData.title);
      setContent(blogData.content);
      setLoadingBlog(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setError('Failed to load blog post');
      setLoadingBlog(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!title || !content) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (title.length < 5) {
      setError('Title must be at least 5 characters');
      setLoading(false);
      return;
    }

    if (content.length < 50) {
      setError('Content must be at least 50 characters');
      setLoading(false);
      return;
    }

    try {
      const updatedData = {
        title: title.trim(),
        content: content.trim()
      };
      
      await updateBlog(id, updatedData);
      console.log('Blog post updated successfully');
      toast.success('Blog post updated successfully! ✨');
      navigate(`/blog/${id}`);
    } catch (error) {
      console.error('Error updating blog:', error);
      
      if (error.code === 'permission-denied') {
        toast.error('Permission denied. You can only edit your own posts.');
        setError('Permission denied. You can only edit your own posts.');
      } else {
        toast.error('Failed to update blog post. Please try again.');
        setError('Failed to update blog post. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingBlog) {
    return <div>Loading blog...</div>;
  }

  if (error && !originalBlog) {
    return (
      <div className="form-container">
        <h2>Error</h2>
        <p style={{color: 'red'}}>{error}</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="form-container">
      <Link to={`/blog/${id}`} className="btn btn-secondary" style={{marginBottom: '1rem'}}>
        ← Back to Blog
      </Link>
      
      <h2>Edit Blog Post</h2>
      
      {error && <div style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter blog title"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            rows="15"
            disabled={loading}
          />
        </div>

        <div style={{display: 'flex', gap: '1rem'}}>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Updating...' : 'Update Blog Post'}
          </button>
          <Link to={`/blog/${id}`} className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default EditBlog;