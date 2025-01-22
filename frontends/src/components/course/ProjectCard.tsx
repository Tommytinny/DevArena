import type { Course, Project } from "@/pages/CoursesPage"

interface ProjectItemProps {
  course: Course;
  project: Project;
}

export default function ProjectItem({course, project}: ProjectItemProps) {
  return (
    <div className="flex items-center justify-between bg-white border-b border-gray-200 p-4">
    <div className="flex items-center gap-4">
      <div className="p-2 bg-gray-100 rounded-lg">
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
        <div>
          <div className="font-semibold"><span className='text-red-500'>{course.course_code}</span> - {project.name}</div>
        </div>
    </div>
    <div className="flex items-center gap-4">
        <div className="text-right">
        <div className="font-medium"></div>
        </div>
    </div>
    </div>
  )
}