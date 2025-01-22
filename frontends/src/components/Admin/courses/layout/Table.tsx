import React, { useEffect, useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Course } from '../Courses';
import { LoaderCircle } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance';

interface TableProps {
  courses: null;
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
  loading: boolean;
}


export type NewCourse = {
  id: string;
  title: string;
  course_code: string;
  description: string;
  units: string;
  instructor_id: string;
  level_id: string;
  level: string;
  instructor: string;
  project_no: string;
};

export function Table({ courses, onEdit, onDelete, loading }: TableProps) {


  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Code</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Projects</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">levels</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor in Charge</th>
            <th className="text-left px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody style={{ position: "relative" }} className="bg-white divide-y divide-gray-200">
          {loading ?
          <tr>
            <td colSpan={5} style={{ position: "relative", height: "100px" }}>
              <div className='flex justify-center items-center gap-2'>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Loading courses</span>
              </div>
            </td>
          </tr>
            :
          Object.keys(courses).length < 1 ?
          <tr>
            <td colSpan={5} style={{ position: "relative", height: "100px" }}>
              <div className='flex justify-center'>
                <span className='font-semibold'>No available course</span>
              </div>
              
            </td>
          </tr> : courses.map((course, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{course.course_code}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{course.project_no}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{course.level} semester</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{course.instructor}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(course)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(course)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}