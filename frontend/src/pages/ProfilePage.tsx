import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import Header from "@/layouts/Headers";
import Sidebar from "@/layouts/Sidebar";
import Loading from "@/components/loading/Loading";
import axiosInstance from "@/services/axiosInstance";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const [formData, setFormData] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fetchUser = async () => {
    try {
        const userResponse = await axiosInstance.get('/users/me');
        if (userResponse.status === 200) {
            setFormData(userResponse.data);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const user = await axiosInstance.get('/users/me');
        const updateResponse = await axiosInstance.put(`/users/${user.data.id}`, formData);
        if (updateResponse.status === 200) {
            toast({
                title: "Success",
                description: "User updated successfully",
            });
        }
    } catch (error) {
        console.error(error);
    } finally {
        setIsSubmitting(false);
    }
    
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loading type='bars' />
      </div>
    )
  }


  return (
    <div className="flex flex-col h-screen bg-[#F5F7FA] dark:bg-slate-800">
          <div className="flex flex-1 lg:overflow-hidden">
            <Header />
            <Sidebar/>
            <div className="p-6 lg:px-4 px-2 max-w-full w-full lg:overflow-scroll space-y-6 mt-10 lg:mt-0 lg:pr-32">
              <div className="space-y-6 py-4 w-full lg:px-4 px-2">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
                  </div>
                 
                </div>
                <Card>
                  <CardHeader>
                    <div className="flex justify-center items-center space-x-4">
                      
                      <div>
                        <h1 className="font-bold text-2xl">Personal Information</h1>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                           value={formData.first_name}
                           onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
                           />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                           value={formData.last_name}
                           onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                           />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="matric">Matric No</Label>
                          <Input 
                           value={formData.matric_number} 
                           onChange={(e) => setFormData({ ...formData, matric_number: e.target.value })}
                           />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting} className="bg-red-500 hover:bg-red-600">Save Changes</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
  )
}