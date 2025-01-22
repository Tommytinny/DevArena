import { useState, useEffect } from "react";
import Header from "@/layouts/Headers";
import Sidebar from "@/layouts/Sidebar";
import { Calendar } from "@/components/schedule/Calendar";
import { Events } from "@/components/schedule/Event";
import { Event } from "@/types/schedule";
import axiosInstance from "@/services/axiosInstance";
import { SchedulePageSkeleton } from "@/components/loading/Skeleton";


export default function Schedule() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  

  const fetchEvents = async () => {
    try {
      const currentUser = await axiosInstance.get('/users/me');
      if (currentUser.status === 200) {
        const userLevel = currentUser.data.level_id
        const eventResponse = await axiosInstance.get('/events');
        if (eventResponse.status === 200) {
          const events = eventResponse.data.filter((event: any) => (event.level_id === userLevel))
          setEvents(events);
        }
      }
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [])

  const stringToDate = (stringDate: string) => {
    return new Date(stringDate);
  }


  const selectedEvents = events.filter(event => 
    stringToDate(event.date).getDate() === selectedDate.getDate() &&
    stringToDate(event.date).getMonth() === selectedDate.getMonth() &&
    stringToDate(event.date).getFullYear() === selectedDate.getFullYear()
  )

  return (
    
    <div className="flex flex-col h-screen bg-[#F5F7FA] dark:bg-slate-800">
        <div className="flex flex-1 lg:overflow-hidden">
          <Header />
          <Sidebar />
          
            <div className="p-6 px-1 max-w-full w-full lg:overflow-scroll space-y-6 mt-10 lg:mt-2">
            <div className="container mx-auto lg:pl-4 px-2 mt-2 pt-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Schedules & Events</h1>
            {isLoading ? 
            <SchedulePageSkeleton /> :
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Calendar 
                events={events}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
            />
            <Events 
                date={selectedDate}
                events={selectedEvents}
                height='500px'
            />
            </div>}
            </div>
        </div>
        </div>
    </div>
)
}