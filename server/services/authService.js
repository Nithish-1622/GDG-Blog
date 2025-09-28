const { auth } = require('../config/firebase');

class AuthService {
  // Create user
  static async createUser(email, password, displayName) {
    try {
      const userRecord = await auth.createUser({
        email: email,
        password: password,
        displayName: displayName
      });
      
      console.log('Successfully created new user:', userRecord.uid);
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Verify ID token
  static async verifyToken(idToken) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      console.log('Token verified for user:', decodedToken.uid);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying token:', error);
      throw error;
    }
  }

  // Get user by email
  static async getUserByEmail(email) {
    try {
      const userRecord = await auth.getUserByEmail(email);
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        emailVerified: userRecord.emailVerified
      };
    } catch (error) {
      console.error('Error getting user by email:', error);
      throw error;
    }
  }

  // Create custom token
  static async createCustomToken(uid) {
    try {
      const customToken = await auth.createCustomToken(uid);
      return customToken;
    } catch (error) {
      console.error('Error creating custom token:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUser(uid) {
    try {
      const userRecord = await auth.getUser(uid);
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName
      };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
}

module.exports = AuthService;