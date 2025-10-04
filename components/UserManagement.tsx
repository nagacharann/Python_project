
import React, { useState } from 'react';
import { User, Role } from '../types';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers, onClose }) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const handleRoleChange = (userId: number, role: Role) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role } : u));
  };
  
  const handlePasswordChange = (userId: number) => {
      if (!newPassword) return;
      setUsers(users.map(u => u.id === userId ? { ...u, password: newPassword } : u));
      setEditingUser(null);
      setNewPassword('');
  };

  const handleStartEdit = (user: User) => {
    setEditingUser(user);
    setNewPassword('');
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-4xl max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold text-white mb-6">User Management</h2>
        <div className="flex-grow overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900 sticky top-0">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Credentials</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {users.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.username}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {editingUser?.id === user.id ? (
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="bg-gray-700 text-white rounded p-1 text-sm w-40"
                                        />
                                        <button onClick={() => handlePasswordChange(user.id)} className="px-2 py-1 text-xs bg-indigo-600 rounded">Save</button>
                                        <button onClick={() => setEditingUser(null)} className="px-2 py-1 text-xs bg-gray-600 rounded">Cancel</button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="font-semibold text-gray-300">Pass:</span> {user.password || 'N/A'}
                                        <button onClick={() => handleStartEdit(user)} className="ml-4 text-xs text-indigo-400">Edit</button>
                                    </>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <select value={user.role} onChange={(e) => handleRoleChange(user.id, e.target.value as Role)} className="bg-gray-700 text-white rounded p-1 text-sm border-0 focus:ring-2 focus:ring-indigo-500">
                                    <option value={Role.Admin}>Admin</option>
                                    <option value={Role.Customer}>Customer</option>
                                </select>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                {user.role === Role.Admin ? 'Full Access' : 'View Only'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <div className="flex justify-end pt-6">
          <button onClick={onClose} className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
