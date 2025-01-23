import React, { useState, useEffect } from 'react';
import { Table } from './layout/Table';
import { AddTimetableModal } from './layout/AddTimetableModal';
import { EditTimetableModal } from './layout/EditTimetableModal';
import { DeleteTimetableModal } from './layout/DeleteTimetableModal';
import { Plus } from 'lucide-react';
import { TabsContent } from "@/components/ui/tabs"
import axiosInstance from '@/services/axiosInstance';

export type Timetable = {
  id: string;
  course_name: string;
  day: string;
  start_time: string;
  duration: string;
  level_id: string;
  level: string;
};


export function TimetablesList() {
  const [timetablesList, setTimetablesList] = useState<Timetable[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [loading, setLoading] = useState(true)


  const handleEditTimetable = (updatedTimetable: Timetable) => {
    setTimetables(timetables.map(timetable => timetable.id === updatedTimetable.id ? updatedTimetable : timetable));
    setIsEditModalOpen(false);
  };

  const fetchLevel = async (level_id: string) => {
    try {
      const response = await axiosInstance.get(`/levels/${level_id}`);
      if (response.status === 200) {
        const level = response.data;
        return `${level.name} ${level.semester}`;
      }
    } catch (error) {
      console.error(error);
    }
    return '';
  }

  const fetchTimetable = async () => {
    try {
      const response = await axiosInstance.get('/timetables');

      if (response.status === 200) {
        const timetables = response.data;
        const newTimetables = await Promise.all(
          timetables.map(async (t_table) => ({
            ...t_table,
            level: await fetchLevel(t_table.level_id)
          }))
        )
        setTimetablesList(newTimetables);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error', error);
    } 
  };

  useEffect(() => {
    fetchTimetable();
  }, [])

  return (
    <>
    <TabsContent value="timetables">
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Timetables Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Timetable
          </button>
        </div>
      </div>

      <Table
        timetables={timetablesList}
        onEdit={(timetable) => {
          setSelectedTimetable(timetable);
          setIsEditModalOpen(true);
        }}
        onDelete={(timetable) => {
          setSelectedTimetable(timetable);
          setIsDeleteModalOpen(true);
        }}
        loading={loading}
      />

      <AddTimetableModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchTimetable();
        }}
      />

      {selectedTimetable && (
        <>
          <EditTimetableModal
            isOpen={isEditModalOpen}
            onClose={() => {setIsEditModalOpen(false); fetchTimetable();}}
            timetable={selectedTimetable}
            onEdit={handleEditTimetable}
          />
          <DeleteTimetableModal
            isOpen={isDeleteModalOpen}
            onClose={() => {setIsDeleteModalOpen(false); fetchTimetable();}}
            timetable={selectedTimetable}
          />
        </>
      )}
    </div>
    </TabsContent>
    </>
  );
}