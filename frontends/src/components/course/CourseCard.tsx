import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import type { Course } from "@/pages/CoursesPage";
import ProjectItem from "./ProjectCard";


interface CourseItemProps {
  course: Course;
  color: string;
}

export default function CourseItem({ course, color }: CourseItemProps) {
  return (
    <div className={`rounded border-2 border-gray-300 pb-1 bg-white`}>
      <Accordion type="single" defaultValue="1" collapsible className="w-full">
        <AccordionItem value="1">
          <AccordionTrigger className={`flex justify-between items-start p-4 border-b-2 border-gray-300 ${color}`}>
            <div className="text-left">
              <h3 className="font-semibold">{course.course_code} - {course.title}</h3>
              <p className="text-sm text-gray-600 font-bold">
                Instructor: <span className="font-semibold text-gray-900">{course.instructor_name}</span>
              </p>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-0 ">
            {course.projects.length > 0 ? (
              course.projects.map((project, i) => (
                <Link key={i} to={`/projects/${project.id}`}>
                  <ProjectItem course={course} project={project} />
                </Link>
              ))
            ) : (
                <div className="flex flex-col items-center justify-center border-none bg-muted/30 rounded-lg  p-8 text-center">
                  <div className="flex flex-col items-center max-w-md space-y-2">
                    <h5 className="text-md font-semibold">No project is available</h5>
                  </div>
                </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
};
  