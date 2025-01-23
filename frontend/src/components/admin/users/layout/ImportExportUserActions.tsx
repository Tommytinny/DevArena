import React from 'react';
import { Download, Upload } from 'lucide-react';
import type { User } from './UsersList';

interface ImportExportActionsProps {
  users: User[];
}

export function ImportExportActions({ users }: ImportExportActionsProps) {
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Role', 'Matric_no', 'password'],
      ...users.map(user => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.joinedDate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Process CSV content here
        console.log('Imported CSV:', text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <Download className="h-5 w-5" />
        Export
      </button>
      <label className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
        <Upload className="h-5 w-5" />
        Import
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleImport}
        />
      </label>
    </div>
  );
}