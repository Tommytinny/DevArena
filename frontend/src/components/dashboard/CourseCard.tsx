import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/types/dashboard';

interface CourseCardProps {
  course: Course;
  colorClass: string;
}

/**
 * CourseCard component displays individual course information
 */
export default function CourseCard({ course, colorClass }: CourseCardProps) {
  return (
    <div className={`rounded p-4 ${colorClass} border-2 border-gray-900`}>
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-white rounded-lg">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>
      <h3 className="font-bold mb-1">{course.course_code}</h3>
      <p className="text-md text-gray-600 mb-1 font-semibold">{course.title}</p>
      <p className="text-sm font-bold text-gray-600 mb-4">
        Instructor: <span className='font-semibold'>{course.instructor_name}</span>
      </p>
      <hr className="border-[1px] border-gray-900 my-2"/>
      <div className="flex justify-between items-center">
        <span className="font-bold"></span>
        <div
          className="text-xs px-3 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-gray-50"
        >
          Enrolled
        </div>
      </div>
    </div>
  );
};