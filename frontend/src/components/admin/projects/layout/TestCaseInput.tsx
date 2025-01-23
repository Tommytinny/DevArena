import React from 'react';
import { X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


interface TestCaseInputProps {
  index: number;
  taskIndex: number;
  onRemove: () => void;
  onChange: (field: string, value: string) => void;
  values: {
    name: string;
    input: string;
    expected: string;
    errorMessage: string;
    points: string;
    order_index: string;
  };
}

export function TestCaseInput({ index, taskIndex, onRemove, onChange, values }: TestCaseInputProps) {
  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg relative">
      <button
        onClick={onRemove}
        className="absolute right-2 top-2 text-gray-500 hover:text-red-500"
        type="button"
      >
        <X size={20} />
      </button>
      <h4 className="font-medium text-gray-700">Test Case {index + 1}</h4>
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Name
          </Label>
          <Input
            type="text"
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter test case name"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Input
          </Label>
          <Textarea
            value={values.input}
            onChange={(e) => onChange('input', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={2}
            placeholder="Enter test case input"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Expected Output
          </Label>
          <Textarea
            value={values.expected}
            onChange={(e) => onChange('expected', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={2}
            placeholder="Enter expected output"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Error Message
          </Label>
          <Input
            type="text"
            value={values.errorMessage}
            onChange={(e) => onChange('errorMessage', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter error message for failed test"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Points
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
                {['1', '2', '3', '4', '5'].map((point, index) => (
                  <SelectItem key={index} value={point}>{point}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}