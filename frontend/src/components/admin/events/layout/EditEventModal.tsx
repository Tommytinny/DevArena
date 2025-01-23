import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from './Modal';
import type { Event } from './AddEventModal';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import type { Level } from './AddEventModal';

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onEdit: (event: Event) => void;
}



export function EditEventModal({ isOpen, onClose, event, onEdit }: EditEventModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(event);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    setFormData(event);
    fetchLevel();
  }, [event]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true)
    
    try {
      const response = await axiosInstance.put(`/events/${formData.id}`, formData);

      if (response.status === 200) {
        onClose();
        toast({
          title: "Event Updated",
          description: "Event has been successfully updated.",
        })
      }
    } catch (error) {
      console.error('Error', error);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Event">
      <form onSubmit={handleUpdate} className="space-y-4">
      <div className="flex items-center justify-start gap-4">
        <Label className="text-left w-28">Title</Label>
        <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
        <Label  className="text-left w-28">Date</Label>
        <Input 
            type="datetime-local"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label className="text-left w-28">Venue</Label>
          <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start">
          <Label className="text-left w-[8rem]">Type</Label>
          <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['Learning', 'Tutorial', 'Birthday'].map((type, index) => (
                  <SelectItem key={index} value={type}>{type}</SelectItem>
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