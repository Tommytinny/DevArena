import React, { useState } from 'react';
import { Modal } from './Modal';
import type { User } from '../Users';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

export function DeleteUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDeleteUser = async (id: string) => {
    setIsSubmitting(true)

    try {
      const response = await axiosInstance.delete(`/users/${id}`);

      if (response.status === 200) {
        setIsSubmitting(false)
        onClose();
        toast({
          title: "User Deleted",
          description: "User has been successfully deleted.",
        })
      }
    } catch (error) {
      console.error('Error', error);
    }
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the user "{user.first_name} {user.last_name}"? This action cannot be undone.
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
            onClick={() => {handleDeleteUser(user.id)}}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
           {isSubmitting ? <div className="flex justify-center items-center">
                    <LoaderCircle className="h-4 w-4 animate-spin" />Deleting...
                  </div> : "Delete User"}
          </button>
        </div>
      </div>
    </Modal>
  );
}