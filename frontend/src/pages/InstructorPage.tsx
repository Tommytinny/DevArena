import { ProjectsList } from '@/components/instructor/projects/Projects';
import { EventsList } from '@/components/instructor/events/Events';
import { TimetablesList } from '@/components/instructor/timetable/Timetable';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';


export default function InstructorDashboard() {
    return (
      <div className="container mx-auto p-6">
        <div className='flex justify-between'>
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Instructor Dashboard</h1>
            <Link 
            className='flex items-center gap-3 hover:text-red-500 text-gray-600 dark:text-slate-400'
            to="/logout"
            > <LogOut className="w-6 h-6" /><span className="text-xl">Log out</span>
            </Link>
        </div>
        
        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>
          <ProjectsList />
          <EventsList />
          <TimetablesList />
        </Tabs>
    </div>
    );
}