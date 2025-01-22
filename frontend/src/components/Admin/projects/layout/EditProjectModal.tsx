import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { TaskInput } from './editComponent/TaskInput';
import { ResourceInput } from './editComponent/ResourceInput';
import axiosInstance from '@/services/axiosInstance';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: any[];
  onEdit: (project: any) => void;
}

export function EditProjectModal({ isOpen, onClose, project, onEdit }: EditProjectModalProps) {
  const [formData, setFormData] = useState(project);

  const removeTask = (taskIndex: number) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter((_, i) => i !== taskIndex),
    });
  };

  const removeResource = (resourceIndex: number) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== resourceIndex),
    });
  };

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
            type="datetime-locals"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.start}
            onChange={(e) => setFormData({ ...formData, start: e.target.value })} 
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="block text-sm font-medium text-gray-700 w-28">Deadline date</Label>
          <Input 
            type="datetime-local"
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
        {formData.resources.map((resource, resourceIndex) => (
          <ResourceInput
          key={resourceIndex}
          index={resourceIndex}
          onRemove={() => removeResource(resourceIndex)}
          onChange={(field, value) => updateResource(resourceIndex, field, value)}
          values={resource}
          />
        ))}
        {formData.tasks.map((task, taskIndex) => (
          <TaskInput
          key={taskIndex}
          index={taskIndex}
          onRemove={() => removeTask(taskIndex)}
          onChange={(field, value) => updateTask(taskIndex, field, value)}
          values={task}
          />
        ))}
        

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