
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This would connect to a backend in a real app
  useEffect(() => {
    // Simulate checking for stored authentication
    const storedUser = localStorage.getItem('eventideUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('eventideUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // This would call an API in a real app
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll just check for admin@example.com/password
      if (email === 'admin@example.com' && password === 'password') {
        const adminUser: User = {
          id: 'admin-id',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin'
        };
        setUser(adminUser);
        localStorage.setItem('eventideUser', JSON.stringify(adminUser));
      } 
      // Regular user login with any other credentials
      else {
        const regularUser: User = {
          id: 'user-' + Date.now(),
          email,
          name: email.split('@')[0],
          role: 'user'
        };
        setUser(regularUser);
        localStorage.setItem('eventideUser', JSON.stringify(regularUser));
      }
    } catch (error) {
      console.error('Login failed', error);
      throw new Error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // This would call an API in a real app
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: 'user-' + Date.now(),
        email,
        name,
        role: 'user'
      };
      
      setUser(newUser);
      localStorage.setItem('eventideUser', JSON.stringify(newUser));
    } catch (error) {
      console.error('Registration failed', error);
      throw new Error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('eventideUser');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, isAdmin }}>
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
