import { useState, useEffect } from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { Link } from 'react-router-dom';
import Header from "@/layouts/Headers";
import Sidebar from "@/layouts/Sidebar";
import axiosInstance from '@/services/axiosInstance';
import Loading from '@/components/loading/Loading';


interface Project {
  id: string;
  name: string;
}
interface Course {
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
  const [errors, setErrors] = useState(String)
  const [currentUser, setCurrentUser] = useState({})
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data and validate role
        const userResponse = await axiosInstance.get("/users/me");
        const userData = userResponse.data;
        setCurrentUser(userData);

        // Fetch courses and related data
        const [coursesResponse, usersResponse] = await Promise.all([
          axiosInstance.get("/courses"),
          axiosInstance.get("/users")
        ]);

        const coursesData = coursesResponse.data.filter(
          (course) => course.level_id === userData.level_id

        );


        

        const instructors = usersResponse.data.filter(
          (user) => user.role === "instructor"
        );

        // Process courses and projects
        const currentTime = new Date();
        const activeProjects: any[] = [];
        const activeProjectsCount: { [key: string]: number } = {};

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
            projectCount: activeProjectsCount[course.id],
            projects: activeProjects.filter((project) => project.course_id === course.id),
            instructor_name: instructor
              ? `${instructor.title} ${instructor.first_name} ${instructor.last_name}`
              : "Unknown Instructor",
          };
        });

        setCourses(processedCourses);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
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
            {isLoading ? 
            <div className='flex justify-center items-center h-[100vh] w-[100vw]'>
                <Loading type='bars' />
            </div> :
            <div className="p-6 px-1 max-w-full w-full lg:overflow-scroll space-y-6 mt-10 lg:mt-2 lg:pr-32">
    <div className="space-y-6 py-4 w-full px-4">
    <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-400">My Courses</h1>
        </div>
        {/*<Badge variant="secondary" className="bg-slate-800 dark:bg-slate-500 hover:bg-slate-700 text-white px-4 py-1">
            <Calendar className="w-4 h-4 mr-2" />
            Week 1
        </Badge>*/}
      </div>
      
        {Object.keys(courses).length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        {courses.map((course, i) => (
          <div>
          <div key={i} className={`rounded border-2 border-gray-300 pb-1 bg-white`}>
            
              <Accordion type="single" defaultValue="1" collapsible={true} className="w-full">
                <AccordionItem value="1" className="">
                  <AccordionTrigger className={`flex justify-between items-start p-4 border-b-2 border-gray-300 ${COLORS[i].color}`}>
                    <div className='text-left'>
                      <h3 className="font-semibold">{course.course_code} - {course.title}</h3>
                      <p className="text-sm text-gray-600 font-bold">Instructor: <span className='font-semibold text-gray-900'>{course.instructor_name}</span></p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='pb-0'>
                    {Object.keys(course.projects).length > 0 ? course.projects.map((project, i) => (
                        <Link 
                        key={i}
                        to={`/projects/${project.id}` }>                        
                      <div
                        className="flex items-center justify-between bg-white border-b border-gray-200 p-4"
                      >
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
                      </Link>
                    )) : <div className='flex items-center justify-center py-10 bg-white'>
                    <div className='font-semibold'>No Project is Available</div>
                </div>}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

            </div>
          </div>
          
        ))} </div> : 
        <div className="flex flex-col items-center justify-center h-[200px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
          <div className="flex flex-col items-center max-w-md space-y-2">
            <h3 className="text-xl font-semibold">No Course is Available</h3>
          </div>
        </div>
        }
      
      
    </div>
    </div>}
    </div>
    </div>
  )
}