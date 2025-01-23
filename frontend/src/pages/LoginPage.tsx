import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/authContext';
import axiosInstance from '@/services/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<{ email?: string; password?: string; general?: string }>({});
  const { isAuthenticated, login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        const fieldErrors = error.errors.reduce((acc: Record<string, string>, curr) => {
          acc[curr.path[0] as string] = curr.message;
          return acc;
        }, {});
        setError(fieldErrors); // Update error to be an object
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

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
        }
        
        if (role === 'instructor') {
          const from = '/instructor';
          navigate(from, { replace: true });
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const from = (location.state as any)?.from?.pathname || '/';
          navigate(from, { replace: true });
        }
        return;
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.response) {
        // Server responded with a status code outside 2xx range
        console.log(error.response.data);
        errorMessage = error.response.data?.error || 'Invalid credentials.';
      } else if (error.request) {
        // Request was made, but no response received
        errorMessage = 'No response from server. Please check your connection.';
      }
    
      setError({ general: errorMessage }); // Update error to include general errors
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
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
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-red-500">
            Welcome to DevArena
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div aria-live="assertive">
            {error.general && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error.general}</AlertDescription>
              </Alert>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                aria-label="Email Address"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => {
                  setError((prev) => ({ ...prev, email: '' })); // Clear email error
                  setFormData({ ...formData, email: e.target.value });
                }}
                disabled={isLoading}
                className="w-full"
              />
              {error.email && <p className="text-red-500 text-sm">{error.email}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                aria-label='Password'
                placeholder="******"
                value={formData.password}
                onChange={(e) => {
                  setError((prev) => ({ ...prev, password: '' })); // Clear password error
                  setFormData({ ...formData, password: e.target.value });
                }}
                disabled={isLoading}
                className="w-full"
              />
              {error.password && <p className="text-red-500 text-sm">{error.password}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-red-500 hover:bg-red-400"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
      </Card>
    </div>
  );
}