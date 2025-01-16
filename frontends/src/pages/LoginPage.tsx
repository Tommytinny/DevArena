import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import axiosInstance from '@/services/axiosInstance';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isloading, setIsloading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (formData.email === '' && formData.password === '') {
      setError("Email and password field can not be empty");
      return;
    } else if (formData.email === '' || formData.password === '') {
      setError("Email or password field can not be empty");
      return;
    }
    try {
      const response = await axiosInstance.post('/auth_session/login', formData);

      if (response.status === 200) {
        const data = response.data;
        login(data.access_token); // Store JWT token in cookies
        toast({
          title: "user Login",
          description: "Logged in successfully",
        })
      };
      navigate('/');
      return;
    } catch (error) {
      console.error('Error during login:', error);
      alert('Login failed');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      return;
    };
    setIsloading(false);
  }, [])


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
      
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Login to <span></span>DevArena</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <span className="text-red-600">{error}</span>
          </div>
      )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value})}
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
};
