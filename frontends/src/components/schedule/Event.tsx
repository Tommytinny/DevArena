import { useState } from 'react'
import { Event } from '@/types/schedule'
import { formatDate } from '@/utils/dateUtils'
import { getTime } from '@/utils/dateUtils'
import { cn } from '@/lib/utils'

interface EventsProps {
  date: Date;
  events: Event[];
  height: string;
}

const COLORS = [
    { color: "bg-blue-200" },
    { color: "bg-orange-50" },
    { color: "bg-yellow-50" },
    { color: "bg-red-50" },
    { color: "bg-blue-200" },
    { color: "bg-orange-50" },
  ];

export function Events({ date, events, height }: EventsProps) {


  return (
    <>

      {Object.keys(events).length > 0 ? 
      <div className="bg-white shadow-sm border-slate-300 border-[1px]">
      <div className='py-8'>
        
      {events.map((event, index) => (
        <div className="grid grid-cols-[1fr_4fr] px-2">
          <div className='border-r-4 border-red-400'>
            <div className='flex justify-center items-start font-semibold'>
            {formatDate(new Date(event.date))}
            </div>
            
          </div>
          
          <div
            key={index}
            className="p-4 bg-white ml-2 pb-4"
          >
            <div className="space-y-2">
              <div className='flex items-center justify-between border-[1px] rounded-md  p-4'>
                <div>
                  <h3 className="font-semibold">{event.type}: {event.title}</h3>
                    <p className="text-sm opacity-90">Time: {getTime(new Date(event.date))}</p>
                    <p className="text-sm opacity-90">Venue: {event.venue}</p>

                </div>
              </div>
              
            </div>
          </div>
          </div>
         
        ))} </div> </div> :
          <div className={`flex flex-col items-center justify-center h-[${height}] bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center`}>
            <div className="flex flex-col items-center max-w-md space-y-2">
              <h3 className="text-xl font-semibold">No event or schedule on this day</h3>
            </div>
          </div>}
    </>
  )
}

