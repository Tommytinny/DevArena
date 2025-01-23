import React, { useState } from 'react';
import { Modal } from './Modal';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import axiosInstance from '@/services/axiosInstance';
import { useToast } from "@/hooks/use-toast"

interface AddLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddLevelModal({ isOpen, onClose }: AddLevelModalProps) {
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    academic_year: '',
    semester: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/levels', formData);
      if (response.status === 201) {
        setIsSubmitting(false)
        onClose();
        toast({
            title: "Level Created",
            description: "Level has been successfully created.",
          })
        // Reset form
        setFormData({
          name: '',
          academic_year: '',
          semester: '',
        });

      }
    } catch (error: string | unknown) {
      setError(error);
      setIsSubmitting(false);
    }
    
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Level">
      {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <span className="text-red-600">{error}</span>
          </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4 grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="course-name" className="text-right">Level Name</Label>
            <Select
            value={formData.name}
            onValueChange={(value) => setFormData({ ...formData, name: value })}
            >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select level name" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['ND 1', 'ND 2', 'HND 1', 'HND 2'].map((level, index) => (
                  <SelectItem key={index} value={level}>{level}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="course-name" className="text-right">Academic year</Label>
          <Select
          value={formData.academic_year}
          onValueChange={(value) => setFormData({ ...formData, academic_year: value })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select session" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['2024/2025', '2023/2024', '2022/2023', '2021/2022'].map((session, index) => (
                  <SelectItem key={index} value={session}>{session}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="task-count" className="text-right">Semester</Label>
          <Select
          value={formData.semester}
          onValueChange={(value) => setFormData({ ...formData, semester: value })}
          >
          <SelectTrigger className="col-span-3">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {['1st', '2nd'].map((semester, index) => (
                <SelectItem key={index} value={semester}>{semester}</SelectItem>
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
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Level'}
          </button>
        </div>
      </form>
    </Modal>
  );
}