import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { api } from '@/services/api';
import { error } from 'console';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  authToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User> & { password?: string; profileImage?: File }) => Promise<void>;
  uploadProfileImage: (profileImage: File) => Promise<{url: String, message: String}>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      const { user, token } = await api.login(email, password);
      
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const userWithRole = {
        ...user,
        _id: user.id, // map id to _id
        role: decodedToken.role,
        isAdmin: decodedToken.isAdmin
      };
      setUser(userWithRole);
      setAuthToken(token);
      setIsAdmin(decodedToken.isAdmin);
      
      // Store in localStorage
      localStorage.setItem('daneventsCurrentUser', JSON.stringify(userWithRole));
      localStorage.setItem('daneventsAuthToken', token);
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.register({
        name,
        email,
        password
      });
      
      // If registration is successful, proceed with auto-login
      if (response.message.toLowerCase().includes('success')) {
        // Auto login after successful registration
        await login(email, password);
        // return Promise.resolve(response.message);
      } else {
        // If there's a message but not successful, throw it as an error
        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Registration failed', error);
      throw error instanceof Error ? error : new Error('Registration failed');
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

  const updateProfile = async (userData: Partial<User> & { password?: string; profileImage?: File }) => {
    if (!user) throw new Error('No user logged in');
    
    console.log("update profileImage: ", userData.profileImage);
    try {
      const response = await api.updateUserProfile(userData);
      setUser(response.user);
      localStorage.setItem('daneventsCurrentUser', JSON.stringify(response.user));
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const uploadProfileImage = async (profileImage: File) => {
    if(!user){
      throw new Error("No user logged in");
    }
    try{
      
      const imageUrl = await api.uploadProfileImage(profileImage);
      return imageUrl;

    }catch(err){
      throw new Error(err instanceof Error? err.message : String(err));
    }
  }

  const deleteAccount = async () => {
    if (!user) throw new Error('No user logged in');
    
    try {
      await api.deleteUserAccount();
      logout();
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin,
      isLoading,
      authToken,
      login,
      register,
      logout,
      updateProfile,
      uploadProfileImage,
      deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


export { useAuth, AuthProvider };
