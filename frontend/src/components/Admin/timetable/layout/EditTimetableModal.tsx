import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { Timetable } from '../Timetable';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import type { Level } from './AddTimetableModal';

interface EditTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: Timetable;
  onEdit: (timetable: Timetable) => void;
}


export function EditTimetableModal({ isOpen, onClose, timetable, onEdit }: EditTimetableModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(timetable);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [levels, setLevels] = useState<Level[]>([])

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

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courseResponse = await axiosInstance.get('/courses');
        if (courseResponse.status === 200) {
          setCourses(courseResponse.data);
        }
      } catch (error) {
        console.error(error);
      } 
    };

    fetchCourses();
    setFormData(timetable);
    fetchLevel();
  }, []);


  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    
    try {
      const response = await axiosInstance.put(`/timetables/${formData.id}`, formData);
      if (response.status === 200) {
        setIsSubmitting(false)
        onClose();
        toast({
          title: "Timetable Updated",
          description: "Timetable has been successfully updated.",
        })
      }
    } catch (error) {
      console.error('Error', error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleUpdate} className="space-y-4">
        <div className="flex items-center justify-start">
          <Label htmlFor="course-name" className="text-left w-[10rem]">Course name</Label>
            <Select
            value={formData.course_name}
            onValueChange={(value) => setFormData({ ...formData, course_name: value })}
            >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select course name" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {courses.map((course, index) => (
                  <SelectItem key={index} value={course.course_code+" "+course.title}>{course.course_code+" "+course.title}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-start">
          <Label htmlFor="course-name" className="text-left w-[10rem]">Day</Label>
            <Select
            value={formData.day}
            onValueChange={(value) => setFormData({ ...formData, day: value })}
            >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select day" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['1', '2', '3', '4', '5'].map((day, index) => (
                  <SelectItem key={index} value={day}>{
                    day === '1' 
                    ? "Mon" : day === '2' 
                    ? 'Tue' : day === '3' 
                    ? 'Wed' : day === '4'
                    ? 'Thur' : 'Fri'}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-start ">
          <Label htmlFor="course-name" className="text-left w-[10rem]">Start time</Label>
            <Select
            value={formData.start_time}
            onValueChange={(value) => setFormData({ ...formData, start_time: value })}
            >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select start time" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'].map((start, index) => (
                  <SelectItem key={index} value={start}>{start} : 00 {Number(start) >= 12 ? "PM" : "AM"}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-start">
          <Label className="text-left w-[10rem]">Duration</Label>
            <Select
            value={formData.duration}
            onValueChange={(value) => setFormData({ ...formData, duration: value })}
            >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['1', '2', '3', '4'].map((num, index) => (
                  <SelectItem key={index} value={num}>{num} hours</SelectItem>
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