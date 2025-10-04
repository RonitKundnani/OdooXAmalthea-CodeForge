import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, Edit, Trash2, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { UserForm } from './UserForm';
import { User } from '../../types';
import { usersAPI } from '../../services/api';

const roleColors = {
  admin: 'bg-green-100 text-green-800', // Admin green
  manager: 'bg-[#BBDED6] text-[#115e59]', // Manager teal
  employee: 'bg-[#FFE1E2] text-[#8b3a3d]', // Employee soft pink
};

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await usersAPI.getUsers();
      setUsers(response.users);
    } catch (err: any) {
      console.error('Fetch users error:', err);
      setError(err.response?.data?.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setActionLoading(true);
      await usersAPI.deleteUser(userId);
      setUsers(users.filter((user) => user.user_id !== userId));
    } catch (err: any) {
      console.error('Delete user error:', err);
      alert(err.response?.data?.error || 'Failed to delete user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveUser = async (userData: any) => {
    try {
      setActionLoading(true);
      
      if (editingUser) {
        // Update existing user
        const response = await usersAPI.updateUser(editingUser.user_id, {
          name: userData.name,
          role: userData.role,
        });
        setUsers(users.map((user) =>
          user.user_id === editingUser.user_id ? response.user : user
        ));
      } else {
        // Add new user
        const response = await usersAPI.createUser({
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: userData.role,
        });
        setUsers([...users, response.user]);
      }
      
      setIsFormOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error('Save user error:', err);
      throw new Error(err.response?.data?.error || 'Failed to save user');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#61C0BF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
      </div>
    );
  }

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
            disabled={actionLoading}
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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
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
                      status="approved"
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
                        className="text-teal-600 hover:text-teal-900 disabled:opacity-50"
                        disabled={actionLoading}
                        title="Edit user"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user.user_id)}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        disabled={actionLoading}
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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
