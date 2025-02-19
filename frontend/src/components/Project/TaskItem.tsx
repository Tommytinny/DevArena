import React, { useEffect, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import axiosInstance from '@/services/axiosInstance';
import SubmissionModal from './SubmissionModal';
import CheckerModal from './CheckerModal';

export default function TaskItem({ task, projectId }: { task: any, projectId: string }) {
  const [isCheckerModalOpen, setIsCheckerModalOpen] = useState(false);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [taskResult, setTaskResult] = useState(null);
  const [taskData, setTaskData] = useState(task);

  const fetchTaskData = async (project_id: string, task_id: string) => {
    try {
      const [taskResponse, submissionResponse] = await Promise.all([
        axiosInstance.get(`/projects/${project_id}/tasks/${task_id}`),
        axiosInstance.get(`/projects/${project_id}/submissions`),
      ]);

      const submission = submissionResponse.data.filter(
        (sub: any) => sub.task_id === taskResponse.data.id
      );

      const data = { ...taskResponse.data, submission };
      setTaskData(data);
    } catch (error) {
      console.error('Error fetching project data:', error);
      return task;
    }
  };

  const fetchTaskResult = async (task_id: string) => {
    try {
      const response = await axiosInstance.get(`/tasks/${task_id}/test_results`);
      if (response.status === 200) {
        setTaskResult(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    fetchTaskResult(task.id);
    
  }, [task]);

  return (
    <div className="border rounded p-6 mb-4 bg-white ">
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          Task {task.order_index}: {task.name}
        </p>
        {taskData.submission[0] && (
          <Badge
            variant={taskData.submission[0].status === 'passed' ? 'default' : 'destructive'}
            className={taskData.submission[0].status === 'passed' ? 'bg-green-600' : 'bg-red-600'}
          >
            {taskData.submission[0].status}
          </Badge>
        )}
      </div>
      <div className='lg:w-[700px]'>
      <div className="mt-4">
        <p className="text-sm text-gray-600">{task.description}</p>
        <div className="relative mt-2">
            <pre className="bg-[#f1f1f1] border p-4 rounded-md overflow-x-auto">
            <code className="text-sm font-mono">{task.code_output}</code>
            </pre>
        </div>
        <p className="font-normal mt-2">
           {task.instruction}
        </p>
        <div className='flex items-center space-x-4'>
          {/*<Button className="mt-4 bg-[#ff4444] hover:bg-[#ff4444]" onClick={() => setIsCheckerModalOpen(true)}>
            Run Checker
          </Button>*/}
          <Button className="mt-4 border-2 bg-[#ff4444] hover:bg-[#ff4444]" onClick={() => setIsSubmissionModalOpen(true)}>
            Submission
          </Button>
        </div>
        
      </div>
      {isSubmissionModalOpen && <SubmissionModal task={taskData} taskResults={taskResult} projectId={projectId} onClose={() => {setIsSubmissionModalOpen(false);  fetchTaskResult(task.id); fetchTaskData(projectId, task.id)}} />}
      {isCheckerModalOpen && <CheckerModal task={task} taskResults={taskResult} projectId={projectId} onClose={() => setIsCheckerModalOpen(false)} />}
    </div>
    </div>
  );
}
