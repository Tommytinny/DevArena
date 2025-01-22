import { Edit2, Trash2 } from 'lucide-react';
import Loading from '@/components/loading/Loading';


export type Event = {
  id: string;
  title: string;
  venue: string;
  date: string;
  type: string;
  level: string;
};

interface TableProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
  loading: boolean;
}

export function Table({ events, onEdit, onDelete, loading }: TableProps) {

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
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
          Object.keys(events).length < 1 ?
          <tr>
            <td colSpan={5} style={{ position: "relative", height: "100px" }}>
              <div className='flex justify-center'>
                <span className='font-semibold'>No available event</span>
              </div>
              
            </td>
          </tr> : events.map((event) => (
            <tr key={event.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{event.title}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{event.date}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{event.venue}</div>
                  </div>
                </div>
                
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{event.type}</div>
                  </div>
                </div>
                
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{event.level}</div>
                  </div>
                </div>
                
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(event)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(event)}
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