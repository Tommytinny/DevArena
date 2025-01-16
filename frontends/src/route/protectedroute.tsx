import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import axiosInstance from "@/services/axiosInstance";


type Role = string;

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}


const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth(); // Get the authentication state from the hook
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch the current user role
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/users/me');
        setUserRole(response.data.role); // Set the user's role in state
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole(null); // Reset role if fetching fails
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    if (isAuthenticated) {
      fetchCurrentUser();
    } else {
      setLoading(false); // If not authenticated, skip fetching
    }
  }, [isAuthenticated]);

  // Show a loading spinner or placeholder while loading
  if (loading) {
    return <div></div>;
  }

  // Check if the user's role matches any of the allowed roles
  if (userRole && allowedRoles.includes(userRole)) {
    return children;
  }

  // Redirect to login if the user role is not allowed
  return <Navigate to="/login" />;
};

export default ProtectedRoute;