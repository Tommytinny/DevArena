import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import Header from '@/layouts/Headers';
import Sidebar from '@/layouts/Sidebar';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/services/axiosInstance';
import ProjectService from '@/services/projectService';
import { User, Course, Project } from '../types/dashboard';
import CourseCard from '@/components/dashboard/CourseCard';
import ProjectList from '@/components/dashboard/ProjectList';
import ProgressSection from '@/components/dashboard/ProjectSection';
import { DashboardPageSkeleton } from '@/components/loading/Skeleton';
import { Events } from '@/components/schedule/Event';
import { Event } from '@/types/schedule';
import { CurrentUserLevel } from '@/services/userService';


export const COLORS = [
  { color: "bg-blue-200" },
  { color: "bg-orange-50" },
  { color: "bg-yellow-50" },
  { color: "bg-red-50" },
  { color: "bg-blue-200" },
  { color: "bg-orange-50" },
];


/**
 * DashboardPage component - Main dashboard view for authenticated users
 */
const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User>();
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentProjects, setCurrentProjects] = useState<Project[]>([]);
  const [scheduledProjects, setScheduledProjects] = useState<Project[]>([]);
  const [selectedDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [levelName, setLevelName] = useState(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchEvents = async () => {
    try {
      const eventResponse = await axiosInstance.get('/events');
      if (eventResponse.status === 200) {
        setEvents(eventResponse.data);
      }
    } catch (error) {
        console.error(error);
    }
  };

  const stringToDate = (stringDate: string) => {
    return new Date(stringDate);
  }

  const selectedEvents = events.filter(event => 
    stringToDate(event.date).getDate() === selectedDate.getDate() &&
    stringToDate(event.date).getMonth() === selectedDate.getMonth() &&
    stringToDate(event.date).getFullYear() === selectedDate.getFullYear()
  )
  

  const getTimeOfDay = () => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      return 'Morning';
    } else if (currentHour >= 12 && currentHour < 17) {
      return 'Afternoon';
    } else if (currentHour >= 17 && currentHour < 21) {
      return 'Evening';
    } else {
      return 'Night';
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data and validate role
        const userResponse = await axiosInstance.get("/users/me");
        const userData = userResponse.data;
        setUser(userData);
        setLevelName(await CurrentUserLevel());

        if (userData.role === "admin" || userData.role === "instructor") {
          navigate("/admin");
          return;
        }

        // Fetch courses and related data
        const [coursesResponse, usersResponse] = await Promise.all([
          axiosInstance.get("/courses"),
          axiosInstance.get("/users")
        ]);

        const coursesData = coursesResponse.data.filter(
          (course: Course) => course.level_id === userData.level_id
        );

        const instructors = usersResponse.data.filter(
          (user: User) => user.role === "instructor"
        );

        // Process courses and projects
        const currentTime = new Date();
        const current: Project[] = [];
        const scheduled: Project[] = [];
        const courseProjects: { [key: string]: number } = {};
        const activeProjectsCount: { [key: string]: number } = {};

        for (const course of coursesData) {
          const projectsResponse = await axiosInstance.get(`/courses/${course.id}/projects`);
          const projects = projectsResponse.data;
          let completedCount = 0;
          let activeProjectCount = 0

          for (const project of projects) {
            const startDate = new Date(project.start);
            const deadline = new Date(project.deadline);
            const isCompleted = await ProjectService.isProjectCompleted(project.id);
            
            if (isCompleted) {
              completedCount++;
            }

            const projectData = {
              ...project,
              code: course.course_code,
              deadline: project.deadline,
              start: project.start
            };
            
            if (startDate <= currentTime) {
              activeProjectCount++;
              if (deadline > currentTime) {
                const progress = await ProjectService.getProjectProgress(project.id);
                current.push({ ...projectData, progress });
              }
            } else {
              scheduled.push(projectData);
            }
          }
          courseProjects[course.id] = completedCount;
          activeProjectsCount[course.id] = activeProjectCount;
        }

        // Prepare final course data
        const processedCourses = coursesData.map((course: { instructor_id: string; course_code: string; id: string; }) => {
          const instructor = instructors.find((inst: { id: string; }) => inst.id === course.instructor_id);
          

          return {
            ...course,
            projectCount: activeProjectsCount[course.id],
            completedProjectCount: courseProjects[course.id],
            instructor_name: instructor
              ? `${instructor.title} ${instructor.first_name} ${instructor.last_name}`
              : "Unknown Instructor",
          };
        });

        setCourses(processedCourses);
        setCurrentProjects(current);
        setScheduledProjects(scheduled);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Unable to load dashboard data. Please try again later.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchEvents();
  }, [navigate, toast]);

  return (
        <div className="flex flex-col h-screen bg-[#F5F7FA] dark:bg-slate-800">
          <div className="flex flex-1 lg:overflow-hidden">
            <Header />
            <Sidebar/>
            {isLoading ? 
            <DashboardPageSkeleton /> :
            <div className="p-6 lg:px-4 px-2 max-w-full w-full lg:overflow-scroll space-y-6 mt-10  lg:mt-0 lg:pr-32">
              <div className="space-y-6 py-4 w-full lg:px-4 px-2">
                {/* Header Section */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
                    <p className="dark:text-gray-300 font-normal">Good {`${getTimeOfDay()}`}, {user?.first_name}!</p>
                  </div>
                  <Badge variant="secondary" className="bg-slate-800 dark:bg-slate-500 hover:bg-slate-700 text-white px-4 py-1 mt-1">
                    {levelName}
                  </Badge>
                </div>

                {/* Course Grid */}
                
                  {courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {courses.map((course, i) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        colorClass={COLORS[i % COLORS.length].color} 
                      />
                    ))}</div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[200px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                      <div className="flex flex-col items-center max-w-md space-y-2">
                        <h3 className="text-xl font-semibold">No Course is Available</h3>
                      </div>
                    </div>
                  )}
                </div>

                {/* Projects and Progress Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:px-4 px-2">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold dark:text-white">Current Projects</h2>
                    </div>
                    <ProjectList projects={currentProjects} type="current" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold dark:text-white">Project Schedule</h2>
                    </div>
                    <ProjectList projects={scheduledProjects} type="scheduled" />
                  </div>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:px-4 px-2">
                {/* Progress Section */}
                <div className='mt-4'>
                  <h2 className="text-xl font-semibold mb-2 dark:text-white ">Progress</h2>
                  
                    <div>
                      {Object.keys(courses).length > 0 ?
                      <div className=" gap-6 mt-2">
                        <ProgressSection courses={courses} />
                      </div>
                      : 
                      <div className="flex flex-col items-center justify-center h-[200px] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                        <div className="flex flex-col items-center max-w-md space-y-2">
                          <h5 className="text-xl font-semibold">No course is available</h5>
                        </div>
                      </div>
                      }
                    </div>
                  </div>

                  {/* Event Section */}
                <div className='mt-4'>
                  <h2 className="text-xl font-semibold mb-2 dark:text-white">Events</h2>
                  
                    <div>
                      <Events 
                          date={selectedDate}
                          events={selectedEvents}
                          height='200px'
                      />
                    </div>
                  </div>
                  </div>
                </div>}
              </div>
            </div>
  );
};

export default DashboardPage;