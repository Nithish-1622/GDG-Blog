import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const storedUser = localStorage.getItem('gdg_blog_user');
        const storedToken = localStorage.getItem('gdg_blog_token');
        
        if (storedUser && storedToken) {
          const userData = JSON.parse(storedUser);
          setCurrentUser({ ...userData, token: storedToken });
          console.log('🔄 Restored user session:', userData.email);
        }
      } catch (error) {
        console.error('❌ Error restoring session:', error);
        localStorage.removeItem('gdg_blog_user');
        localStorage.removeItem('gdg_blog_token');
      }
      setLoading(false);
    };

    checkAuthState();
  }, []);

  // Sign up function - uses backend API only
  async function signup(email, password, name) {
    try {
      console.log('🔄 Starting registration process...');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/api/auth/register`, {
        email,
        password,
        displayName: name
      });
      
      console.log('📝 Backend registration response:', response.status, response.data);
      
      if (response.status === 201) {
        console.log('✅ User created on backend successfully!');
        
        // Return success for registration - user will need to login separately
        return {
          success: true,
          message: 'Registration successful! Please sign in with your credentials.',
          user: response.data.user
        };
      } else {
        throw new Error(response.data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      if (error.response && error.response.data) {
        // Backend returned an error
        const backendError = new Error(error.response.data.error);
        console.log('🔍 Backend error details:', error.response.data);
        
        // Map backend errors to Firebase error codes for consistency
        if (error.response.data.error.includes('already exists') || error.response.data.error.includes('already in use')) {
          backendError.code = 'auth/email-already-in-use';
        } else if (error.response.data.error.includes('invalid email')) {
          backendError.code = 'auth/invalid-email';
        } else if (error.response.data.error.includes('weak password')) {
          backendError.code = 'auth/weak-password';
        }
        throw backendError;
      } else {
        // Network or other error
        console.log('🌐 Network/other error:', error.message);
        throw error;
      }
    }
  }

  // Login function - uses backend API with JWT tokens
  async function login(email, password) {
    try {
      console.log('🔑 Starting login process...');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      // Call backend login API
      const response = await axios.post(`${apiUrl}/api/auth/login`, {
        email,
        password
      });
      
      console.log('📝 Backend login response:', response.status, response.data);
      
      if (response.status === 200 && response.data.token) {
        console.log('✅ Login successful with JWT token');
        
        const userData = {
          uid: response.data.user.uid,
          email: response.data.user.email,
          displayName: response.data.user.displayName,
          emailVerified: response.data.user.emailVerified,
          token: response.data.token
        };
        
        // Store user data and token
        localStorage.setItem('gdg_blog_user', JSON.stringify({
          uid: userData.uid,
          email: userData.email,
          displayName: userData.displayName,
          emailVerified: userData.emailVerified
        }));
        localStorage.setItem('gdg_blog_token', response.data.token);
        
        setCurrentUser(userData);
        
        return { user: userData };
      } else {
        throw new Error(response.data.error || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      if (error.response && error.response.data) {
        // Backend returned an error
        const backendError = new Error(error.response.data.error);
        
        // Map backend errors to consistent error codes
        if (error.response.data.error.includes('No account found')) {
          backendError.code = 'auth/user-not-found';
        } else if (error.response.data.error.includes('password')) {
          backendError.code = 'auth/wrong-password';
        } else if (error.response.data.error.includes('invalid email')) {
          backendError.code = 'auth/invalid-email';
        }
        throw backendError;
      } else {
        // Network or other error
        const customError = new Error('Login failed. Please try again.');
        customError.code = 'auth/generic-error';
        throw customError;
      }
    }
  }

  // Logout function
  function logout() {
    console.log('🚪 User logging out...');
    // Clear localStorage and user state
    localStorage.removeItem('gdg_blog_user');
    localStorage.removeItem('gdg_blog_token');
    setCurrentUser(null);
    return Promise.resolve();
  }

  // JWT Authentication - no Firebase onAuthStateChanged needed
  // User session is managed through localStorage token validation

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}