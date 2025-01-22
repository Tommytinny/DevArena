import { UsersList } from '@/components/Admin/users/Users';
import { LevelsList } from '@/components/Admin/levels/Levels';
import { CoursesList } from '@/components/Admin/courses/Courses';
import { ProjectsList } from '@/components/Admin/projects/Projects';
import { EventsList } from '@/components/Admin/events/Events';
import { TimetablesList } from '@/components/Admin/timetable/Timetable';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"


export default function AdminDashboard() {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="levels">Levels</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="timetables">Timetables</TabsTrigger>
          </TabsList>
          <UsersList />
          <LevelsList />
          <CoursesList />
          <ProjectsList />
          <EventsList />
          <TimetablesList />
        </Tabs>
    </div>
    );
}