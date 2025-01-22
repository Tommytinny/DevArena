import { Badge } from "../ui/badge"

export function CoursePageSkeleton() {
  return (
    <div className="space-y-6 py-4 w-full px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-400">My Courses</h1>
        </div>
        <Badge variant="secondary" className="bg-slate-800 dark:bg-slate-500 space-x-2 hover:bg-slate-700 text-white px-4 py-1">
            <div className='animate-pulse bg-gray-300 rounded h-2 w-2'></div>
            <div className='animate-pulse bg-gray-300 rounded h-2 w-2'></div>
            <div className='animate-pulse bg-gray-300 rounded h-2 w-2'></div>
        </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded border-2 border-gray-300 bg-white p-4">
            {/* Skeleton for course header */}
            <div className="animate-pulse bg-gray-300 rounded h-6 w-1/2 mb-2" />
            <div className="animate-pulse bg-gray-300 rounded h-4 w-1/3 mb-4" />
    
            {/* Skeleton for projects */}
            <div className="space-y-2">
            {Array.from({ length: 2 }).map((_, j) => (
                <div key={j} className="flex items-center gap-4">
                    <div className="animate-pulse bg-gray-300 rounded h-10 w-10 rounded-lg" />
                <div className="flex-1">
                    <div className="animate-pulse bg-gray-300 rounded h-4 w-full mb-1" />
                    <div className="animate-pulse bg-gray-300 rounded h-4 w-3/4" />
                </div>
                </div>
            ))}
            </div>
        </div>
        ))}
      </div>
    </div>
  )
};


export function DashboardPageSkeleton() {
  return (
    <div className="p-6 lg:px-4 px-2 max-w-full w-full lg:overflow-scroll space-y-6 mt-10  lg:mt-0 lg:pr-32">
        <div className="space-y-6 py-4 w-full lg:px-4 px-2">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
                    <div className='flex space-x-2 pt-2'>
                        <div className="animate-pulse bg-gray-300 rounded h-2 w-2 mb-2" />
                        <div className="animate-pulse bg-gray-300 rounded h-2 w-2 mb-2" />
                        <div className="animate-pulse bg-gray-300 rounded h-2 w-2 mb-2" />
                    </div>
                </div>
                <Badge variant="secondary" className="bg-slate-800 dark:bg-slate-500 hover:bg-slate-700 text-white px-4 py-1">
                    <div className='animate-pulse bg-gray-300 rounded h-2 w-2'></div>
                    <div className='animate-pulse bg-gray-300 rounded h-2 w-2'></div>
                    <div className='animate-pulse bg-gray-300 rounded h-2 w-2'></div>
                </Badge>
            </div>
            

            {/* Course Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded border-2 border-gray-300 bg-white p-4">
        
                {/* Skeleton for course */}
                <div className="space-y-2">
                {Array.from({ length: 1 }).map((_, j) => (
                    <div>
                    <div className="animate-pulse bg-gray-300 rounded h-10 w-10 rounded-lg" />
                    <div key={j} className="flex items-center gap-4">
                        <div className="flex-1 pt-2 space-y-2">
                            <div className="animate-pulse bg-gray-300 rounded h-2 w-1/4 mb-1" />
                            <div className="animate-pulse bg-gray-300 rounded h-2 w-3/4" />
                            <div className="animate-pulse bg-gray-300 rounded h-2 w-3/4" />
                            <div className="animate-pulse bg-gray-300 rounded h-[1px] w-full" />
                            <div className="flex justify-end">
                                <div className="animate-pulse bg-gray-300 rounded h-5 w-12 rounded-lg" />
                            </div>
                            
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>))}
          </div>
        </div>

            {/* Projects and Progress Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:px-4">
            <div>
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white">Current Projects</h2>
                </div>
                {Array.from({ length: 1 }).map((_, i) => (
                <div key={i} className="rounded border-2 border-gray-300 bg-white p-4">
        
                {/* Skeleton for projects */}
                <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-4">
                        <div className="animate-pulse bg-gray-300 rounded h-10 w-10 rounded-lg" />
                    <div className="flex-1">
                        <div className="animate-pulse bg-gray-300 rounded h-4 w-full mb-1" />
                        <div className="animate-pulse bg-gray-300 rounded h-4 w-3/4" />
                    </div>
                    </div>
                ))}
                </div>
            </div>))}
               
            </div>
            
            <div>
                <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-white">Project Schedule</h2>
                </div>
                {Array.from({ length: 1 }).map((_, i) => (
                <div key={i} className="rounded border-2 border-gray-300 bg-white p-4">
        
                {/* Skeleton for projects */}
                <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-4">
                        <div className="animate-pulse bg-gray-300 rounded h-10 w-10 rounded-lg" />
                    <div className="flex-1">
                        <div className="animate-pulse bg-gray-300 rounded h-4 w-full mb-1" />
                        <div className="animate-pulse bg-gray-300 rounded h-4 w-3/4" />
                    </div>
                    </div>
                ))}
                </div>
            </div>))}
            </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:px-4">
            {/* Progress Section */}
            <div className='mt-4'>
            <h2 className="text-xl font-semibold mb-2 dark:text-white ">Progress</h2>
            
                <div>
                {Array.from({ length: 1 }).map((_, i) => (
                <div key={i} className="rounded border-2 border-gray-300 bg-white p-4">
        
                {/* Skeleton for progress */}
                <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-4">
                        <div className="flex-1">
                            <div className="animate-pulse bg-gray-300 rounded h-4 w-full mb-1" />
                            <div className="animate-pulse bg-gray-300 rounded h-4 w-3/4" />
                        </div>
                    </div>
                ))}
                </div>
            </div>))}
                </div>
            </div>

            {/* Event Section */}
            <div className='mt-4'>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Events</h2>
            
                <div>
                {Array.from({ length: 1 }).map((_, i) => (
                <div key={i} className="rounded border-2 border-gray-300 bg-white p-4">
        
                {/* Skeleton for events */}
                <div className="space-y-2">
                {Array.from({ length: 2 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-4">
                        <div className="animate-pulse bg-gray-300 rounded h-10 w-10 rounded-lg" />
                        <div className="animate-pulse bg-gray-300 rounded h-10 w-2" />
                        <div className="flex-1">
                            <div className="animate-pulse bg-gray-300 rounded h-4 w-full mb-1" />
                            <div className="animate-pulse bg-gray-300 rounded h-4 w-3/4" />
                        </div>
                    </div>
                ))}
                </div>
            </div>))}
                </div>
            </div>
            </div>
         </div>
  )
}


