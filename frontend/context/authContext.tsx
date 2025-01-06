// src/context/authContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Cookies from 'js-cookie';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const token = Cookies.get('token');
  const isAuthenticated = token !== undefined;

  const login = (token: string) => {
    Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'Strict' });
  };

  const logout = () => {
    Cookies.remove('token');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token: token || null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

