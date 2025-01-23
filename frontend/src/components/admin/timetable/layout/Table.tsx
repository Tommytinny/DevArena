import { Edit2, Trash2 } from 'lucide-react';
import Loading from '@/components/loading/Loading';
import type { Timetable } from '../Timetable';


interface TableProps {
  timetables: Timetable[];
  onEdit: (timetable: Timetable) => void;
  onDelete: (timetable: Timetable) => void;
  loading: boolean;
}

export function Table({ timetables, onEdit, onDelete, loading }: TableProps) {

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course_name</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start time</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
            <th className="text-left px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody style={{ position: "relative" }} className="bg-white divide-y divide-gray-200">
          {loading ?
            <tr>
            <td colSpan={4} style={{ position: "relative", height: "100px" }}>
              <div className='flex justify-center items-center gap-2 py-6'>
                <Loading type='bubbles' />
              </div>
            </td>
          </tr> :
          Object.keys(timetables).length < 1 ?
          <tr>
            <td colSpan={5} style={{ position: "relative", height: "100px" }}>
              <div className='flex justify-center'>
                <span className='font-semibold'>No available timetable</span>
              </div>
              
            </td>
          </tr> : timetables.map((timetable) => (
            <tr key={timetable.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{timetable.course_name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{
                    Number(timetable.day) === 1 ? 'Mon' :
                    Number(timetable.day) === 2 ? 'Tue' :
                    Number(timetable.day) === 3 ? 'Wed' :
                    Number(timetable.day) === 4 ? 'Thur' : 
                    Number(timetable.day) === 5 ? 'Fri' : ''}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                  <div className="text-sm font-medium text-gray-900">{timetable.start_time}: 00</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                  <div className="text-sm font-medium text-gray-900">{timetable.duration} {Number(timetable.duration) > 1 ? 'hours' : 'hour'}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                  <div className="text-sm font-medium text-gray-900">{timetable.level} semester</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(timetable)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(timetable)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}