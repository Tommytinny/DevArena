import React, { useState, useEffect } from 'react';
import { Table } from './layout/Table';
import { AddProjectModal } from './layout/AddProjectModal';
import { EditProjectModal } from './layout/EditProjectModal';
import { DeleteProjectModal } from './layout/DeleteProjectModal';
import { Plus } from 'lucide-react';
import { TabsContent } from "@/components/ui/tabs";
import axiosInstance from '@/services/axiosInstance';
import { fetchAllResource } from '@/services/admin/api';

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
    setIsEditModalOpen(true);
  };

  const fetchProject = async () => {
    try {
      const response = await axiosInstance.get('/projects');
      if (response.status === 200) {
        return response.data;
      }
      return []; // Return empty array if response fails
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  };

  const fetchTasks = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/projects/${id}/tasks`);
      if (response.status === 200) {
        const data = response.data;

        // Fetch test cases concurrently for all tasks
        const fullTask = await Promise.all(
          data.map(async (task: any) => {
            try {
              const testCasesResponse = await axiosInstance.get(`/tasks/${task.id}/test_cases`);
              return { ...task, testCases: testCasesResponse.data };
            } catch (error) {
              console.error(`Error fetching test cases for task ${task.id}:`, error);
              return { ...task, testCases: [] }; // Default to empty testCases
            }
          })
        );

        return fullTask;
      }
      return []; // Return empty array if response fails
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  };

  const tasksCount = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/projects/${id}/tasks`);
      if (response.status === 200) {
        return Object.keys(response.data).length;
      }
      return 0; // Return 0 if response fails
    } catch (error) {
      console.error('Error fetching task count:', error);
      return 0;
    }
  };

  const fetchResource = async (projectId: string) => {
    try {
      const resourcesResponse = await axiosInstance.get(`/projects/${projectId}/resources`);
      if (resourcesResponse.status === 200) {
        return resourcesResponse.data;
      }
      return []; // Return empty array if response fails
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    }
  };

  const updatedProjects = async () => {
    try {
      setLoading(true); // Start loading

      const projects = await fetchProject();

      const newProjects = await Promise.all(
        projects.map(async (project: any) => {
          const tasks = await fetchTasks(project.id);
          const resources = await fetchResource(project.id);
          const taskCount = await tasksCount(project.id);

          return {
            ...project,
            tasks,
            resources,
            taskCount,
          };
        })
      );

      setProjects(newProjects); // Update state with enriched projects
      setLoading(false); // Stop loading
    } catch (error) {
      console.error('Error updating projects:', error);
      setLoading(false); // Stop loading even if there's an error
    }
  };

  useEffect(() => {
    updatedProjects(); // Call async function to fetch and update projects
  }, []); // Dependency array remains empty if nothing changes
  

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
          updatedProjects();
        }}
      />

      {selectedProject && (
        <>
          <EditProjectModal
            isOpen={isEditModalOpen}
            onClose={() => {setIsEditModalOpen(false); fetchProject();}}
            project={selectedProject}
            onEdit={handleEditProject}
          />
          <DeleteProjectModal
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              updatedProjects();
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