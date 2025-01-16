import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Course } from '../Courses';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/services/axiosInstance';

interface DeleteCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

export function DeleteCourseModal({ isOpen, onClose, course }: DeleteCourseModalProps) {

  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteCourse = async (id: string) => {
    setIsSubmitting(true)
    const response = await axiosInstance.delete(`/courses/${id}`);
    if (response.status === 200) {
      setIsSubmitting(false)
      onClose();
      toast({
        title: "Course Deleted",
        description: "Course has been successfully deleted.",
      })
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the course "{course.title}"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {handleDeleteCourse(course.id)}}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            {isSubmitting ? <div className="flex justify-center items-center">
                    <LoaderCircle className="h-4 w-4 animate-spin" />Deleting...
                  </div> : "Delete Course"}
          </button>
        </div>
      </div>
    </Modal>
  );
}