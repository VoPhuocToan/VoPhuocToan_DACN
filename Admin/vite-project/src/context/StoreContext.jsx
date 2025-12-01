import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('adminToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  // Initialize user and token from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedUser = localStorage.getItem('adminUser');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error('[DEBUG] Error loading saved user:', err);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      localStorage.setItem('adminToken', token);
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('adminToken');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('adminUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('adminUser');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      console.log('[DEBUG] Logging in with email:', email);
      console.log('[DEBUG] API URL:', `${API_URL}/auth/login`);
      
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('[DEBUG] Response status:', response.status);
      console.log('[DEBUG] Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log('[DEBUG] Login response:', data);

      // Backend returns { success: true, data: { _id, name, email, role, token } }
      if (!data.success || !data.data) {
        throw new Error(data.message || 'Login failed');
      }

      const { token, ...userData } = data.data;
      
      if (!token) {
        throw new Error('No token received from server');
      }

      // Check if user is admin
      if (userData.role !== 'admin') {
        throw new Error('Chỉ admin mới có thể đăng nhập vào trang quản trị');
      }

      setToken(token);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(userData));
      console.log('[DEBUG] Login successful, user:', userData);
      return { success: true, data };
    } catch (err) {
      console.error('[DEBUG] Login error:', err.message);
      setError(err.message);
      setIsAuthenticated(false);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('adminToken');
  };

  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    API_URL,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
