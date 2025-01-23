import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { User } from '../Users';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onEdit: (user: User) => void;
}

interface Level {
  id: string;
  name: string;
  academic_year: string;
  semester: string;
}

export function EditUserModal({ isOpen, onClose, user, onEdit }: EditUserModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(user);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const fetchLevel = async () => {
    try {
      const response = await axiosInstance.get('/levels');

      if (response.status === 200) {
        const data = response.data;
        setLevels(data)
      }
    } catch (error) {
      console.error('Error', error);
    }
  };

  useEffect(() => {
    fetchLevel();
    setFormData(user);
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    
    try {
      const response = await axiosInstance.put(`/users/${formData.id}`, formData);

      if (response.status === 200) {
        const data = response.data;
        setLevels(data)
        onClose();
        toast({
          title: "User Updated",
          description: "User has been successfully updated.",
        })
      }
    } catch (error) {
      console.error('Error', error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleUpdate} className="space-y-4">
        {formData.role === 'Instructor' ? 
        <>
        <div>
        <Label htmlFor="course-name" className="text-right">Title</Label>
        <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
        </div>
        <div>
        <Label htmlFor="course-name" className="text-right">First Name</Label>
        <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
          />
        </div>
        <div>
        <Label htmlFor="course-name" className="text-right">Last Name</Label>
        <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} 
          />
        </div>
        <div>
          <Label htmlFor="course-name" className="text-right">Email</Label>
          <Input 
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
        </div></> :
        <>
        <div>
        <Label htmlFor="course-name" className="text-right">First Name</Label>
        <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} 
          />
        </div>
        <div>
        <Label htmlFor="course-name" className="text-right">Last Name</Label>
        <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} 
          />
        </div>
        <div>
          <Label htmlFor="course-name" className="text-right">Email</Label>
          <Input 
            type="email"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
          />
        </div>
        <div>
          <Label htmlFor="course-name" className="text-right">Level</Label>
          <Select
          value={formData.level_id}
          onValueChange={(value) => setFormData({ ...formData, level_id: value })}
          >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {levels.map((level, index) => (
                <SelectItem key={index} value={level.id}>{level.name} - {level.academic_year} - {level.semester} semester</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
          </Select>
        </div> </> }
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
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {isSubmitting ? <div className="flex justify-center items-center">
                    <LoaderCircle className="h-4 w-4 animate-spin" />Updating...
                  </div> : "Save changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}