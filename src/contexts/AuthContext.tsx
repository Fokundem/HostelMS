import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@hostel.com',
    role: 'admin',
    phone: '+237 677 777 777',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'student@hostel.com',
    role: 'student',
    matricule: 'HT2024001',
    department: 'Computer Science',
    level: '300',
    phone: '+237 677 888 888',
    guardianContact: '+237 677 999 999',
    assignedRoom: 'A12',
    createdAt: '2024-01-15',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth token
    const storedUser = localStorage.getItem('hostel_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string, role: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.role === role);
    if (!foundUser) {
      throw new Error('Invalid credentials');
    }
    
    setUser(foundUser);
    localStorage.setItem('hostel_user', JSON.stringify(foundUser));
    setIsLoading(false);
  };

  const register = async (userData: Partial<User>, _password: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'student',
      phone: userData.phone,
      department: userData.department,
      level: userData.level,
      matricule: userData.matricule,
      guardianContact: userData.guardianContact,
      createdAt: new Date().toISOString(),
    };
    
    setUser(newUser);
    localStorage.setItem('hostel_user', JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hostel_user');
  };

  const resetPassword = async (email: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Password reset email sent to:', email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
