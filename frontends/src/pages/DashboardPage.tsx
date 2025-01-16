import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import Header from '@/layouts/Headers';
import Sidebar from '@/layouts/Sidebar';
import Theme from '@/theme/theme';
import { useToast } from '@/hooks/use-toast';
import axiosInstance from '@/services/axiosInstance';
import ProjectService from '@/services/projectService';
import { User, Course, Project } from '../types/dashboard';
import CourseCard from '@/components/dashboard/CourseCard';
import ProjectList from '@/components/dashboard/ProjectList';
import ProgressSection from '@/components/dashboard/ProjectSection';
import Loading from '@/components/loading/Loading';


const COLORS = [
  { color: "bg-blue-200" },
  { color: "bg-orange-50" },
  { color: "bg-yellow-50" },
  { color: "bg-red-50" },
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

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data and validate role
        const userResponse = await axiosInstance.get("/users/me");
        const userData = userResponse.data;
        setUser(userData);

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

        for (const course of coursesData) {
          const projectsResponse = await axiosInstance.get(`/courses/${course.id}/projects`);
          const projects = projectsResponse.data;
          let completedCount = 0;

          for (const project of projects) {
            const startDate = new Date(project.start);
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
              const progress = await ProjectService.getProjectProgress(project.id);
              current.push({ ...projectData, progress });
            } else {
              scheduled.push(projectData);
            }
          }
          courseProjects[course.id] = completedCount;
        }

        // Prepare final course data
        const processedCourses = coursesData.map((course: { instructor_id: string; course_code: string; id: string; }) => {
          const instructor = instructors.find((inst: { id: string; }) => inst.id === course.instructor_id);
          const currentCourseProjects = current.filter(
            project => project.code === course.course_code
          );

          return {
            ...course,
            projectCount: currentCourseProjects.length,
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
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loading />
      </div>
    )
  }

  return (
    <Theme>
      {({ darkMode, toggleRight, setDarkMode }) => (
        <div className="flex flex-col h-screen bg-[#F5F7FA] dark:bg-slate-800">
          <div className="flex flex-1 lg:overflow-hidden">
            <Header />
            <Sidebar darkMode={darkMode} toggleRight={toggleRight} setDarkMode={setDarkMode}/>
            <div className="p-6 lg:px-4 px-2 max-w-full w-full lg:overflow-scroll space-y-6 mt-10 lg:mt-0 lg:pr-32">
              <div className="space-y-6 py-4 w-full lg:px-4 px-2">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
                    <p className="dark:text-gray-300">Good Morning, {user?.first_name}!</p>
                  </div>
                  <Badge variant="secondary" className="bg-slate-800 dark:bg-slate-500 hover:bg-slate-700 text-white px-4 py-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Week 1
                  </Badge>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {courses.length > 0 ? (
                    courses.map((course, i) => (
                      <CourseCard 
                        key={course.id} 
                        course={course} 
                        colorClass={COLORS[i % COLORS.length].color} 
                      />
                    ))
                  ) : (
                    <div>No Course is Available</div>
                  )}
                </div>

                {/* Projects and Progress Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                {/* Progress Section */}
                <div>
                  <h2 className="text-xl font-semibold mb-1 dark:text-white">Progress</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div>
                      <ProgressSection courses={courses} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Theme>
  );
};

export default DashboardPage;