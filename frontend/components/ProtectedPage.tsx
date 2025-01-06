// src/components/ProtectedPage.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../services/axiosInstance';

const ProtectedPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await axiosInstance.get('/protected');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching protected data:', error);
        alert('You need to log in to access this page.');
      }
    };

    fetchProtectedData();
  }, []);


  return (
    <div>
      <h1>Protected Content</h1>
      <p>Welcome, {data.logged_in_as}</p>
    </div>
  );
};

export default ProtectedPage;

