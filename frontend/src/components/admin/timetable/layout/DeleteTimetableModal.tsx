import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Timetable } from '../Timetable';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';

interface DeleteTimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  timetable: Timetable;
}

export function DeleteTimetableModal({ isOpen, onClose, timetable }: DeleteTimetableModalProps) {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteTimetable = async (id: string) => {
    setIsSubmitting(true)

    try {
      const response = await axiosInstance.delete(`/timetables/${id}`);

      if (response.status === 200) {
        setIsSubmitting(false)
        onClose();
        toast({
          title: "Timetable Deleted",
          description: "Timetable has been successfully deleted.",
        })
      }
    } catch (error) {
      console.error('Error', error);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Timetable">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the timetable "{timetable.course_name}"? This action cannot be undone.
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
            onClick={() => {handleDeleteTimetable(timetable.id)}}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
           {isSubmitting ? <div className="flex justify-center items-center">
                    <LoaderCircle className="h-4 w-4 animate-spin" />Deleting...
                  </div> : "Delete Timetable"}
          </button>
        </div>
      </div>
    </Modal>
  );
}