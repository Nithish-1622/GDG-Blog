import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getBlog, deleteBlog } from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';

function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlog();
  }, [id]);

  const fetchBlog = async () => {
    try {
      const blogData = await getBlog(id);
      if (blogData) {
        setBlog(blogData);
      } else {
        setBlog(null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching blog:', error);
      setBlog(null);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      await deleteBlog(id);
      toast.success('Blog post deleted successfully! 🗑️');
      navigate('/');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog post. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  // Check if current user is the author of this blog
  const isAuthor = currentUser && blog && blog.authorId === currentUser.uid;

  if (loading) {
    return <div>Loading blog...</div>;
  }

  if (!blog) {
    return (
      <div>
        <h2>Blog not found</h2>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="btn btn-secondary" style={{marginBottom: '2rem'}}>
        ← Back to Home
      </Link>
      
      <article style={{background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>
        <h1>{blog.title}</h1>
        <div className="blog-meta" style={{margin: '1rem 0', padding: '1rem 0', borderBottom: '1px solid #eee'}}>
          <span>By {blog.author} • {new Date(blog.createdAt.toDate ? blog.createdAt.toDate() : blog.createdAt).toLocaleDateString()}</span>
          {blog.updatedAt && (
            <span style={{marginLeft: '1rem', fontStyle: 'italic', color: '#666'}}>
              (Updated: {new Date(blog.updatedAt.toDate()).toLocaleDateString()})
            </span>
          )}
        </div>
        
        {/* Edit and Delete buttons - only show to author */}
        {isAuthor && (
          <div style={{margin: '1rem 0', padding: '1rem 0', borderBottom: '1px solid #eee'}}>
            <Link 
              to={`/edit/${id}`} 
              className="btn btn-primary" 
              style={{marginRight: '1rem'}}
            >
              ✏️ Edit Post
            </Link>
            <button 
              onClick={handleDelete} 
              className="btn" 
              style={{
                backgroundColor: '#dc3545', 
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                cursor: deleting ? 'not-allowed' : 'pointer'
              }}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : '🗑️ Delete Post'}
            </button>
          </div>
        )}
        
        <div style={{lineHeight: '1.8', fontSize: '1.1rem'}}>
          {blog.content.split('\n').map((paragraph, index) => (
            paragraph.trim() && <p key={index} style={{marginBottom: '1rem'}}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

export default BlogDetail;