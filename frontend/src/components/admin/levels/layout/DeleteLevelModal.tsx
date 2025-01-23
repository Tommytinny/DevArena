import React, { useState } from 'react';
import { Modal } from './Modal';
import type { Level } from '../Levels';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/services/axiosInstance';
import { LoaderCircle } from 'lucide-react';

interface DeleteLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: Level;
}

export function DeleteLevelModal({ isOpen, onClose, level }: DeleteLevelModalProps) {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteLevel = async (id: string) => {
    setIsSubmitting(true)
    const response = await axiosInstance.delete(`/levels/${id}`);
    if (response.status === 200) {
      setIsSubmitting(false)
      onClose();
      toast({
        title: "Level Deleted",
        description: "Level has been successfully deleted.",
      })
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Level">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the level "{level.name}"? This action cannot be undone.
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
            onClick={() => {handleDeleteLevel(level.id)}}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            {isSubmitting ? <div className="flex justify-center items-center">
                    <LoaderCircle className="h-4 w-4 animate-spin" />Deleting...
                  </div> : "Delete Level"}
          </button>
        </div>
      </div>
    </Modal>
  );
}