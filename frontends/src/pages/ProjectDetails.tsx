import React, { useEffect, useState } from 'react';
import Theme from '@/theme/theme';
import Header from '@/layouts/Headers';
import Sidebar from '@/layouts/Sidebar';
import ProjectCard from '@/components/Project/ProjectCard';
import TaskList from '@/components/Project/TaskList';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [progress, setProgress] = useState(0);

  // Fetch data for the project
  const fetchProjectData = async (id: string) => {
    try {
      const [projectResponse, resourcesResponse, tasksResponse, submissionResponse] = await Promise.all([
        axiosInstance.get(`/projects/${id}`),
        axiosInstance.get(`/projects/${id}/resources`),
        axiosInstance.get(`/projects/${id}/tasks`),
        axiosInstance.get(`/projects/${id}/submissions`),
      ]);

      setProject({
        ...projectResponse.data,
        resources: resourcesResponse.data,
        tasks: tasksResponse.data.map((task: any) => ({
          ...task,
          submission: submissionResponse.data.filter((sub: any) => sub.task_id === task.id),
        })),
      });

      const current_user = await axiosInstance.get('/users/me');
      const student_Id = current_user.data.id;
      const taskNumber = tasksResponse.data.length;
      const totalPassedTask = submissionResponse.data.filter((sub: any) => sub.student_id === student_Id && sub.project_id === projectId && sub.status === 'passed') 
      const progressCal = 100 / taskNumber * totalPassedTask.length;
      setProgress(progressCal);
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId);
    }
  }, [projectId]);

  return (
    <Theme>
      {({ darkMode, toggleRight, setDarkMode }) => (
        <div className="flex flex-col h-screen bg-[#F5F7FA] dark:bg-slate-800">
                <div className="flex flex-1 lg:overflow-hidden">
                  <Header />
                  <Sidebar darkMode={darkMode} toggleRight={toggleRight} setDarkMode={setDarkMode}/>
            <main className="p-6 px-4 max-w-full w-full lg:overflow-scroll space-y-6 mt-10 lg:mt-0 lg:pr-32">
              {project && (
                <>
                  <ProjectCard project={project} progress={progress} />
                  <TaskList tasks={project.tasks} project_id={projectId}/>
                </>
              )}
            </main>
          </div>
        </div>
      )}
    </Theme>
  );
}
