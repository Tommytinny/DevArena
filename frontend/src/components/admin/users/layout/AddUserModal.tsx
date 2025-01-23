import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { Modal } from './Modal';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSubmitUser } from '@/pages/admin/hooks/useUser';
import { fetchAllLevel } from '@/services/admin/api';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Level {
  id: string;
  name: string;
  academic_year: string;
  semester: string;
}

interface User {
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  matric_number: string;
  role: string;
  level_id: string;
};

export function AddUserModal({ isOpen, onClose }: AddUserModalProps) {
  const { toast } = useToast();
  const [roleType, setRoleType] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [formData, setFormData] = useState<User>({
    title: '',
    first_name: '',
    last_name: '',
    matric_number: '',
    email: '',
    password: '',
    role: '',
    level_id: '',
  });


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      level_id: formData.level_id || null
    };
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/users', submitData);

      if (response.status === 201) {
        onClose();
        toast({
          title: "User Created",
          description: "User has been successfully created.",
        })
        // Reset form
        setFormData({
          title: '',
          first_name: '',
          last_name: '',
          matric_number: '',
          email: '',
          password: '',
          role: '',
          level_id: '',
        });
        setRoleType('');
      }
      setIsSubmitting(false);
    } catch (error) {
      setError(error);
    }
  };

  const fetchLevel = async () => {
    try {
      const response = await axiosInstance.get('/levels');

      if (response.status === 200) {
        const data = response.data;
        setLevels(data);
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  useEffect(() => {
    fetchLevel();
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
      {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <span className="text-red-600">{error}</span>
          </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Role</Label>
          <Select
          value={formData.role}
          onValueChange={(value) => (setFormData({ ...formData, role: value }), setRoleType(value))}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['student', 'instructor', 'admin'].map((session, index) => (
                  <SelectItem key={index} value={session}>{session}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {roleType === 'student' ?
        <>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">First Name</Label>
          <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Last Name</Label>
          <Input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Matric No</Label>
          <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.matric_number}
            onChange={(e) => setFormData({ ...formData, matric_number: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Email Address</Label>
          <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="password" className="text-left w-28">Password</Label>
          <Input 
            type="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Level</Label>
          <Select
            value={formData.level_id}
            onValueChange={(value) => setFormData({ ...formData, level_id: value })}
            >
            <SelectTrigger className="col-span-3">
              {Object.keys(levels).length > 0 ? 
              <SelectValue placeholder="Select level name" />
              :
              <SelectValue placeholder="No level is available" />
              }
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {levels.map((level, index) => (
                  <SelectItem key={index} value={level.id}>{level.name} - {level.academic_year} - {level.semester} semester</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        </> : roleType === 'instructor' || roleType === 'admin' ?  
        <>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Title</Label>
          <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">First Name</Label>
          <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Last Name</Label>
          <Input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Email Address</Label>
          <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="password" className="text-left w-28">Password</Label>
          <Input 
            type="password"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
          />
        </div>
        </> :
        <></>
        }
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <div className="flex justify-center items-center">
                    <LoaderCircle className="h-4 w-4 animate-spin" />Creating...
                  </div> : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}