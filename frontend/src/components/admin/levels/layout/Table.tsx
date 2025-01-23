import React from 'react';
import { Edit2, Trash2, LoaderCircle } from 'lucide-react';
import type { Level } from '../Levels';

interface TableProps {
  levels: Level[];
  onEdit: (level: Level) => void;
  onDelete: (level: Level) => void;
  loading: boolean;
}

export function Table({ levels, onEdit, onDelete, loading }: TableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic year</th>
            <th className="text-left px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Semester</th>
            <th className="text-left px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody style={{ position: "relative" }} className="bg-white divide-y divide-gray-200">
          {loading ?
            <tr>
            <td colSpan={4} style={{ position: "relative", height: "100px" }}>
              <div className='flex justify-center items-center gap-2'>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                <span>Loading levels</span>
              </div>
            </td>
          </tr> :
          Object.keys(levels).length < 1 ?
          <tr>
            <td colSpan={4} style={{ position: "relative", height: "100px" }}>
              <div className='flex justify-center'>
                <span className='font-semibold'>No available level</span>
              </div>
              
            </td>
          </tr> : levels.map((level) => (
            <tr key={level.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{level.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{level.academic_year}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-start">
                  <div className="">
                    <div className="text-sm font-medium text-gray-900">{level.semester}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(level)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(level)}
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