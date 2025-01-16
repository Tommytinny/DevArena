import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";


export default function LogoutPage() {
  const [islogout, setIsLogout] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    setIsLogout(true);
  }, []);


  if (islogout === true) {
    return <Navigate to="/login" />;
  }
};
