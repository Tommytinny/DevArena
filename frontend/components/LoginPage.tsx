// src/components/LoginPage.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/authContext';
import axiosInstance from '../services/axiosInstance';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/login', { username, password });

      if (response.status === 200) {
        const data = response.data;
        login(data.access_token); // Store JWT token in cookies
        alert('Login successful!');
        window.location.href = '/protected'; // Redirect to protected page
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <input
        type=text
        placeholder=Username
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type=password
        placeholder=Password
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;

