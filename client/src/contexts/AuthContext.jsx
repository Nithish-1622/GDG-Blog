import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  async function signup(email, password, name) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update the user's display name
    await updateProfile(result.user, {
      displayName: name
    });
    return result;
  }

  // Login function
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout function
  function logout() {
    // Clear localStorage when logging out
    localStorage.removeItem('user');
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in - get ID token for API calls
        try {
          const accessToken = await user.getIdToken();
          const userData = {
            uid: user.uid,
            id: user.uid,
            name: user.displayName || user.email.split('@')[0],
            email: user.email,
            displayName: user.displayName,
            accessToken: accessToken
          };
          setCurrentUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Error getting user token:', error);
          setCurrentUser(null);
          localStorage.removeItem('user');
        }
      } else {
        // User is signed out
        setCurrentUser(null);
        localStorage.removeItem('user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

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