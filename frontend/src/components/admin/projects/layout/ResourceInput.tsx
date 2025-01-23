import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResourceInputProps {
  index: number;
  onRemove: () => void;
  onChange: (field: string, value: string | any[]) => void;
  values: {
    title: string;
    type: string;
    url: string;
  };
}

export function ResourceInput({ index, onRemove, onChange, values }: ResourceInputProps) {
  const [resourceType, setResourceType] = useState('');

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
      <h3 className="text-lg font-semibold text-gray-900">Resource {index + 1}</h3>
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Resource title
          </Label>
          <Input
            type="text"
            value={values.title}
            onChange={(e) => onChange('title', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter resource title"
          />
        </div>
        <div>
          <Label className="block text-sm font-medium text-gray-700">
            Resource type
          </Label>
          <Select
          value={values.type}
          onValueChange={(value) => {onChange('type', value); setResourceType(value);}}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select resource type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {['link'].map((type, index) => (
                  <SelectItem key={index} value={type}>{type}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
          {resourceType === 'link' ?
          <div>
          <Label className="block text-sm font-medium text-gray-700">
            Resource url
          </Label>
          <Textarea
            value={values.url}
            onChange={(e) => onChange('url', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Enter url to resource"
          />
          </div> : 
          <></>}
      </div>
    </div>
  );
}