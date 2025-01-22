// src/context/authContext.tsx
import React, { createContext, useContext, ReactNode } from 'react';
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
    Cookies.set('token', token, { expires: 7 });
  };

  const logout = () => {
    Cookies.remove('token');
    const isToken = Cookies.get('token') !== undefined;
    return isToken;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token: token || null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
