import { useLocation } from "react-router-dom";
import { Home, Calendar, Menu, Settings, User, LogOut, ToggleLeft, ToggleRight } from "lucide-react"
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { BookOpen, Trophy, BarChart } from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();
    const [ currentPage, setCurrentPage ] = useState('');

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => setIsClicked(!isClicked)

    useEffect(() => {
        setCurrentPage(location.pathname);
    }, [])

    return (
        <div >
            {/* Sidebar */}
            <aside className={`h-full bg-white dark:text-gray-400 dark:bg-slate-800 text-[#333333] font-mono border-r border-r-[#E6E6E6] dark:border-gray-500 transition-all duration-100 hidden lg:block ${isSidebarOpen ? 'w-52' : 'w-20'}`}>
            <div className={`flex items-center gap-3 ${isSidebarOpen ? 'ml-2': 'ml-6'} pt-4 mb-8 gap-2 `}>
                <Menu className="w-8 h-8 cursor" onClick={toggleSidebar} />
                {isSidebarOpen && <span className="text-red-500 font-bold text-center text-2xl font-sans">
                    DevArena
                </span>}
                
            </div>
            <nav className="relative h-full">
                <div className="absolute inset-x-0 top-0 flex items-center justify-start px-6">
                <div className="space-y-5 mt-6">
                    <Link 
                    className={`flex items-center gap-3  hover:text-red-500  ${currentPage === '/' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                    to="/"
                    onClick={() => setCurrentPage('/dashboard')}
                    >
                         <Home className="w-5 h-5" />{isSidebarOpen && <span className="text-[18px]">Home</span>}
                    </Link>
                    <Link 
                    className={`flex items-center gap-3 hover:text-red-500  ${currentPage === '/courses' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                    to="/courses"
                    >
                         <BookOpen className="w-5 h-5" />{isSidebarOpen && <span className="text-[18px]">Courses</span>}
                    </Link>
                    <Link 
                    className={`flex items-center gap-3 hover:text-red-500  ${currentPage === '/schedule' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                    to="/schedule"
                    >
                         <Calendar className="w-5 h-5" />{isSidebarOpen && <span className="text-[18px]">Schedules</span>}
                    </Link>
                    <Link 
                    className={`flex items-center gap-3 hover:text-red-500  ${currentPage === '/timetable' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                    to="/timetable"
                    >
                         <Calendar className="w-5 h-5" />{isSidebarOpen && <span className="text-[18px]">Timetable</span>}
                    </Link>
                    {/*<Link 
                    className={`flex items-center gap-2 hover:text-red-500  ${currentPage === '/practical-details' ? 'text-red-500' : 'text-gray-600'}`}
                    to="/practical-details"
                    >
                         <Code className="w-5 h-5" />{isSidebarOpen && <span>Projects</span>}
                    </Link>
                    <Link 
                    className={`flex items-center gap-2 hover:text-red-500  ${currentPage === 'achievements' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                    to="/"
                    >
                         <Trophy className="w-5 h-5" />{isSidebarOpen && <span>Achievements</span>}
                    </Link>
                    <Link 
                    className={`flex items-center gap-2 hover:text-red-500  ${currentPage === '/schedule' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                    to="/schedule"
                    >
                         <Calendar className="w-5 h-5" />{isSidebarOpen && <span>Schedule</span>}
                    </Link>
                    <Link 
                    className={`flex items-center gap-2 hover:text-red-500  ${currentPage === 'progress' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                    to="/"
                    >
                         <BarChart className="w-5 h-5" />{isSidebarOpen && <span>Progress</span>}
                    </Link>
                    <Link 
                    className={`flex items-center gap-2 hover:text-red-500  ${currentPage === '/settings' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                    to="/settings"
                    onClick={() => setCurrentPage('settings')}
                    >
                         <Settings className="w-5 h-5" />{isSidebarOpen && <span>Settings</span>}
                    </Link>*/}
                </div>
                </div>
                <div className='absolute inset-x-0 bottom-24'>
                     <div className=' border-t border-gray-300 dark:border-gray-500'>
                        <div className="space-y-6 mt-4 px-6">
                        
                            <Link 
                            className={`flex items-center gap-3 hover:text-red-500  ${currentPage === '/profile' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                            to="/profile"
                            onClick={() => setCurrentPage('/profile')}
                            >
                                <User className="w-5 h-5 border rounded-3xl bg-gray-100 dark:bg-slate-800" />{isSidebarOpen && <span className="text-[18px]">Profile</span>}
                            </Link>
                            <Link 
                                className={`flex items-center gap-3 hover:text-red-500  ${currentPage === '/logout' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                                to="/logout"
                                onClick={() => setCurrentPage('/logout')}
                                > <LogOut className="w-5 h-5" />{isSidebarOpen && <span className="text-[18px]">Log out</span>}
                                </Link>
                        
                        </div>
                     </div>
                </div>
              </nav>
              
            </aside>
        </div>
    )
}