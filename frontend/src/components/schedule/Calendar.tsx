import { useState } from 'react'
import { Event } from '@/types/schedule'
import { getMonthDays, isSameDay } from '@/utils/dateUtils'
import { cn } from '@/lib/utils'
import { ChevronRight, ChevronLeft } from 'lucide-react'

interface CalendarProps {
  events: Event[]
  onDateSelect: (date: Date) => void
  selectedDate: Date
}

export function Calendar({ events, onDateSelect, selectedDate }: CalendarProps) {
  const date = new Date();

  const month = date.getMonth();
  const year = date.getFullYear();
  const [currentMonth, setCurrentMonth] = useState(month)
  const [currentYear, setCurrentYear] = useState(year)

  const days = getMonthDays(currentMonth, currentYear)
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const nextCalender = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 12) {
        setCurrentYear(prevYear =>  prevYear + 1);
        return 1;
      }
      return prevMonth + 1;
    });
  }

  const prevCalender = () => {
    setCurrentMonth(prevMonth => {
      if (prevMonth === 1) {
        setCurrentYear(prevYear =>  prevYear - 1);
        return 12;
      }
      return prevMonth - 1;
    });
  }

  return (
    <div className="bg-white border-[1px] border-slate-300 shadow-sm">
      <div className="flex items-center justify-between mb-6 p-2 rounded-md">
      <button className="p-2" onClick={prevCalender}>
            <ChevronLeft />
        </button>
        <h2 className="text-lg font-bold">
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date(currentYear, currentMonth))}
        </h2>
        <button className="p-2" onClick={nextCalender}>
            <ChevronRight />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-[2px] py-4">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-bold text-black-400">
            {day}
          </div>
        ))}
      </div>
      <hr className='mx-4'></hr>

      <div className="grid grid-cols-7 gap-6 py-4 p-4">
        {days.map((date, index) => {
          const todaysDay = isSameDay(date, new Date())
          const dayEvents = events.filter(event => isSameDay(new Date(event.date), date))
          const hasEvents = dayEvents.length > 0
          const eventDay = events.some(event => isSameDay(new Date(event.date), selectedDate))
          const isSelected = isSameDay(date, selectedDate)
          console.log(eventDay)

          return (
            <button
              key={index}
              onClick={() => onDateSelect(date)}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-colors",
                todaysDay && hasEvents && "bg-red-400 text-white",
                hasEvents && !todaysDay && "bg-blue-400 text-white",
                isSelected && "ring-2 ring-offset-2 ring-primary",
                !hasEvents && "hover:bg-gray-100"
              )}
            >
              {date.getDate()}
            </button>
          )
        })}
      </div>

    </div>
  )
}

