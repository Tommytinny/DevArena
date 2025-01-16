import React from 'react';
import { Plus, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TestCaseInput } from './TestCaseInput';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskInputProps {
  index: number;
  onRemove: () => void;
  onChange: (field: string, value: string | any[]) => void;
  values: {
    name: string;
    description: string;
    instruction: string,
    points: string,
    order_index: string,
    type: string,
    difficulty: string,
    language: string,
    code_output: string,
    testCases: Array<{
      name: string;
      input: string;
      expected: string;
      errorMessage: string;
      points: string;
      order_index: string;
    }>;
  };
  language: string;
}

export function TaskInput({ index, onRemove, onChange, values, language }: TaskInputProps) {
  
  const addTestCase = () => {
    onChange('testCases', [
      ...values.testCases,
      { input: '', expected: '', errorMessage: '' },
    ]);
  };

  const removeTestCase = (testCaseIndex: number) => {
    onChange(
      'testCases',
      values.testCases.filter((_, i) => i !== testCaseIndex)
    );
  };

  const updateTestCase = (testCaseIndex: number, field: string, value: string) => {
    const newTestCases = values.testCases.map((testCase, i) =>
      i === testCaseIndex ? { ...testCase, [field]: value } : testCase
    );
    onChange('testCases', newTestCases);
  };


  return (
    <div className="space-y-6 rounded-lg relative">
      <hr />
      <button
        onClick={onRemove}
        className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
        type="button"
      >
        <X size={20} />
      </button>
      <h3 className="text-lg font-semibold text-gray-900">Task {index + 1}</h3>
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Task Name
          </Label>
          <Input
            type="text"
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter task name"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Task Description
          </Label>
          <Textarea
            value={values.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Enter task description"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Task Instruction
          </Label>
          <Textarea
            value={values.instruction}
            onChange={(e) => onChange('instruction', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Enter task instruction"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Output Code Template
          </Label>
          <Textarea
            value={values.code_output}
            onChange={(e) => onChange('code_output', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 font-mono"
            rows={4}
            placeholder="Enter output code template"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Task Points
          </Label>
          <Select
          value={values.points}
          onValueChange={(value) => onChange('points', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select task points" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['10'].map((point, index) => (
                  <SelectItem key={index} value={point}>{point}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Task Difficulty
          </Label>
          <Select
          value={values.difficulty}
          onValueChange={(value) => onChange('difficulty', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select task difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['Beginner', 'Advanced'].map((difficulty, index) => (
                  <SelectItem key={index} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 w-28">Task Review Type</Label>
          <Select
          value={values.type}
          onValueChange={(value) => onChange('type', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select review type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['Manual', 'Auto'].map((type, index) => (
                  <SelectItem key={index} value={type}>{type}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700 w-28">Task language</Label>
          <Select
          value={values.language}
          onValueChange={(value) => onChange('language', value)}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select review type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['Python', 'C', 'C++'].map((language, index) => (
                  <SelectItem key={index} value={language}>{language}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between gap-4 mt-10">
            <h4 className="font-medium text-gray-700">Test Cases</h4>
            <button
              type="button"
              onClick={addTestCase}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={16} className="mr-1" />
              Add New Test Case
            </button>
          </div>
          
          {values.testCases.map((testCase, testCaseIndex) => (
            <TestCaseInput
              key={testCaseIndex}
              index={testCaseIndex}
              taskIndex={index}
              onRemove={() => removeTestCase(testCaseIndex)}
              onChange={(field, value) => updateTestCase(testCaseIndex, field, value)}
              values={testCase}
            />
          ))}
        </div>
      </div>
    </div>
  )
}