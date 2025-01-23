import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { Level } from '../Levels';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/services/axiosInstance';
import { LoaderCircle } from 'lucide-react';

interface EditLevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: Level;
  onEdit: (level: Level) => void;
}

export function EditLevelModal({ isOpen, onClose, level, onEdit }: EditLevelModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(level);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setFormData(level);
  }, [level]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    const levelsResponse = await axiosInstance.put(`/levels/${formData.id}`, formData);
    if (levelsResponse.status === 200) {
      setIsSubmitting(false)
      onClose();
      toast({
        title: "Level Updated",
        description: "Level has been successfully updated.",
      })
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Level">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="course-name" className="text-right">Level Name</Label>
          <Select
          value={formData.name}
          onValueChange={(value) => setFormData({ ...formData, name: value })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select level" />
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
              <SelectValue placeholder="Select level" />
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
              <SelectValue placeholder="Select level" />
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