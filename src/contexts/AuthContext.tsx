import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLogin, useRegister, useCurrentUser, useLogout } from '@/hooks/api';
import type { User, AuthContextType } from '@/types';
import { getAuthToken, removeAuthToken } from '@/lib/api-client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // API hooks
  const { mutateAsync: loginMutation } = useLogin();
  const { mutateAsync: registerMutation } = useRegister();
  const { mutateAsync: logoutMutation } = useLogout();
  const { data: currentUserData, isLoading: userLoading } = useCurrentUser();

  // Check for existing user on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      // Will be fetched by useCurrentUser hook
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // Update user when currentUserData changes
  useEffect(() => {
    if (currentUserData) {
      const userData: User = {
        id: currentUserData.id,
        name: currentUserData.name,
        email: currentUserData.email,
        role: currentUserData.role as 'admin' | 'hostel_manager' | 'student',
        avatar: currentUserData.avatar,
        phone: currentUserData.phone,
        department: currentUserData.department,
        level: currentUserData.level,
        matricule: currentUserData.matricule,
        guardianContact: currentUserData.guardianContact,
        assignedRoom: currentUserData.assignedRoom,
        createdAt: currentUserData.createdAt,
      };
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, [currentUserData]);

  const login = async (email: string, password: string, role: string) => {
    try {
      setIsLoading(true);
      const response = await loginMutation({ email, password });
      
      if (response.access_token) {
        const userData: User = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role as 'admin' | 'hostel_manager' | 'student',
          avatar: response.user.avatar,
          phone: response.user.phone,
          status: response.user.status,
          createdAt: response.user.createdAt,
        };
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    try {
      setIsLoading(true);
      const response = await registerMutation({
        email: userData.email || '',
        password,
        name: userData.name || '',
        phone: userData.phone,
        role: userData.role || 'STUDENT',
        matricule: userData.matricule,
        department: userData.department,
        level: userData.level,
        guardianContact: userData.guardianContact,
      });

      // After registration, automatically try to login
      if (response && userData.email) {
        await login(userData.email, password, userData.role || 'STUDENT');
      }
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutMutation();
      setUser(null);
      setIsAuthenticated(false);
      removeAuthToken();
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local state even if server logout fails
      setUser(null);
      setIsAuthenticated(false);
      removeAuthToken();
    }
  };

  const resetPassword = async (email: string) => {
    // TODO: Implement password reset when backend endpoint is available
    console.log('Password reset requested for:', email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: isAuthenticated && !userLoading,
        isLoading: isLoading || userLoading,
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