export function SchedulePageSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            {Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="rounded border-2 border-gray-300 bg-white p-4">
    
                {/* Skeleton for events */}
                <div className="space-y-2">
                {Array.from({ length: 1 }).map((_, j) => (
                    <div key={j}>
                    <div className="flex justify-between mb-2 items-center">
                        <div className="animate-pulse bg-gray-300 rounded h-6 w-6" />
                        <div className="animate-pulse bg-gray-300 rounded h-4 w-20 mb-1" />
                        <div className="animate-pulse bg-gray-300 rounded h-6 w-6" />
                    </div>
                    
                    <div className="grid grid-cols-7  gap-2 mt-8">
                    {Array.from({ length: 7}).map((_, x) => (
                        <div key={x} className="animate-pulse bg-gray-300 rounded h-8 w-8 rounded-lg" />
                    ))}
                    </div>
                    <div className="animate-pulse bg-gray-300 rounded h-[1px] w-full mt-2" />
                    <div className="grid grid-cols-7  gap-2 mt-8">
                        {Array.from({ length: 30}).map((_, x) => (
                            <div key={x} className="animate-pulse bg-gray-300 rounded h-8 w-8 rounded-lg" />
                        ))}
                    </div>
                    </div>
                ))}
                </div>
            </div>))}
        </div>
        <div>
            {Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="rounded border-2 border-gray-300 bg-white p-4 h-[285px]">
    
                {/* Skeleton for events */}
                <div className="space-y-2">
                {Array.from({ length: 1 }).map((_, j) => (
                    <div key={j} className="flex items-center gap-4">
                        <div className="flex items-start h-8">
                            <div className="animate-pulse bg-gray-300 rounded h-4 w-10 rounded-lg" />
                        </div>
                        <div className="animate-pulse bg-gray-300 rounded h-10 w-2" />
                        <div className="flex-1">
                            <div className="animate-pulse bg-gray-300 rounded h-4 w-full mb-1" />
                            <div className="animate-pulse bg-gray-300 rounded h-4 w-3/4" />
                        </div>
                    </div>
                ))}
                </div>
            </div>))}
        </div>
    </div>
  )
}