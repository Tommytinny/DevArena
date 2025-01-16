import React, { useState, useEffect } from 'react';
import { Table } from './layout/Table';
import { AddProjectModal } from './layout/AddProjectModal';
import { EditProjectModal } from './layout/EditProjectModal';
import { DeleteProjectModal } from './layout/DeleteProjectModal';
import { Plus } from 'lucide-react';
import { TabsContent } from "@/components/ui/tabs";
import axiosInstance from '@/services/axiosInstance';

export type Resource = {
  id: string;
  title: string;
  type: string;
  url: string;
}

export type Task = {
  id: string;
  name: string;
  description: string;
  outputCode: string;
  testCases: Array<{
    input: string;
    expected: string;
    errorMessage: string;
  }>;
}

export type Project = {
  id: string;
  name: string;
  description: string;
  start: string;
  deadline: string;
  project_type: string;
  resources: Resource[];
  tasks: Task[];
}
{/*export type Project = {
  id: string;
  title: string;
  course_code: string;
  description: string;
  units: string;
  instructor_id: string;
  level_id: string;
};*/}


export function ProjectsList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  const handleEditProject = (updatedProject: Project) => {
    setProjects(projects.map(project => project.id === updatedProject.id ? updatedProject : project));
    setIsEditModalOpen(false);
  };

  const fetchProject = async () => {
    try {
      const response = await axiosInstance.get('/projects');

      if (response.status === 200) {
        const data = response.data;
        setProjects(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error', error);
    } 
  };

  useEffect(() => {
    fetchProject();
  }, [])

  return (
    <>
    <TabsContent value="projects">
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Project Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Project
          </button>
        </div>
      </div>

      <Table
        projects={projects}
        onEdit={(project) => {
          setSelectedProject(project);
          setIsEditModalOpen(true);
        }}
        onDelete={(project) => {
          setSelectedProject(project);
          setIsDeleteModalOpen(true);
        }}
        loading={loading}
      />

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchProject();
        }}
      />

      {selectedProject && (
        <>
          <DeleteProjectModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              fetchProject();
            }}
            project={selectedProject}
          />
        </>
      )}
    </div>
    </TabsContent>
    </>
  );
}