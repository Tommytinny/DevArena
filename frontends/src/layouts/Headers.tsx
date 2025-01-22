import { useEffect } from "react";
import { Menu,  Book, Calendar, LayoutDashboard, Settings, User, LogOut, PanelsTopLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@radix-ui/react-navigation-menu"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { HeightIcon, WidthIcon } from "@radix-ui/react-icons"
import { BookOpenCheck } from "lucide-react";
import { X } from "lucide-react"
import { useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation();
    const [ currentPage, setCurrentPage ] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [open, setOpen] = useState(false)
  
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
            setCurrentPage(location.pathname);
    }, [])

    return (
        <div >
            {/* Header */}
            <header 
                className="fixed top-0 left-0 right-0 md:hidden"
                style={{
                    zIndex: 50,
                }}>
            <div className="flex items-center justify-between lg:px-12 px-6 py-4 bg-white shadow z-10">
            <div className="flex items-center">
            
            <Link 
                to="/"
                className="text-red-500 font-bold text-center text-2xl font-sans"
            > DevArena</Link>
            </div>
            <div className="block lg:hidden">
            {isClicked ? 
                <Button variant="ghost" size="icon" onClick={() => setIsClicked(false)}>
                    <X className="text-[#0B1939]" style={{ width: "32px", height: "32px" }} />
                </Button> :   
                <Button variant="ghost" size="icon" onClick={() => setIsClicked(true)}>
                   <Menu  className="text-[#0B1939]" style={{ width: "32px", height: "32px" }} />
                </Button>}
            </div>
            </div>
            </header>
            {isClicked &&
            <div className={`fixed top-[72px] w-full z-50 inset-0 pb-4 text-[#333333] shadow-md transition-all duration-300 lg:hidden`}>
                                <nav className="pt-4 px-4 bg-white">
                                <div className="space-y-4">
                                <Link 
                                    to="/"
                                    className={`flex items-center gap-2  hover:text-red-500 text-lg font-semibold px-4 ${currentPage === '/' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        {isSidebarOpen && <span className="ml-2">Dashboard</span>}
                                    </Link>
                                <Link 
                                    to="/courses"
                                    className={`flex items-center gap-2  hover:text-red-500 text-lg font-semibold px-4 ${currentPage === '/courses' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                                    >
                                        <Book className="w-5 h-5" />
                                        {isSidebarOpen && <span className="ml-2">Courses</span>}
                                    </Link>
                                <Link 
                                    to="/schedule"
                                    className={`flex items-center gap-2  hover:text-red-500 text-lg font-semibold px-4 ${currentPage === '/schedule' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                                    >
                                        <Calendar className="w-5 h-5" />
                                        {isSidebarOpen && <span className="ml-2">Schedules</span>}
                                    </Link>
                                    <Link 
                                    to="/timetable"
                                    className={`flex items-center gap-2  hover:text-red-500 text-lg font-semibold px-4 ${currentPage === '/timetable' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                                    >
                                        <BookOpenCheck className="w-5 h-5" />
                                        {isSidebarOpen && <span className="ml-2">Timetable</span>}
                                </Link>
                                </div>
                                <div className="border-t-2 mt-12 py-6 space-y-2">
                                        <Link 
                                        to="/profile"
                                        className={`flex items-center gap-2  hover:text-red-500 text-lg font-semibold px-4 ${currentPage === '/profile' ? 'text-red-500' : 'text-gray-600 dark:text-slate-400'}`}
                                        >
                                            <User className="w-5 h-5" />
                                            {isSidebarOpen && <span className="ml-2">Profile</span>}
                                        </Link>
                                        <Link 
                                        to="/logout"
                                        className={`flex items-center gap-2  hover:text-red-500 text-lg font-semibold px-4`}
                                        >
                                            <LogOut className="w-5 h-5" />
                                            {isSidebarOpen && <span className="ml-2">Log Out</span>}
                                        </Link>
                                
                                </div>
                                
                                
                                </nav>
                                </div>}
        </div>
        
    )
}