interface CourseItemProps {
  course: {
    id: string;
    course_name: string;
    day: number;
    start_time: number;
    duration: number;
    color: string;
  }
}

export function CourseItem({ course }: CourseItemProps) {
  // Each hour equals 4 rows (quarter-hour granularity)
  const startRow = (course.start_time - 8) * 4 + 1; // Calculate starting row
  const durationRows = course.duration * 4; // Duration in rows (quarters)
  const durationColumns = course.duration * 4 + 4;

  return (
    <div
      className={`absolute inset-0 ${course.color} shadow-sm rounded-md p-2 h-[${durationColumns}em]`}
      style={{
        gridRow: `${startRow} / span ${durationRows}`, // Start at `startRow` and span `durationRows`
      }}
    >
      <h3 className="font-semibold text-sm truncate">{course.course_name}</h3>
      <p className="text-xs">
        {course.start_time}:00 {course.start_time >= 12 ? "PM" : "AM"} - {course.start_time + course.duration}:00 {course.start_time + course.duration >= 12 ? "PM" : "AM"}
      </p>
    </div>
  );
}
