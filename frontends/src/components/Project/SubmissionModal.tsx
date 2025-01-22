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
import ReactLoading from "react-loading";
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/services/axiosInstance';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SubmissionModal({ task, taskResults, projectId, onClose }: { task: any; taskResults: any; projectId: string; onClose: () => void }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [failedTest, setFailedTest] = useState(null);
  const [taskData, setTaskData] = useState(task);
  const [taskResult,  setTaskResult] = useState(taskResults);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const { toast } = useToast();


  const fetchTaskData = async (project_id: string, task_id: string) => {
    try {
      const [taskResponse, submissionResponse] = await Promise.all([
        axiosInstance.get(`/projects/${project_id}/tasks/${task_id}`),
        axiosInstance.get(`/projects/${project_id}/submissions`),
      ]);

      const submission = submissionResponse.data.filter(
        (sub: any) => sub.task_id === taskResponse.data.id
      );

      return { ...taskResponse.data, submission };
    } catch (error) {
      console.error('Error fetching project data:', error);
      return task;
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
        setFailedTest(hasFailedTest);
        const updatedTasks = await fetchTaskData(projectId, task_id);
        setTaskData(updatedTasks);
        setIsLoading(false);
      }
    } catch(error) {
      if (error.response) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Encountered error running checker:');
      }
      setIsLoading(false);
    }
  }

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmitFile = async (e: React.FormEvent<HTMLFormElement>, task_id: string, language: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!file) {
      setErrorMessage('Please upload a file!');
      setIsSubmitting(false);
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
        toast({
          title: "Success",
          description: "File submitted successfully",
        });
        const updatedTasks = await fetchTaskData(projectId, task_id);
        setTaskData(updatedTasks);
        setIsSubmitting(false);
        setErrorMessage('');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
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


  const handleSubmitFileUpdate = async (e: React.FormEvent<HTMLFormElement>, submission_id: string, task_id: string, language: string) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!file) {
      setErrorMessage('Please upload a file!');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('language', language);
    formData.append('status', 'pending');
    

    try {
      const submission = await axiosInstance.put(`/submissions/${submission_id}`, formData);
      if (submission.status === 200) {
        const updatedTasks = await fetchTaskData(projectId, task_id);
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

  useEffect(() => {
    if (taskResult && taskResult.length) {
      const hasFailedTest = taskResult.some((test) => test.status === 'failed');
      setFailedTest(hasFailedTest);
    }
  }, [taskResult]);

  

  return (
    <>
    <div>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
            <div className="relative bottom-32 bg-white rounded-lg max-w-lg w-full">
            {taskData.submission[0]  ?
            <div>
              <div className="flex justify-between items-center p-4 border-b">
                <div className='flex justify-center items-center'>
                
                  <h1 className="text-center text-lg font-semibold">Task: {taskData.name}</h1> 
               
                </div>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
                </button>
              </div>
              {taskResult && taskResult.some((res: any) => res.status === 'failed') ? 
                <>
                <div className='flex justify-center items-center my-2'>
                  <div className={showSubmitDialog === false ? "block mx-8" : "hidden mx-8"}>
                    <Alert variant="destructive" className="mb-4">
                      <AlertTitle>Failed Tests</AlertTitle>
                      <AlertDescription>
                        Some tests have failed. Please review and resubmit.
                      </AlertDescription>
                    </Alert>
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
                                      onClick={() => test.status === "failed"}
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
                    <div className="flex items-center justify-center my-4">
                      <div className='block text-center'>
                        <Button className="mt-4 bg-white border-2 text-black hover:bg-white" onClick={() => setShowSubmitDialog(true)}>
                          Submit New File
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
                  
                  {showSubmitDialog && (
                    <div className="">
                      <h3 className="text-md font-medium mb-2 text-center">Submit New File</h3>
                      <form key={task.id} onSubmit={(e) => handleSubmitFileUpdate(e, taskData.submission[0].id, task.id, task.language)} className="m-8 space-y-4 grid gap-4 py-4">
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
                        <Button className="bg-[#ff4444] rounded-[3px]" type='submit' disabled={isSubmitting}>
                            {isSubmitting ? 
                            <div className="flex justify-center items-center">
                                <ReactLoading type="bubbles" color="#EF4444" height={100} width={50} />
                            </div> : "Submit"}
                        </Button>
                      </form>
                    </div>
                  )}
                </>
               : <>{taskData.submission[0].status !== "pending"  ?   
                <>
                <div className='my-2 mx-6'>
                  <div className='flex items-center'>

                  <Alert variant="default" className="mb-4 text-green-600">
                    <AlertTitle>All Tests Passed!</AlertTitle>
                    <AlertDescription>Your submission has passed all tests.</AlertDescription>
                  </Alert>
                  </div>
                  <div className="my-4 mx-6">
                      <h4 className="font-semibold mb-2">Requirements:</h4>
                      <ul className="space-y-2">
                        {taskResult.map((test, index) => (
                          <div key={index}>
                      
                          <li className="flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          <span 
                              className=""
                          >
                              {test.name}
                          </span>
                      </li>
                          </div>                
                          ))}
                          
                          
                        
                      </ul>
                    </div> 
               
                </div>
                </> : 
                <div className='my-6'>
                  <div className='flex justify-center items-center'>
                    <h1 className="text-center text-lg font-semibold">Automated Code Checker </h1> 
                  </div>
                  <div className="flex items-center justify-center mt-4">
                    <div className='block text-center'>
                    {isLoading && 
                            <div className='flex justify-center items-center'>
                              <ReactLoading type="bubbles" color="#EF4444" height={100} width={50} />
                              
                              </div>}
                    <Button disabled={isLoading} className={isLoading ? "hidden" : "bg-[#ff4444] rounded-[3px]"} onClick={() => {handleRunChecker(taskData.id, taskData.language, taskData.submission[0].id); setIsLoading(true)}}>
                          Run Checker
                    </Button>
                    </div>
                  </div>
                  </div>
                }</>
              }
                </div> :
                <>
                <div className="flex justify-between items-center p-4 border-b">
                  <div className='flex justify-center items-center'>
                  
                    <h1 className="text-center text-lg font-semibold">Task: {taskData.name}</h1> 
                
                  </div>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                  </button>
                </div>
                <form key={task.id} onSubmit={(e) => handleSubmitFile(e, task.id, task.language)} className="m-8 space-y-4 grid gap-4 py-2">
                  <h1 className='text-center text-lg font-semibold'>Code Submission</h1>
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
                    </>}
            </div>
        </div>
      </div>
    </div>
    </>
  );
}
