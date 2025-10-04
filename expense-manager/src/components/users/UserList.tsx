import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2, UserPlus } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { UserForm } from './UserForm';
import { User } from '../../types';

// Mock data - replace with actual API call
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin',
    status: 'active',
    department: 'IT',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'manager',
    status: 'active',
    department: 'Finance',
    joinDate: '2023-02-20',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    role: 'employee',
    status: 'inactive',
    department: 'HR',
    joinDate: '2023-03-10',
  },
];

const roleColors = {
  admin: 'bg-green-100 text-green-800', // Admin green
  manager: 'bg-[#BBDED6] text-[#115e59]', // Manager teal
  employee: 'bg-[#FFE1E2] text-[#8b3a3d]', // Employee soft pink
};

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== userId));
    }
  };

  const handleSaveUser = (userData: Omit<User, 'id'>) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...userData } : user
        )
      );
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
      };
      setUsers([...users, newUser as User]);
    }
    setIsFormOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="relative bg-white rounded-lg shadow">
      <div className="p-4 border-b border-gray-200 sm:flex sm:items-center sm:justify-between">
        <h2 className="text-lg font-medium text-gray-900">User Management</h2>
        <div className="mt-3 sm:mt-0 sm:ml-4">
          <Button
            onClick={() => {
              setEditingUser(null);
              setIsFormOpen(true);
            }}
            variant="primary"
            icon={<UserPlus size={16} className="mr-2" />}
          >
            Add User
          </Button>
        </div>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="relative rounded-md shadow-sm max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md p-2 border"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-600">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.department}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      roleColors[user.role as keyof typeof roleColors] || 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge 
                    status={user.status === 'active' ? 'approved' : 'rejected'} 
                    size="sm" 
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setIsFormOpen(true);
                      }}
                      className="text-teal-600 hover:text-teal-900"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <UserForm
          user={editingUser}
          onSave={handleSaveUser}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingUser(null);
          }}
        />
      )}

      {/* Floating Add User Button */}
      <button
        onClick={() => {
          setEditingUser(null);
          setIsFormOpen(true);
        }}
        className="fixed md:absolute bottom-6 right-6 md:bottom-4 md:right-4 inline-flex items-center px-4 py-3 rounded-full shadow-lg text-white"
        style={{ backgroundColor: '#61C0BF' }}
        aria-label="Add User"
      >
        <UserPlus size={18} className="mr-2" /> Add User
      </button>
    </div>
  );
}
