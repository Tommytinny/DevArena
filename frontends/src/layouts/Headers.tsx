import { Menu,  Book, Calendar, LayoutDashboard, Settings, User, PanelsTopLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "@radix-ui/react-navigation-menu"
import { Button } from "@/components/ui/button"
import { useState } from 'react'
import { Link } from 'react-router-dom';
import { HeightIcon, WidthIcon } from "@radix-ui/react-icons"

export default function Header() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [open, setOpen] = useState(false)
  
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
    const [isClicked, ] = useState(false);

    return (
        <div >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 md:hidden">
            <div className="flex items-center justify-between lg:px-12 px-6 py-4 bg-white shadow z-10">
            <div className="flex items-center">
            
            <h1 className="text-red-500 font-bold text-center text-2xl font-sans">DevArena</h1>
            </div>
            <div className="block lg:hidden">
                <NavigationMenu>
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>
                                <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                                    <Menu  className="text-[#0B1939]" style={{ width: "32px", height: "32px" }} />
                                </Button>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                            <div className={`bg-white text-[#333333] shadow-md transition-all duration-300 lg:block ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
                                <nav className="mt-4 mx-4">
                                <Button
                                variant="ghost"
                                className={`flex items-center w-full text-lg font-semibold px-4 py-2 hover:bg-[#4A90E2] hover:text-white ${isClicked ? 'bg-[#4A90E2]' : ''} ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                                >
                                    <Link 
                                    to="/"
                                    className="flex justify-center items-center"
                                    >
                                        <LayoutDashboard className={`${isSidebarOpen ? 'w-6 h-6' : 'w-4 h-4'}`} />
                                        {isSidebarOpen && <span className="ml-2">Dashboard</span>}
                                    </Link>
                                
                                </Button>
                                <Button
                                variant="ghost"
                                className={`flex items-center w-full text-lg font-semibold px-4 py-2 hover:bg-[#4A90E2] hover:text-white ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                                >
                                    <Link 
                                    to="/projects"
                                    className="flex justify-center items-center"
                                    >
                                        <PanelsTopLeft className={`${isSidebarOpen ? 'w-8 h-6' : 'w-2 h-2'}`} />
                                        {isSidebarOpen && <span className="ml-2">Projects</span>}
                                    </Link>
                                
                                </Button>
                                <Button
                                variant="ghost"
                                className={`flex items-center w-full text-lg font-semibold px-4 py-2 hover:bg-[#4A90E2] hover:text-white ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                                >
                                    <Link 
                                    to="/courses"
                                    className="flex justify-center items-center"
                                    >
                                        <Book className="w-6 h-6" />
                                        {isSidebarOpen && <span className="ml-2">Courses</span>}
                                    </Link>
                                
                                </Button>
                                <Button
                                variant="ghost"
                                className={`flex items-center w-full text-lg font-semibold px-4 rounded-lg py-2 hover:bg-[#4A90E2] hover:text-white ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                                >
                                    <Link 
                                    to="/schedules"
                                    className="flex justify-center items-center"
                                    >
                                        <Calendar className="w-2 h-2" />
                                        {isSidebarOpen && <span className="ml-2">Schedules</span>}
                                    </Link>
                                
                                </Button>
                                <Button
                                variant="ghost"
                                className={`flex items-center w-full text-lg font-semibold px-4 rounded-lg py-2 hover:bg-[#4A90E2] hover:text-white ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                                >
                                    <Link 
                                    to="/profile"
                                    className="flex justify-center items-center"
                                    >
                                        <User className="w-2 h-2" />
                                        {isSidebarOpen && <span className="ml-2">Profile</span>}
                                    </Link>
                                
                                </Button>
                                <Button
                                variant="ghost"
                                className={`flex items-center w-full text-lg font-semibold px-4 rounded-lg py-2 hover:bg-[#4A90E2] hover:text-white ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
                                >
                                    <Link 
                                    to="/settings"
                                    className="flex justify-center items-center"
                                    >
                                        <Settings className="w-6 h-6" />
                                        {isSidebarOpen && <span className="ml-2">Settings</span>}
                                    </Link>
                                
                                </Button>
                                </nav>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                
            </div>
            </div>
            </header>
        </div>
        
    )
}