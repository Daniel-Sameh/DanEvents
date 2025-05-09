
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { api } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session on app load
    const storedUser = localStorage.getItem('daneventsCurrentUser');
    const storedToken = localStorage.getItem('daneventsAuthToken');
    
    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setAuthToken(storedToken);
        setIsAdmin(parsedUser.role === 'admin');
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        // Clear invalid data
        localStorage.removeItem('daneventsCurrentUser');
        localStorage.removeItem('daneventsAuthToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user: loggedInUser, token } = await api.login(email, password);
      
      setUser(loggedInUser);
      setAuthToken(token);
      setIsAdmin(loggedInUser.role === 'admin');
      
      // Store in localStorage
      localStorage.setItem('daneventsCurrentUser', JSON.stringify(loggedInUser));
      localStorage.setItem('daneventsAuthToken', token);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { user: registeredUser, token } = await api.register({
        name,
        email,
        password
      });
      
      setUser(registeredUser);
      setAuthToken(token);
      setIsAdmin(registeredUser.role === 'admin');
      
      // Store in localStorage
      localStorage.setItem('daneventsCurrentUser', JSON.stringify(registeredUser));
      localStorage.setItem('daneventsAuthToken', token);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAuthToken(null);
    setIsAdmin(false);
    
    // Clear from localStorage
    localStorage.removeItem('daneventsCurrentUser');
    localStorage.removeItem('daneventsAuthToken');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isLoading,
      authToken,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
