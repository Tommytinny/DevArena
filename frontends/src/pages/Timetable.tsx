import { useState, useEffect } from "react"
import Header from "@/layouts/Headers"
import Sidebar from "@/layouts/Sidebar"
import Loading from "@/components/loading/Loading"
import { Timetable } from "@/components/timetable/Timetable"
import axiosInstance from "@/services/axiosInstance"

interface Timetables {
  id: string;
  course_name: string;
  day: number;
  start_time: number;
  duration: number;
  color: string;
}

const COLORS = [
  { color: "bg-blue-200" },
  { color: "bg-orange-200" },
  { color: "bg-yellow-200" },
  { color: "bg-red-200" },
  { color: "bg-green-200" },
  { color: "bg-purple-200" },
  { color: "bg-indigo-200" },
  { color: "bg-teal-200" },
  { color: "bg-cyan-200" },
];

export default function TimetablePage() {
  const [isLoading, setIsLoading] = useState(true);

  const [timetables, setTimetables] = useState<Timetables[]>([]);
  
  
  
  const fetchTimetable = async () => {
    try {
      const currentUser = await axiosInstance.get('/users/me');
      if (currentUser.status === 200) {
        const userLevel = currentUser.data.level_id
        const response = await axiosInstance.get('/timetables');
        if (response.status === 200) {
          const timetables = response.data;
          timetables.forEach((element: { color: string }, index: number) => {
            element.color = COLORS[index].color
          });
          const timetableData = timetables.filter((t_table: any) => (t_table.level_id === userLevel));
          setTimetables(timetableData);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    setIsLoading(false);
    fetchTimetable();
  }, [])
  return (
    
    <div className="flex flex-col lg:h-screen h-full bg-[#F5F7FA] dark:bg-slate-800">
        <div className="flex flex-1 lg:overflow-hidden">
          <Header />
          <Sidebar />
          {isLoading ? 
            <div className='flex justify-center items-center h-[100vh] w-[100vw]'>
                <Loading type='bars' />
            </div> :
            <div className="p-6 px-1 max-w-full w-full lg:overflow-scroll space-y-6 mt-10 lg:mt-2">
            <div className="container mx-auto lg:pl-4 pt-2">
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Course Timetable</h1>
                    <Timetable timetables={timetables} />
                </div>
        </div>
        </div>
        }
        </div>
        </div>
)
}