import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Project } from '../../../../../components/Admin/components/projects/Projects';
import { LoaderPinwheel } from 'lucide-react';
import type { Resource } from '../../../../../components/Admin/components/projects/Projects';
import type { Task } from '../../../../../components/Admin/components/projects/Projects';
import axiosInstance from '@/services/axiosInstance';


interface TableProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  loading: boolean;
}

export type NewProject = {
  id: string;
  name: string;
  description: string;
  start: string;
  deadline: string;
  project_type: string;
  resources: Resource[];
  tasks: Task[];
  task: number;
}

export function Table({ projects, onEdit, onDelete, loading }: TableProps) {
  const [updatedProjects, setUpdatedProjects] = useState<NewProject[]>([])


  useEffect(() => {
    const fetchTasks = async (id: string) => {
      try {
        const response = await axiosInstance.get(`/projects/${id}/tasks`);
  
        if (response.status === 200) {
          const data = response.data;
          return data
        }
      } catch (error) {
        console.error('Error', error);
      } 
    }

    const setProjects = async (projects: Project[]) => {
      const newProjects = await Promise.all(
        projects.map(async (project) => ({
          ...project,
          task: Object.keys(await fetchTasks(project.id)).length,
        }))
      );
      setUpdatedProjects(newProjects);
    };
  
    setProjects(projects);
  }, [projects]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
            <th className="text-left px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody style={{ position: "relative" }} className="bg-white divide-y divide-gray-200">
          {loading ?
          <tr>
            <td colSpan={5} style={{ position: "relative", height: "100px" }}>
              <div className='flex justify-center items-center gap-2'>
                <LoaderPinwheel className="h-4 w-4 animate-spin" />
                <span>Loading projects</span>
              </div>
            </td>
          </tr>
            :
          Object.keys(updatedProjects).length < 1 ?
          <tr>
            <td colSpan={5} style={{ position: "relative", height: "100px" }}>
              <div className='flex justify-center'>
                <span className='font-semibold'>No available project</span>
              </div>
              
            </td>
          </tr> : updatedProjects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{project.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{project.task}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{project.project_type}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{project.deadline}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(project)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(project)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}