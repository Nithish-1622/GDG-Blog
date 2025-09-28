import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '../services/blogService';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogsData = await getAllBlogs();
      setBlogs(blogsData);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error.message || 'Failed to load blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const getExcerpt = (content) => {
    if (!content) return 'No content available...';
    const text = content.replace(/<[^>]*>/g, ''); // Remove HTML tags
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="loading-spinner mb-6"></div>
        <p className="text-lg lg:text-xl text-gray-600 text-center animate-pulse">
          Loading amazing blogs...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            {/* Hero Content */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 lg:mb-8 animate-fade-in">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                GDG Blog
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 max-w-4xl mx-auto mb-8 lg:mb-12 leading-relaxed animate-slide-up">
              Discover amazing stories, insights, and knowledge from our vibrant developer community.
              Join us in sharing experiences, learning new technologies, and building the future together.
            </p>
            
            {/* Hero Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 lg:mb-16">
              <Link to="/create" className="w-full sm:w-auto btn-primary btn-large group">
                <span className="mr-2 group-hover:animate-bounce">✍️</span>
                Write Your Story
              </Link>
              {!currentUser && (
                <Link to="/register" className="w-full sm:w-auto btn-outline btn-large text-white border-white hover:bg-white hover:text-primary-600 group">
                  <span className="mr-2 group-hover:animate-bounce">👋</span>
                  Join Community
                </Link>
              )}
            </div>
            
            {/* Hero Stats */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 pt-8 border-t border-blue-400/20">
              <div className="text-center animate-fade-in">
                <div className="text-3xl sm:text-4xl font-bold mb-1">
                  {blogs.length}+
                </div>
                <div className="text-sm sm:text-base text-blue-200 uppercase tracking-wide">
                  Stories
                </div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="text-3xl sm:text-4xl font-bold mb-1">
                  {new Set(blogs.map(b => b.authorId)).size}+
                </div>
                <div className="text-sm sm:text-base text-blue-200 uppercase tracking-wide">
                  Writers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Error State */}
        {error && (
          <div className="mb-8 lg:mb-12 flex justify-center animate-slide-up">
            <div className="bg-red-500 text-white p-6 lg:p-8 rounded-xl shadow-lg text-center max-w-md">
              <span className="block text-4xl mb-4">⚠️</span>
              <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
              <p className="text-red-100 mb-6">{error}</p>
              <button onClick={fetchBlogs} className="btn-primary">
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && blogs.length === 0 && (
          <div className="text-center py-16 lg:py-24 animate-fade-in">
            <span className="block text-6xl lg:text-8xl mb-6 opacity-70">📝</span>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              No blogs yet!
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Be the first to share your knowledge and experience with the community.
            </p>
            <Link to="/create" className="btn-primary btn-large group">
              <span className="mr-2 group-hover:animate-bounce">✨</span>
              Write First Blog
            </Link>
          </div>
        )}

        {/* Blogs Section */}
        {!error && blogs.length > 0 && (
          <>
            {/* Section Header */}
            <div className="text-center mb-12 lg:mb-16 animate-fade-in">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Latest Stories
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto">
                Fresh insights from our community
              </p>
            </div>
            
            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
              {blogs.map((blog, index) => (
                <article 
                  key={blog.id} 
                  className="card group animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Card Content */}
                  <div className="p-6 lg:p-8 flex flex-col h-full">
                    {/* Blog Header */}
                    <div className="mb-4">
                      <h3 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {blog.title}
                      </h3>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">👤</span>
                          <span className="font-medium">
                            {blog.author || 'Anonymous'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-gray-400">📅</span>
                          <span>
                            {formatDate(blog.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Blog Excerpt */}
                    <p className="text-gray-700 line-clamp-3 mb-6 flex-grow leading-relaxed">
                      {getExcerpt(blog.content)}
                    </p>
                    
                    {/* Blog Actions */}
                    <div className="flex flex-wrap gap-3 mt-auto">
                      <Link 
                        to={`/blog/${blog.id}`} 
                        className="btn-primary flex-1 sm:flex-none group"
                      >
                        <span className="mr-2">📖</span>
                        Read Story
                      </Link>
                      
                      {currentUser && blog.authorId === currentUser.uid && (
                        <Link 
                          to={`/edit/${blog.id}`} 
                          className="btn-outline group"
                        >
                          <span className="mr-1">✏️</span>
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="px-6 lg:px-8 pb-6 lg:pb-8">
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        Story
                      </span>
                      {blog.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {blog.category}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Call to Action Section */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl lg:rounded-3xl p-8 lg:p-16 text-center animate-fade-in">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Ready to Share Your Story?
              </h2>
              <p className="text-lg lg:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Join our community of passionate developers and share your knowledge with the world.
              </p>
              <Link to="/create" className="btn-primary btn-large group">
                <span className="mr-2 group-hover:animate-bounce">🚀</span>
                Start Writing
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;