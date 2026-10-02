import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Clear any legacy permanent localStorage session on startup to give a fresh session
  const [user, setUser] = useState(() => {
    // Check sessionStorage first (persists on refresh, clears when tab/window is closed)
    const sessionSaved = sessionStorage.getItem('cybertrace_user');
    if (sessionSaved) {
      try {
        return JSON.parse(sessionSaved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  // Clear legacy localStorage once on startup
  useEffect(() => {
    try {
      localStorage.removeItem('cybertrace_token');
      localStorage.removeItem('cybertrace_user');
    } catch (e) {
      // Ignore
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      // Store in sessionStorage: preserves session across page refreshes, automatically resets when window is closed
      sessionStorage.setItem('cybertrace_token', access_token);
      sessionStorage.setItem('cybertrace_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Authentication failed. Please verify credentials.',
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async ({ email, password, full_name, role, badge_number }) => {
    setLoading(true);
    try {
      await api.post('/auth/signup', {
        email,
        password,
        full_name,
        role,
        badge_number,
      });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Officer registration failed. Please verify information.',
      };
    } finally {
      setLoading(false);
    }
  };

  const googleAuthInit = async ({ email, full_name, google_id }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google/init', { email, full_name, google_id });
      if (res.data.status === 'existing_user') {
        const { access_token, user: userData } = res.data;
        sessionStorage.setItem('cybertrace_token', access_token);
        sessionStorage.setItem('cybertrace_user', JSON.stringify(userData));
        setUser(userData);
      }
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Google sign-in initiation failed. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const googleCompleteRegistration = async ({ email, full_name, badge_number, role, otp, department }) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/google/complete-registration', {
        email,
        full_name,
        badge_number,
        role,
        otp,
        department,
      });
      const { access_token, user: userData } = res.data;
      sessionStorage.setItem('cybertrace_token', access_token);
      sessionStorage.setItem('cybertrace_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Verification or profile completion failed.',
      };
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/me', profileData);
      const updatedUser = res.data;
      sessionStorage.setItem('cybertrace_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Failed to update profile. Please try again.',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore
    }
    sessionStorage.removeItem('cybertrace_token');
    sessionStorage.removeItem('cybertrace_user');
    localStorage.removeItem('cybertrace_token');
    localStorage.removeItem('cybertrace_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        signup,
        googleAuthInit,
        googleCompleteRegistration,
        logout,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
