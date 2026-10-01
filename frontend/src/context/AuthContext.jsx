import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cybertrace_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = res.data;
      localStorage.setItem('cybertrace_token', access_token);
      localStorage.setItem('cybertrace_user', JSON.stringify(userData));
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
      // Deliberately do not auto-login so user must proceed through the login screen first
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

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore
    }
    localStorage.removeItem('cybertrace_token');
    localStorage.removeItem('cybertrace_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
