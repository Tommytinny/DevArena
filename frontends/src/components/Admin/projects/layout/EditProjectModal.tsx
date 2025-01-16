import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import type { Project } from '../../../../../components/Admin/components/projects/Projects';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onEdit: (project: Project) => void;
}

export function EditProjectModal({ isOpen, onClose, project, onEdit }: EditProjectModalProps) {
  const [formData, setFormData] = useState(project);

  useEffect(() => {
    setFormData(project);
  }, [project]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Course">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700">Project Name</Label>
          <Input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">Project Description</Label>
          <Textarea
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="block text-sm font-medium text-gray-700 w-28">Start date</Label>
          <Input 
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.start}
            onChange={(e) => setFormData({ ...formData, start: e.target.value })} 
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="block text-sm font-medium text-gray-700 w-28">Deadline date</Label>
          <Input 
            type="date"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">Project type</Label>
          <Select
          value={formData.project_type}
          onValueChange={(value) => setFormData({ ...formData, project_type: value })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['Pratical', 'Exam'].map((level, index) => (
                  <SelectItem key={index} value={level}>{level}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Language</Label>
          <Select
          value={formData.project_type}
          onValueChange={(value) => setFormData({ ...formData, project_type: value })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['Python', 'C', 'C++'].map((language, index) => (
                  <SelectItem
                  key={index}
                  value={language}
                  >{language}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/*<div>
          <Label className="block text-sm font-medium text-gray-700">Course Units</Label>
          <Input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.units}
            onChange={(e) => setFormData({ ...formData, units: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="course-name" className="text-right">Level Name</Label>
          <Select
          value={formData.level_id}
          onValueChange={(value) => setFormData({ ...formData, level_id: value })}
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
        <div>
          <Label htmlFor="course-name" className="text-right">Instructor</Label>
          <Select
          value={formData.instructor_id}
          onValueChange={(value) => setFormData({ ...formData, instructor_id: value })}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select Instructor" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['Dr Ogunlola'].map((instructor, index) => (
                  <SelectItem key={index} value={instructor}>{instructor}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>*/}

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
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}