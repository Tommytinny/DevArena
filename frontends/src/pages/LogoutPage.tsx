import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext";
import Loading from "@/components/loading/Loading";


export default function LogoutPage() {
  const [islogout, setIsLogout] = useState(false);
  const [isLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    logout();
    setIsLogout(true);
  }, []);


  if (islogout === true) {
    return <Navigate to="/login" />;
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loading type='bars' />
      </div>
    )
  }

};
