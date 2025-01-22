import React from "react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8 AM to 6 PM
const myhours = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6];

export function WeekGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  // Organize children into cells based on `day-hour` keys
  const cellChildren: { [key: string]: React.ReactElement } = {};

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      const { course } = child.props;
      const { day, start_time } = course;

      const key = `${day}-${start_time}`;
      if (!cellChildren[key]) {
        cellChildren[key] = child;
      }
    }
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[800px]">
        <thead>
          <tr>
            <th className="p-2 border-2 bg-gray-300">Time</th>
            {days.map((day) => (
              <th
                key={day}
                className="p-2 border-2 text-center bg-gray-300 font-semibold"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {myhours.map((hour, index) => (
            <tr key={hour}>
              <td className="p-2 border text-center text-sm font-semibold text-gray-500">
                {hour}:00 {hour <= 12 && index <= 3 ? "AM" : "PM"}
              </td>
              {days.map((_, dayIndex) => {
                const key = `${dayIndex + 1}-${hour}`;
                const child = cellChildren[key];

                // Check if a course exists for this cell
                if (child) {
                  const { course } = child.props;
                  const { duration } = course;

                  // Render the course cell only for its starting hour
                  if (hour === course.start_time) {
                    return (
                      <td
                        key={key}
                        className="p-2 border relative h-16 z-1 align-top"
                        rowSpan={duration}
                      >
                        {child}
                      </td>
                    );
                  }
                }

                // Render an empty cell if no course starts here
                return (
                  <td
                    key={key}
                    className="p-2 border relative h-16 z-1 align-top"
                  ></td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
