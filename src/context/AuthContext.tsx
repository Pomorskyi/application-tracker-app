'use client';

import { createContext, useContext, useEffect, useState, ReactNode, use } from 'react';

type AuthContextType = {
  isLogged: boolean;
  login: (userData: any) => void;
  logout: () => void;
  currentUserId?: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogged, setIsLogged] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | undefined>();

  useEffect(() => {
    const storedUser = localStorage.getItem('userId');
    // console.log('storedUser', storedUser);
    setIsLogged(!!storedUser);
  }, []);

  const login = (userId: number) => {
    // console.log('userId in login', userId);
    localStorage.setItem('userId', JSON.stringify(userId));
    setIsLogged(true);
    setCurrentUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setIsLogged(false);
    setCurrentUserId(undefined);
  };

  return (
    <AuthContext.Provider value={{ isLogged, login, logout, currentUserId }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
