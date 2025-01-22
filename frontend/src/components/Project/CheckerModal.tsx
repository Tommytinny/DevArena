import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from '../ui/badge';
import axiosInstance from '@/services/axiosInstance';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CheckerModal({ task, taskResults, projectId, onClose, }: { task: any; taskResults: any; projectId: string; onClose: () => void }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [failedTest, setFailedTest] = useState(null);
  const [selectedRequirement, setSelectedRequirement] = useState({});
  const [taskData, setTaskData] = useState(task);
  const [taskResult,  setTaskResult] = useState(taskResults);

  useEffect(() => {
    console.log(taskResults);
  }, []);


  const fetchTaskData = async (project_id: string, task_id: string) => {
    try {
      const [taskResponse, submissionResponse] = await Promise.all([
        axiosInstance.get(`/projects/${project_id}/tasks/${task_id}`),
        axiosInstance.get(`/projects/${project_id}/submissions`),
      ]);

      return {
          ...taskResponse.data,
          submission: submissionResponse.data.filter((sub: any) => sub.task_id === taskResponse.id)
        };
    } catch (error) {
      console.error('Error fetching project data:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleRunChecker = async (task_id: string, language: string, submission_id: string) => {
    setIsLoading(true);

    const data = {
      'language': language,
      'project_id': projectId
    };
    try {
      const response = await axiosInstance.post(`/tasks/${task_id}/submissions/${submission_id}`, data);
      if (response.status == 201) {
        setTaskResult(response.data);
        const hasFailedTest = response.data.some((test: { status: string; }) => test.status === 'failed');
        console.log(hasFailedTest);
        setFailedTest(hasFailedTest);
        const updatedTasks = await fetchTaskData(projectId, task_id);
        console.log(updatedTasks);
        setTaskData(updatedTasks);
        setTaskResult(response.data);
      }

      console.log(response.data);
      setIsLoading(false);

    } catch(error) {
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Encountered error running checker:');
      }
      setIsLoading(false);
    }
  }

  const handleSubmitFile = async (e: React.FormEvent<HTMLFormElement>, task_id: string, language: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!file) {
      setErrorMessage('Please upload a file!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    formData.append('task_id', task_id);
    formData.append('language', language);
    formData.append('status', 'pending');
    formData.append('passed_tests', '0');
    formData.append('score', '0');



    try {
      const submission = await axiosInstance.post('/submissions', formData);
      if (submission.status === 201) {
        const updatedTasks = await fetchTaskData(projectId, task_id);
        console.log(updatedTasks);
        setTaskData(updatedTasks);
        setIsSubmitting(false);
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Encountered error submitting file:');
      }
      setIsSubmitting(false);
    }
  }

  return (
    <>

    <div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-5 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white rounded-lg max-w-lg w-full">
            {taskData.submission[0] && !taskResult ?

            <>
              <div className="flex justify-between items-center p-4 border-b">
                <div className='flex justify-center items-center'>
                
                  <h1 className="text-center text-lg font-semibold">Automated Code Checker </h1> 
               
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
                </button>
              </div>
              {isLoading ? 
                <div className="m-4 grid gap-4 py-2">
                <div className="flex items-center justify-center gap-4">
                    <div className='block text-center'>
                      <div className="flex justify-center items-center">
                          <LoaderCircle className="h-4 w-4 animate-spin" />Checking Code...
                      </div>
                    </div>
                </div>
                </div>
               : 
                <div className="m-4 grid gap-4 py-2">
                  {errorMessage && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                        <span className="text-red-600">{errorMessage}</span>
                    </div>
                )}
                <div className="flex items-center justify-center gap-4">
                    <div className='block text-center'>
                    <Button className="bg-[#ff4444] rounded-[3px]" onClick={() => handleRunChecker(task.id, task.language, task.submission[0].id)}>
                         Run Checker
                    </Button>
                    </div>
                </div>
                </div>
               } 
                </> :
                <>
                  
                  {taskResult[0] ? 
                    <div>
                      <div className="flex justify-between items-center p-4 border-b">
                      <div className='flex justify-center items-center'>
                        <h3 className="text-lg font-medium">Result for {task.name}</h3>
                      </div>
                      <div className='flex items-center space-x-4'>
                      {task.submission[0] && (
                        <Badge
                          variant={task.submission[0].status === 'passed' ? 'default' : 'destructive'}
                          className={task.submission[0].status === 'passed' ? 'bg-green-600' : 'bg-red-600'}
                        >
                          {task.submission[0].status}
                        </Badge>
                      )}
                      <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                      <X className="h-5 w-5" />
                      </button>
                      </div>
                      </div> 
                    <div className="my-4 mx-6">
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="space-y-2">
                      <Accordion type="single" collapsible className="w-full">
                        {taskResult.map((test, index) => (
                          <div key={index}>
                          {test.actual_output ?
                          <AccordionItem value={`task-${index}`} className="border-none">
                              <AccordionTrigger className="py-1">
                              <li className="flex items-center">
                                  {test.status === "passed" ? (
                                      <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                                  ) : (
                                      <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                                  )}
                                  <span 
                                      className={test.status === "failed" ? "text-yellow-700 cursor-pointer hover:underline" : ""}
                                      onClick={() => test.status === "failed" && setSelectedRequirement(test)}
                                  >
                                      {test.name}
                                  </span>
                              </li>
                              </AccordionTrigger> 
                              <AccordionContent>
                                <div className="">
                                    <>
                                    <Alert variant="destructive" className="mt-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>
                                      {test.actual_output}
                                    </AlertDescription>
                                    </Alert>
                                    </> 
                                </div>
                              </AccordionContent>               
                          </AccordionItem>
                          
                          : 
                          <li className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span 
                              className=""
                          >
                              {test.name}
                          </span>
                      </li>}

                          </div>                
                          ))}
                          
                          </Accordion>
                          
                        
                      </ul>
                    </div> 
                    {failedTest && (
                            <form key={task.id} onSubmit={(e) => handleSubmitFile(e, task.id, task.language)} className="m-8 space-y-4 grid gap-4 py-4">
                              {errorMessage && (
                                  <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                                      <span className="text-red-600">{errorMessage}</span>
                                  </div>
                              )}
                              <div className="flex items-center gap-4">
                                  <Label htmlFor="course-name" className="text-left w-28">File Upload: </Label>
                                  <Input 
                                  type="file"
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                  name='file'
                                  onChange={handleFileChange}
                                  />
                              </div>
                              <Button className="bg-[#ff4444] rounded-[3px]" type='submit'>
                                  {isSubmitting ? 
                                  <div className="flex justify-center items-center">
                                      <LoaderCircle className="h-4 w-4 animate-spin" />Submitting...
                                  </div> : "Submit"}
                              </Button>
                              </form>
                            )}
                    </div>
                    : <>
                    <div className="flex justify-between items-center p-4 border-b">
                        <div className='flex justify-center items-center'>
                        <h3 className="text-lg font-medium">Automated Code Checker for {task.name}</h3>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                        <X className="h-5 w-5" />
                        </button>
                  </div>
                  <>
                    <Alert variant="default" className="mb-4">
                      <AlertTitle>All Tests Passed!</AlertTitle>
                      <AlertDescription>Your submission has passed all tests.</AlertDescription>
                    </Alert>
                  </>
                    </>}
                    </>}
            </div>
        </div>
      </div>
    </div>
    </>
  );
}
