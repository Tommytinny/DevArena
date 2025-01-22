import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import Header from "@/layouts/Headers";
import Sidebar from "@/layouts/Sidebar";
import axiosInstance from '@/services/axiosInstance';
import { CurrentUserLevel } from '@/services/userService';
import { useToast } from '@/hooks/use-toast';
import CourseItem from '@/components/course/CourseCard';


export type Project = {
  id: string;
  name: string;
}

export type Course = {
  id: string;
  title: string;
  course_code: string
  level: number;
  instructor_id: string;
  description: string;
  instructor_name: string;
  projects: Project[];
};

const COLORS = [
    { color: "bg-blue-200" },
    { color: "bg-orange-50" },
    { color: "bg-yellow-50" },
    { color: "bg-red-50" },
    { color: "bg-blue-200" },
    { color: "bg-orange-50" },
  ];


export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [levelName, setLevelName] = useState(null);
  const { toast } = useToast();

  const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-300 rounded ${className}`} />
  );
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data and validate role
        const userResponse = await axiosInstance.get("/users/me");
        const userData = userResponse.data;
        setLevelName(await CurrentUserLevel());

        // Fetch courses and related data
        const [coursesResponse, usersResponse] = await Promise.all([
          axiosInstance.get("/courses"),
          axiosInstance.get("/users")
        ]);

        const coursesData = coursesResponse.data.filter(
          (course: { level_id: string; }) => course.level_id === userData.level_id

        );


        

        const instructors = usersResponse.data.filter(
          (user: { role: string; }) => user.role === "instructor"
        );

        // Process courses and projects
        const currentTime = new Date();
        const activeProjects: any[] = [];

        for (const course of coursesData) {
          const projectsResponse = await axiosInstance.get(`/courses/${course.id}/projects`);
          const projects = projectsResponse.data;

          for (const project of projects) {
            const startDate = new Date(project.start);
            

            const projectData = {
              ...project,
              code: course.course_code,
            };
            
            if (startDate <= currentTime) {
                activeProjects.push(projectData);
            }
          }
        }

        // Prepare final course data
        const processedCourses = coursesData.map((course: { instructor_id: string; course_code: string; id: string; }) => {
          const instructor = instructors.find((inst: { id: string; }) => inst.id === course.instructor_id);
          

          return {
            ...course,
            projects: activeProjects.filter((project) => project.course_id === course.id),
            instructor_name: instructor
              ? `${instructor.title} ${instructor.first_name} ${instructor.last_name}`
              : "Unknown Instructor",
          };
        });

        setCourses(processedCourses);
      } catch (error) {
        console.error('Error fetching courses data:', error);
        toast({
          title: 'Error',
          description: 'Unable to load course data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);
  

  return (
    <div className="flex flex-col h-screen bg-[#F5F7FA] dark:bg-slate-800">
        <div className="flex flex-1 lg:overflow-hidden">
          <Header />
          <Sidebar />
          
          <div className="p-6 px-1 max-w-full w-full lg:overflow-scroll space-y-6 mt-10 lg:mt-2 lg:pr-32">
            {isLoading ? 
            <div className="space-y-6 py-4 w-full px-4">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-400">My Courses</h1>
                </div>
                <Badge variant="secondary" className="bg-slate-800 dark:bg-slate-500 space-x-2 hover:bg-slate-700 text-white px-4 py-1">
                    <div className='animate-pulse bg-gray-300 rounded h-2 w-2'></div>
                    <div className='animate-pulse bg-gray-300 rounded h-2 w-2'></div>
                    <div className='animate-pulse bg-gray-300 rounded h-2 w-2'></div>
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded border-2 border-gray-300 bg-white p-4">
                  {/* Skeleton for course header */}
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-1/3 mb-4" />
          
                  {/* Skeleton for projects */}
                  <div className="space-y-2">
                    {Array.from({ length: 2 }).map((_, j) => (
                      <div key={j} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-full mb-1" />
                          <Skeleton className="h-4 w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div></div>:
            <div className="space-y-6 py-4 w-full px-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-400">My Courses</h1>
              </div>
              <Badge variant="secondary" className="bg-slate-800 dark:bg-slate-500 hover:bg-slate-700 text-white px-4 py-1">
                  {levelName}
              </Badge>
            </div>
            {Object.keys(courses).length > 0 ?
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
                {courses.map((course, i) => (
                  <CourseItem course={course} color={COLORS[i % COLORS.length].color} />
                ))}
              </div> : 
              <div className="flex flex-col items-center justify-center h-[200px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                <div className="flex flex-col items-center max-w-md space-y-2">
                  <h3 className="text-xl font-semibold">No Course is Available</h3>
                </div>
              </div>
            }</div>}
            </div>
      </div>
      </div>
  )
}