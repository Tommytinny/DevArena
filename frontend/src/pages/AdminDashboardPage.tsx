import { UsersList } from '@/components/admin/users/Users';
import { LevelsList } from '@/components/admin/levels/Levels';
import { CoursesList } from '@/components/admin/courses/Courses';
import { ProjectsList } from '@/components/admin/projects/Projects';
import { EventsList } from '@/components/admin/events/Events';
import { TimetablesList } from '@/components/admin/timetable/Timetable';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';


export default function AdminDashboard() {
    return (
      <div className="container mx-auto p-6">
        <div className='flex justify-between'>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Dashboard</h1>
            <Link 
            className='flex items-center gap-3 hover:text-red-500 text-gray-600 dark:text-slate-400'
            to="/logout"
            > <LogOut className="w-6 h-6" /><span className="text-xl">Log out</span>
            </Link>
        </div>
        
        
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="levels">Levels</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="timetables">Timetables</TabsTrigger>
          </TabsList>
          <UsersList />
          <LevelsList />
          <CoursesList />
          <TimetablesList />
        </Tabs>
    </div>
    );
}