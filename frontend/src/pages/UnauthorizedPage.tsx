import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";
import Loading from "@/components/loading/Loading";

export default function Unauthorized() {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data and validate role
        const userResponse = await axiosInstance.get("/users/me");
        const userData = userResponse.data;
        setRole(userData.role);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-[100vh] w-[100vw]'>
        <Loading type="bars" />
      </div>
    );
  }

  if (role === "admin" || role === "instructor") {
    return <Navigate to="/admin" />;
  } else {
    return <Navigate to="/" />;
  }

};
