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
    // Default active demo investigator
    return {
      id: 2,
      email: 'investigator@cybertrace.gov.in',
      full_name: 'Sub-Inspector Ananya Rao',
      role: 'investigator',
      badge_number: 'IND-DEL-409',
    };
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

  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', formData);
      const { access_token, user: userData } = res.data;
      localStorage.setItem('cybertrace_token', access_token);
      localStorage.setItem('cybertrace_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.detail || 'Registration failed. Please check your details.',
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
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
