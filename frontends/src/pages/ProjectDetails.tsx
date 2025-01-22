import React, { useEffect, useState } from 'react';
import Theme from '@/theme/theme';
import Header from '@/layouts/Headers';
import Sidebar from '@/layouts/Sidebar';
import ProjectCard from '@/components/Project/ProjectCard';
import TaskList from '@/components/Project/TaskList';
import { useParams } from 'react-router-dom';
import axiosInstance from '@/services/axiosInstance';
import Loading from '@/components/loading/Loading';

export default function ProjectDetails() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data for the project
  const fetchProjectData = async (id: string) => {
    try {
      const [coursesResponse, projectResponse, resourcesResponse, tasksResponse, submissionResponse] = await Promise.all([
        axiosInstance.get(`/courses/`),
        axiosInstance.get(`/projects/${id}`),
        axiosInstance.get(`/projects/${id}/resources`),
        axiosInstance.get(`/projects/${id}/tasks`),
        axiosInstance.get(`/projects/${id}/submissions`),
      ]);

      const course = coursesResponse.data.filter((course) => course.id === projectResponse.data.course_id);

      setProject({
        ...projectResponse.data,
        courseName: course[0].course_code,
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchProjectData(projectId);
    }
  }, [projectId]);

  return (
        <div className="flex flex-col h-screen bg-[#F5F7FA] dark:bg-slate-800">
                <div className="flex flex-1 lg:overflow-hidden">
                  <Header />
                  <Sidebar />
                  {isLoading ? 
            <div className='flex justify-center items-center h-[100vh] w-[100vw]'>
                <Loading type='bars' />
            </div> :
            <main className="p-6 px-4 max-w-full w-full lg:overflow-scroll space-y-6 mt-10 lg:mt-0 lg:pr-32">
              {project && (
                <>
                  <ProjectCard project={project} progress={progress} />
                  <TaskList tasks={project.tasks} project_id={projectId}/>
                </>
              )}
            </main>}
          </div>
        </div>
  );
}
