import { WeekGrid } from "./Week-grid"
import { CourseItem } from "./Course-item"

interface Timetable {
  id: string;
  course_name: string;
  day: number;
  start_time: number;
  duration: number;
  color: string;
}

interface TimetableItemProps {
  timetables: Timetable[]
}


export function Timetable({ timetables }: TimetableItemProps) {

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        
      </div>
      <div
        className=""
        style={{
          zIndex: 10,
        }}
      >
        <WeekGrid>
          {timetables.map((timetable, index) => (
            <CourseItem key={index} course={timetable} />
          ))}
        </WeekGrid>
      </div>
    </div>
  );
}