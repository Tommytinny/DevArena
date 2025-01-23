import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import type { User } from '../../users/Users';
import type { Level } from '../../levels/Levels';


interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddCourseModal({ isOpen, onClose }: AddCourseModalProps) {
  const { toast } = useToast();

  const [instructors, setInstructors] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [levels, setLevels] = useState<Level[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    course_code: '',
    description: '',
    units: '',
    instructor_id: '',
    level_id: '',
    resources: [
      {
        title: '',
        description: '',
        resource_type: '',
        file_url: '',
      }
    ]
  });

  const fetchUser = async () => {
    try {
      const usersResponse = await axiosInstance.get('/users');
      if (usersResponse.status === 200) {
        const users = usersResponse.data;
        setInstructors(users.filter((user: { role: string; }) => user.role === 'instructor'));
      }
    } catch (err) {
      return false;
    }
    
  }

  const fetchLevel = async () => {
    try {
      const levelsResponse = await axiosInstance.get('/levels');
      if (levelsResponse.status === 200) {
        const levels = levelsResponse.data;
        setLevels(levels);
      }
    } catch (err) {
      return false;
    } 
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/courses', formData);
      if (response.status === 201) {
        onClose();
        setIsSubmitting(false);
        toast({
          title: "Course Created",
          description: "Course has been successfully created.",
        })
        setFormData({
          title: '',
          course_code: '',
          description: '',
          units: '',
          instructor_id: '',
          level_id: '',
          resources: [
            {
              title: '',
              description: '',
              resource_type: '',
              file_url: '',
            }
          ]
        });
      };
    } catch (error) {
      setError('Error submitting data');
    }
  };

  useEffect(() => {
    fetchUser();
    fetchLevel();
  }, [])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Course">
      {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <span className="text-red-600">{error}</span>
          </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 grid gap-4 py-4">
        <div className="flex items-center gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Course Title</Label>
          <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="text-left w-28">Course Code</Label>
          <Input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.course_code}
            onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="block text-sm font-medium text-gray-700 w-28">Course Description</Label>
          <Textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="block text-sm font-medium text-gray-700 w-28">Course Units</Label>
          <Input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.units}
            onChange={(e) => setFormData({ ...formData, units: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="block text-sm font-medium text-gray-700 w-28">Instructor in Charge</Label>
          <Select
          value={formData.instructor_id}
          onValueChange={(value) => setFormData({ ...formData, instructor_id: value })}
          >
            <SelectTrigger className="col-span-3">
            {Object.keys(instructors).length > 0 ? 
              <SelectValue placeholder="Select Instructor" />
              :
              <SelectValue placeholder="No instructor is available" />
              }
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {instructors.map((instructor, index) => (
                  <SelectItem key={index} value={instructor.id}>{instructor.title} {instructor.first_name} {instructor.last_name}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <Label className="block text-sm font-medium text-gray-700 w-28">Level</Label>
          <Select
          value={formData.level_id}
          onValueChange={(value) => setFormData({ ...formData, level_id: value })}
          >
            <SelectTrigger className="col-span-3">
            {Object.keys(levels).length > 0 ? 
              <SelectValue placeholder="Select Level" />
              :
              <SelectValue placeholder="No level is available" />
              }
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {levels.map((level, index) => (
                  <SelectItem key={index} value={level.id}>{level.name} - {level.academic_year} - {level.semester}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
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
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            {isSubmitting ? <div className="flex justify-center items-center">
                    <LoaderCircle className="h-4 w-4 animate-spin" />Creating...
                  </div> : "Create Course"}
          </button>
        </div>
      </form>
    </Modal>
  );
}