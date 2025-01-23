import React, { useState, useEffect } from 'react';
import { Table } from './layout/Table';
import { ImportExportActions } from './layout/ImportExportUserActions'
import { AddUserModal } from './layout/AddUserModal';
import { EditUserModal } from './layout/EditUserModal';
import { DeleteUserModal } from './layout/DeleteUserModal';
import { Plus } from 'lucide-react';
import { TabsContent } from "@/components/ui/tabs"
import { fetchAllUser } from '@/services/admin/api';
import { useAuth } from '@/contexts/authContext';
import axiosInstance from '@/services/axiosInstance';

export type User = {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  matric_number: string;
  role: string;
  level_id: string;
};


export function UsersList() {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true)


  const handleEditUser = (updatedUser: User) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setIsEditModalOpen(false);
  };


  const fetchUser = async () => {
    try {
      const response = await axiosInstance.get('/users');

      if (response.status === 200) {
        const data = response.data;
        setUsersList(data);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error', error);
    } 
  };

  useEffect(() => {
    fetchUser();
  }, [])

  return (
    <>
    <TabsContent value="users">
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Users Management</h1>
        <div className="flex gap-4">
          <ImportExportActions users={users} />
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add User
          </button>
        </div>
      </div>

      <Table
        users={usersList}
        onEdit={(user) => {
          setSelectedUser(user);
          setIsEditModalOpen(true);
        }}
        onDelete={(user) => {
          setSelectedUser(user);
          setIsDeleteModalOpen(true);
        }}
        loading={loading}
      />

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchUser();
        }}
      />

      {selectedUser && (
        <>
          <EditUserModal
            isOpen={isEditModalOpen}
            onClose={() => {setIsEditModalOpen(false); fetchUser();}}
            user={selectedUser}
            onEdit={handleEditUser}
          />
          <DeleteUserModal
            isOpen={isDeleteModalOpen}
            onClose={() => {setIsDeleteModalOpen(false); fetchUser();}}
            user={selectedUser}
          />
        </>
      )}
    </div>
    </TabsContent>
    </>
  );
}