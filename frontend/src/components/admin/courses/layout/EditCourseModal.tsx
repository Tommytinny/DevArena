import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { Course } from '../Courses';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import axiosInstance from '@/services/axiosInstance';
import { updateCourse } from '@/services/admin/api';
import type { User } from '../../users/Users';
import type { Level } from '../../levels/Levels';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';


interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
  onEdit: (course: Course) => void;
}

export function EditCourseModal({ isOpen, onClose, course, onEdit }: EditCourseModalProps) {
  const { toast } = useToast();

  const [formData, setFormData] = useState(course);
  const [instructors, setInstructors] = useState<User[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUser = async () => {
    try {
      const usersResponse = await axiosInstance.get('/users');
      if (usersResponse.status === 200) {
        const users = usersResponse.data
        setInstructors(users.filter((user: { role: string; }) => user.role === 'instructor'));
      }
    } catch (err) {
      return false;
    }
    
  }

  const fetchLevel = async () => {
    try {
      const levelResponse = await axiosInstance.get('/levels');
      if (levelResponse.status === 200) {
        const levels = levelResponse.data;
        setLevels(levels);
      }
    } catch (err) {
      return false;
    } 
  };

  useEffect(() => {
    fetchUser();
    fetchLevel();
    setFormData(course);
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    const response = await axiosInstance.put(`/courses/${formData.id}`, formData);
    if (response.status === 200) {
      setIsSubmitting(false)
      onClose();
      toast({
        title: "Course Updated",
        description: "Course has been successfully updated.",
      })
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Course">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700">Course Title</Label>
          <Input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">Course Code</Label>
          <Input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.course_code}
            onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">Course Description</Label>
          <Textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">Course Units</Label>
          <Input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.units}
            onChange={(e) => setFormData({ ...formData, units: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="course-name" className="text-right">Level Name</Label>
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
                  <SelectItem key={index} value={level.id}>{level.name} - {level.academic_year} - {level.semester}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="course-name" className="text-right">Instructor</Label>
          <Select
          value={formData.instructor_id}
          onValueChange={(value) => setFormData({ ...formData, instructor_id: value })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select Instructor" />
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