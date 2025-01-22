import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Event } from '../Events';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export function DeleteEventModal({ isOpen, onClose, event }: DeleteEventModalProps) {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteEvent = async (id: string) => {
    setIsSubmitting(true)

    try {
      const response = await axiosInstance.delete(`/events/${id}`);

      if (response.status === 200) {
        setIsSubmitting(false)
        onClose();
        toast({
          title: "Event Deleted",
          description: "Event has been successfully deleted.",
        })
      }
    } catch (error) {
      console.error('Error', error);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Event">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the event "{event.title}"? This action cannot be undone.
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
            onClick={() => {handleDeleteEvent(event.id)}}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
           {isSubmitting ? <div className="flex justify-center items-center">
                    <LoaderCircle className="h-4 w-4 animate-spin" />Deleting...
                  </div> : "Delete Event"}
          </button>
        </div>
      </div>
    </Modal>
  );
}