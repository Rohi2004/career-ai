import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved user session on mount
    const loadUser = async () => {
      const savedUser = localStorage.getItem('careerai_user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Verify token is still valid by hitting /me
          const response = await api.get('/auth/me', parsedUser.token);
          if (response.success) {
            // Keep the token in the state, update the rest
            setUser({ ...response.data, token: parsedUser.token });
          } else {
            localStorage.removeItem('careerai_user');
          }
        } catch (error) {
          console.error('Session expired or invalid', error);
          localStorage.removeItem('careerai_user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('careerai_user', JSON.stringify(response.data));
        return { success: true, role: response.data.role };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      return { success: false, error };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.success && response.data) {
        setUser(response.data);
        localStorage.setItem('careerai_user', JSON.stringify(response.data));
        return { success: true, role: response.data.role };
      }
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('careerai_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
