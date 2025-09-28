import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await signup(email, password, name);
      toast.success('Account created successfully! Welcome to GDG Blog! 🎉');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle Firebase auth errors with toast
      if (error.code === 'auth/email-already-in-use') {
        toast.error('An account with this email already exists.');
        setError('An account with this email already exists.');
      } else if (error.code === 'auth/invalid-email') {
        toast.error('Please enter a valid email address.');
        setError('Please enter a valid email address.');
      } else if (error.code === 'auth/weak-password') {
        toast.error('Password is too weak. Please choose a stronger password.');
        setError('Password is too weak. Please choose a stronger password.');
      } else {
        toast.error('Registration failed. Please try again.');
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Join Our Community
          </h2>
          <p className="text-gray-600">
            Create your GDG Blog account and start sharing
          </p>
        </div>

        {/* Register Form */}
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl rounded-xl border border-gray-200 animate-slide-up">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg animate-slide-up">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm"
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm"
                disabled={loading}
              />
            </div>
            
            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password (minimum 6 characters)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-200 text-sm"
                disabled={loading}
              />
              <p className="mt-1 text-xs text-gray-500">
                Password should be at least 6 characters long
              </p>
            </div>
            
            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full btn-primary btn-large justify-center group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-5 h-5 mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <span className="mr-2 group-hover:animate-bounce">🎉</span>
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="text-center animate-fade-in">
          <p className="text-xs text-gray-500">
            By creating an account, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;