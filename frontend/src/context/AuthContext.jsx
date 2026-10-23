import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('royal_marble_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.success) {
            setUser(res.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Auth verification error:', err);
          logout();
        }
      }
      setLoading(false);
    }
    loadUser();
  }, [token]);

  // Customer Login
  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.success) {
      localStorage.setItem('royal_marble_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  // Customer Registration
  const register = async (userData) => {
    const res = await api.register(userData);
    if (res.success) {
      localStorage.setItem('royal_marble_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  // Dedicated Admin Login
  const adminLogin = async (email, password) => {
    const res = await api.adminLogin(email, password);
    if (res.success) {
      localStorage.setItem('royal_marble_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  // Single Owner Setup
  const setupAdmin = async (adminData) => {
    const res = await api.setupAdmin(adminData);
    if (res.success) {
      localStorage.setItem('royal_marble_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    localStorage.removeItem('royal_marble_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data) => {
    const res = await api.updateProfile(data);
    if (res.success) {
      setUser(res.user);
    }
    return res;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        login,
        register,
        adminLogin,
        setupAdmin,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
