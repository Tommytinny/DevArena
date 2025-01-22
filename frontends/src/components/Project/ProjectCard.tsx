import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Clock, BarChart2 } from 'lucide-react';

export default function ProjectCard({ project, progress }: { project: any, progress: number }) {

  return (
    <Card className="rounded-[2px] mt-6 lg:mt-1">
      <div className='lg:w-[700px]'>
        <CardHeader className="md:flex md:flex-row  justify-start space-y-0">
          <div className="flex">
            <div className='flex items-start justify-start'>
              <div className="bg-red-100 rounded-lg text-2xl">
                📝
              </div>
            </div>
            <div className='flex items-center ml-4'>
                <CardTitle className="text-2xl">{project.courseName} - {project.name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            <div className="md:flex block gap-6 text-sm text-gray-500 mb-6">
                <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Deadline: {project.deadline}</span>
                </div>
                <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                <span>{progress}% Complete</span>
                </div>
            </div>
            <div className="mb-6">
                <h3 className="text-sm font-bold mb-2 ">Description:</h3>
                <p className="text-gray-600 mb-6">
                    {project.description}
                </p>
            </div>
            <div className="mb-6">
                <h3 className="text-sm font-bold mb-2">Resources:</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                {project.resources.map((resource: { url: string; title: string; }) => (
                    <>
                    <li>
                        <a href={resource.url} className='underline text-blue-500'>{resource.title}</a>
                    </li>
                    </>
                ))}
                </ul>
            </div>
        </CardContent>
        </div>
    </Card>
  );
}
