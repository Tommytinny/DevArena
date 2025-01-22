import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '@/types/dashboard';
import { calculateTimeRemaining, formatTime } from '@/utils/dateUtils';

interface ProjectListProps {
  projects: Project[];
  type: 'current' | 'scheduled';
}

/**
 * ProjectList component displays a list of current or scheduled projects
 */
export default function ProjectList({ projects, type }: ProjectListProps) {
  const getTimeDisplay = (project: Project) => {
    const time = calculateTimeRemaining(type === 'current' ? project.deadline : project.start);
    if (time.days > 0) return `${time.days} days`;
    if (time.hrs > 0) return `${time.hrs} hours`;
    return `${time.mins} minutes`;
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
        <div className="flex flex-col items-center max-w-md space-y-2">
          <h3 className="text-xl font-semibold">No {type === 'current' ? 'Current' : 'Scheduled'} Projects</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project, i) => (
        <Link 
          key={i}
          to={type === 'current' ? `/projects/${project.id}` : '#'}
          className={type === 'current' ? '' : 'pointer-events-none'}
        >
          <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 border dark:border-slate-700 border-slate-300">
            <div className="flex items-center gap-4">
              <div>
                <div className="font-medium dark:text-white">{project.code} - {project.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  <span className={type === 'current' ? "text-red-600 dark:text-red-400" : "text-gray-600 dark:text-gray-400"}>
                    {type === 'current' ? 'Deadline' : 'Start'}
                  </span>
                  : in {getTimeDisplay(project)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                {type === 'current' && (
                  <div className="font-medium dark:text-white">{project.progress}% Complete</div>
                )}
                <div className="text-sm text-gray-500 dark:text-gray-300">
                  {formatTime(type === 'current' ? project.deadline : project.start)}
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};