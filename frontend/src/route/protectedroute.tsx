import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import axiosInstance from "@/services/axiosInstance";
import Loading from "@/components/loading/Loading";
import Cookies from 'js-cookie';

type Role = 'admin' | 'student'; // Restrict to specific role types

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { logout } = useAuth();
  const token = Cookies.get('token');
  const [isAuthenticated] = useState(token !== undefined);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {

    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        setUserRole(response.data.role as Role);
      } catch (error) {
        console.error('Error fetching user role:', error);
        // If unauthorized, logout user
        if (error.response?.status === 401) {
          logout();
        }
        setUserRole(null);
      } finally {
        setLoading(false);
      }
    };

    

      fetchCurrentUser();
    
  }, [logout]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loading type='bars' />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted URL for redirection after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;