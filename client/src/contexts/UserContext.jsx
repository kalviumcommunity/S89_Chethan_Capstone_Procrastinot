// src/contexts/UserContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { getUserFromToken, ensureValidToken, clearAuthData } from '../utils/auth';
import tokenMonitor from '../services/tokenMonitor';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Get current user from token
  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if we have a token first
      const tokenUser = getUserFromToken();
      if (!tokenUser) {
        console.log('🔐 No token found, user not authenticated');
        setUser(null);
        setStats(null);
        setLoading(false);
        return;
      }

      console.log('🔐 Token found, attempting to authenticate user...');

      // First check if token is valid and refresh if needed
      const tokenValid = await ensureValidToken();
      if (!tokenValid) {
        console.log('🔐 Token validation failed');
        setUser(null);
        setStats(null);
        clearAuthData();
        setLoading(false);
        return;
      }

      const userData = await userService.getCurrentUser();
      setUser(userData);

      // Fetch user stats
      const userStats = await userService.getUserStats(userData._id);
      setStats(userStats);

      console.log('✅ User data loaded successfully:', userData.username);

    } catch (err) {
      console.error('User authentication error:', err);

      // Don't show error for expected authentication failures or when no token exists
      const isExpectedError = err.message.includes('No valid authentication token found') ||
                             err.message.includes('Invalid authentication token') ||
                             err.message.includes('authentication') ||
                             err.message.includes('Invalid token') ||
                             err.message.includes('Token expired');

      if (!isExpectedError) {
        setError(`Network error: ${err.message}`);
      } else {
        console.log('🔐 Expected authentication error (no token or expired token)');
      }

      // Only clear user data and auth if it's a real authentication failure
      if (isExpectedError) {
        setUser(null);
        setStats(null);
        clearAuthData();
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Update user profile
  const updateProfile = useCallback(async (profileData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await userService.updateProfile(user._id, profileData);
      setUser(updatedUser.user || updatedUser);
      
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Upload profile picture
  const uploadProfilePicture = useCallback(async (file) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.uploadProfilePicture(user._id, file);
      
      // Update user data with new profile picture
      setUser(prev => ({
        ...prev,
        profilePicture: result.profilePicture
      }));
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Change password
  const changePassword = useCallback(async (passwordData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const result = await userService.changePassword(user._id, passwordData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Refresh user data
  const refreshUser = useCallback(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  // Logout user
  const logout = useCallback(() => {
    clearAuthData();
    tokenMonitor.stopMonitoring();
    setUser(null);
    setStats(null);
    setError(null);
    setInitialized(false);
    console.log('🔐 User logged out');
  }, []);

  // Initialize user on mount
  useEffect(() => {
    if (!initialized) {
      console.log('🔄 Initializing user context...');
      // Only try to get user if there's a token
      const tokenUser = getUserFromToken();
      if (tokenUser) {
        getCurrentUser().finally(() => {
          setInitialized(true);
          console.log('✅ User context initialized');
        });
      } else {
        console.log('🔐 No token found, skipping user authentication');
        setLoading(false);
        setInitialized(true);
      }
    }
  }, [initialized, getCurrentUser]);

  const value = {
    user,
    stats,
    loading,
    error,
    updateProfile,
    uploadProfilePicture,
    changePassword,
    refreshUser,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
