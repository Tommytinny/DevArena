import React, { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';
import { useToast } from '@/hooks/use-toast';

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type Event = {
  title: string;
  date: string;
  venue: string;
  type: string;
  level_id: string;
};

export type Level = {
  id: string;
  name: string;
  academic_year: string;
  semester: string;
}

export function AddEventModal({ isOpen, onClose }: AddEventModalProps) {
  const { toast } = useToast();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [levels, setLevels] = useState<Level[]>([]);
  const [formData, setFormData] = useState<Event>({
    title: '',
    date: '',
    venue: '',
    type: '',
    level_id: ''
  });

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


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post('/events', formData);

      if (response.status === 201) {
        onClose();
        toast({
          title: "Event Created",
          description: "Event has been successfully created.",
        });
        // Reset form
        setFormData({
          title: '',
          date: '',
          venue: '',
          type: '',
          level_id: ''
        });
      }
      setIsSubmitting(false);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchLevel();
  }, [])


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Event">
      {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <span className="text-red-600">{error}</span>
          </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center justify-start gap-4">
          <Label className="text-left w-28">Title</Label>
          <Textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label className="text-left w-28">Date</Label>
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
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <div className="flex justify-center items-center">
                    <LoaderCircle className="h-4 w-4 animate-spin" />Creating...
                  </div> : "Create Event"}
          </button>
        </div>
      </form>
    </Modal>
  );
}