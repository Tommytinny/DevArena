import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import axiosInstance from '@/services/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import Loading from '@/components/loading/Loading';

const loginSchema = z.object({
  email: z.string().email("Email can not be empty"),
  password: z.string().min(5, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
    setIsLoading(false);
  }, [isAuthenticated, navigate, location, setIsLoading]);

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setError(error.errors[0].message);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth_session/login', formData);

      if (response.status === 200) {
        const data = response.data;
        login(data.access_token);
        toast({
          title: "Success",
          description: "Logged in successfully",
        });

        const current_user = await axiosInstance.get('/users/me');
        const role = current_user.data.role;
        
        // Navigate to the page they tried to visit or home
        if (role === 'admin') {
          const from = '/admin';
          navigate(from, { replace: true });
        } else {
          const from = (location.state as any)?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
        
        return;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loading type='bars' />
      </div>
    )
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Welcome to DevArena
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => {
                  setError('');
                  setFormData({ ...formData, email: e.target.value });
                }}
                disabled={isLoading}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setError('');
                  setFormData({ ...formData, password: e.target.value });
                }}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-primary hover:underline"
              tabIndex={0}
            >
              Register here
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}