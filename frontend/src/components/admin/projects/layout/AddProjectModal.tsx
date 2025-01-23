import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Languages, Plus } from 'lucide-react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaskInput } from './TaskInput';
import { ResourceInput } from './ResourceInput';
import { useToast } from '@/hooks/use-toast';
import type { Course } from '../../courses/Courses';
import axiosInstance from '@/services/axiosInstance';


interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const { toast } = useToast();
  const [courseSelection, setCourseSelection] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseId, setCourseId] = useState('');
  const [lang, setLang] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start: '',
    deadline: '',
    project_type: '',
    project_review: '',
    resources: [
      {
        title: '',
        type: '',
        url: ''
      }
    ],
    tasks: [
      {
        name: '',
        description: '',
        instruction: '',
        points: '',
        order_index: '',
        type: '',
        difficulty: '',
        language: '',
        code_output: '',
        testCases: [
          {
            name: '',
            input: '',
            expected: '',
            errorMessage: '',
            points: '',
            order_index: ''
          }
        ],
      },
    ],
  });

  const addResource = () => {
    setFormData({
      ...formData,
      resources: [
        ...formData.resources,
        {
          title: '',
          type: '',
          url: ''
        },
      ],
    });
  };

  const addTask = () => {
    setFormData({
      ...formData,
      tasks: [
        ...formData.tasks,
        {
          name: '',
          description: '',
          instruction: '',
          points: '',
          order_index: '',
          type: '',
          difficulty: '',
          language: '',
          code_output: '',
          testCases: [
            {
              name: '',
              input: '',
              expected: '',
              errorMessage: '',
              points: '',
              order_index: ''
            }
          ],
        },
      ],
    });
  };


  const removeResource = (resourceIndex: number) => {
    setFormData({
      ...formData,
      resources: formData.resources.filter((_, i) => i !== resourceIndex),
    });
  };

  const removeTask = (taskIndex: number) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter((_, i) => i !== taskIndex),
    });
  };

  const updateResource = (resourceIndex: number, field: string, value: string | any[]) => {
    const newResources = formData.resources.map((resource, i) =>
      i === resourceIndex ? { ...resource, [field]: value } : resource
    );
    setFormData({ ...formData, resources: newResources });
  };

  const updateTask = (taskIndex: number, field: string, value: string | any[]) => {
    const newTasks = formData.tasks.map((task, i) =>
      i === taskIndex ? { ...task, [field]: value } : task
    );
    setFormData({ ...formData, tasks: newTasks });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        // Create project
        const projectResponse = await axiosInstance.post(`/courses/${courseId}/projects`, {
          name: formData.name,
          description: formData.description,
          start: formData.start,
          deadline: formData.deadline,
          project_type: formData.project_type,
          project_review: formData.project_review,
        });
        const project = projectResponse.data;
  
        // Create resource for project
        for (const resource of formData.resources) {
          await axiosInstance.post(`/projects/${project.id}/resources`, {
            title: resource.title,
            type: resource.type,
            url: resource.url
          });
        }
  
        let index = 0;
        // Create tasks and their test cases
        for (const task of formData.tasks) {
          index += 1;
          const taskResponse = await axiosInstance.post(`/projects/${project.id}/tasks`, {
            name: task.name,
            description: task.description,
            instruction: task.instruction,
            points: task.points,
            order_index: index.toString(),
            type: task.type,
            difficulty: task.difficulty,
            language: task.language,
            code_output: task.code_output,
          });

          const taskdata = taskResponse.data;
  
          index = 0
          // Create test cases for this task
          for (const testCase of task.testCases) {
            index += 1
            await axiosInstance.post(`/tasks/${taskdata.id}/test_cases`, {
              name: testCase.name,
              input: testCase.input,
              expected: testCase.expected,
              errorMessage: testCase.errorMessage,
              points: testCase.points,
              order_index: index
            });
          }
        }

        setIsSubmitting(false)
      onClose();
      toast({
        title: "Project Created",
        description: "Project has been successfully created.",
      })
      // Reset form
      setFormData({
        name: '',
        description: '',
        start: '',
        deadline: '',
        project_type: '',
        project_review: '',
        resources: [
          {
            title: '',
            type: '',
            url: ''
          }
        ],
        tasks: [
          {
            name: '',
            description: '',
            instruction: '',
            points: '',
            order_index: '',
            type: '',
            difficulty: '',
            language: '',
            code_output: '',
            testCases: [
              {
                name: '',
                input: '',
                expected: '',
                errorMessage: '',
                points: '',
                order_index: ''
              }
            ],
          },
        ],
      });
   
    } catch (err) {
      return false;
    } 
  };

  const fetchCourse = async () => {
    try {
      const response = await axiosInstance.get('/courses');
      if (response.status === 200) {
        const courses = response.data;
        setCourses(courses);
      }
    } catch (err) {
      return false;
    } 
  };

  useEffect(() => {
    fetchCourse();
  }, []);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Project">
      {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <span className="text-red-600">{error}</span>
          </div>
        )}
      <form onSubmit={handleSubmit} className="space-y-4 grid gap-4 py-4">
        <div className="flex items-center justify-start gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Course</Label>
          <Select
          value={courseId}
          onValueChange={(value) => (setCourseId(value), setCourseSelection(value))}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {courses.map((course, index) => (
                  <SelectItem
                  key={index}
                  value={course.id}
                  >{course.title}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {courseSelection &&
        <>
        <div className="flex items-center gap-4">
          <Label htmlFor="course-name" className="text-left w-28">Project Name</Label>
          <Input 
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
          />
        </div>
        <div className="flex items-center gap-4">
          <Label className="text-left w-28">Project Description</Label>
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
            type="datetime-local"
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
        <div className="flex items-center gap-4">
          <Label className="block text-sm font-medium text-gray-700 w-28">Project Type</Label>
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
          value={lang}
          onValueChange={(value) => setLang(value)}
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
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={addResource}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <Plus size={16} className="mr-1" />
            Add more resource
          </button>
        </div>
        {formData.tasks.map((task, taskIndex) => (
          

          <TaskInput
          key={taskIndex}
          index={taskIndex}
          onRemove={() => removeTask(taskIndex)}
          onChange={(field, value) => updateTask(taskIndex, field, value)}
          values={task}
          language={lang}
          />
        ))}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={addTask}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <Plus size={16} className="mr-1" />
            Add more task
          </button>
        </div>
        </>}
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
            disabled={isSubmitting}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Project'}
          </button>
        </div>
        
      </form>
    </Modal>
  );
}