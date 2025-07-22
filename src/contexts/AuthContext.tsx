import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useMutation } from '@tanstack/react-query';
import { loginPartner } from '../api/auth';
import { LoginApiResponse } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean | string>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // default true

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('shollu_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false); // only set false after checking localStorage
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (variables: { email: string; password: string }) => {
      return loginPartner(variables.email, variables.password);
    },
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });

  const login = async (email: string, password: string): Promise<boolean | string> => {
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      if (response.success) {
        // Map backend user role to User type
        const backendRole = response.data.user.role;
        const mappedRole = backendRole === 'admin' ? 'admin' : 'satgas'; // TODO: adjust if more roles
        const userData: User = {
          id: response.data.user.id.toString(),
          email,
          name: response.data.user.name,
          role: mappedRole,
          createdAt: new Date().toISOString(),
        };
        setUser(userData);
        localStorage.setItem('shollu_user', JSON.stringify(userData));
        localStorage.setItem('shollu_token', response.data.token);
        return true;
      }
      return response.message || false;
    } catch (err: any) {
      // Jika error dari API, ambil message
      if (err?.response?.data?.message) {
        return err.response.data.message;
      }
      return false;
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    
    // Mock registration - in real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email: data.email,
      name: data.name,
      role: 'satgas',
      createdAt: new Date().toISOString()
    };
    
    setUser(newUser);
    localStorage.setItem('shollu_user', JSON.stringify(newUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('shollu_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {loading ? (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};