import React, { useState, useEffect } from 'react';
import { Table } from './layout/Table';
import { AddLevelModal } from './layout/AddLevelModal';
import { EditLevelModal } from './layout/EditLevelModal';
import { DeleteLevelModal } from './layout/DeleteLevelModal';
import { Plus } from 'lucide-react';
import { TabsContent } from "@/components/ui/tabs";
import axiosInstance from '@/services/axiosInstance';

export type Level = {
  id: string;
  name: string;
  academic_year: string;
  semester: string;
};


export function LevelsList() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [loading, setLoading] = useState(true)

  const handleEditLevel = (updatedLevel: Level) => {
    setLevels(levels.map(level => level.id === updatedLevel.id ? updatedLevel : level));
    setIsEditModalOpen(false);
  };


  const fetchLevel = async () => {
    try {
      const response = await axiosInstance.get('/levels');

      if (response.status === 200) {
        const data = response.data;
        setLevels(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error', error);
    } 
  };

  useEffect(() => {
    fetchLevel();
  }, [])


  return (
    <>
    <TabsContent value="levels">
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Levels Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Level
          </button>
        </div>
      </div>

      <Table
        levels={levels}
        onEdit={(level) => {
          setSelectedLevel(level);
          setIsEditModalOpen(true);
        }}
        onDelete={(level) => {
          setSelectedLevel(level);
          setIsDeleteModalOpen(true);
        }}
        loading={loading}
      />

      <AddLevelModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false); 
          fetchLevel();
        }
        }
      />

      {selectedLevel && (
        <>
          <EditLevelModal
            isOpen={isEditModalOpen}
            onClose={() => {setIsEditModalOpen(false); fetchLevel();}}
            level={selectedLevel}
            onEdit={handleEditLevel}
          />
          <DeleteLevelModal
            isOpen={isDeleteModalOpen}
            onClose={() => {setIsDeleteModalOpen(false); fetchLevel();}}
            level={selectedLevel}
          />
        </>
      )}
    </div>
    </TabsContent>
    </>
  );
}