import React from 'react';
import { Course } from '@/types/dashboard';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface ProgressSectionProps {
  courses: Course[];
}

/**
 * ProgressSection component displays course progress information
 */
export default function ProgressSection({ courses }: ProgressSectionProps) {
  return (
    <div className="space-y-4">
      {courses.map((course, i) => (
        <div key={i} className="bg-slate-800 rounded-lg p-4 text-white">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-medium">{course.course_code} - {course.title}</h3>
              <p className="text-sm text-gray-300">
                {course.completedProjectCount} / {course.projectCount} projects
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white hover:bg-slate-700"
            >
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
          <Progress 
            value={course.projectCount > 0 ? (course.completedProjectCount / course.projectCount) * 100 : 0} 
            className="h-2 bg-slate-700 [&>div]:bg-gray-300" 
          />
        </div>
      ))}
    </div>
  );
};