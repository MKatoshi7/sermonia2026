import React, { useEffect, useState } from 'react';
import { UserPlus, Trash2, Edit, Search, RefreshCw, Upload } from 'lucide-react';
import { AddUserModal } from './AddUserModal';
import { EditUserModal, DeleteUserModal } from './EditUserModal';
import { ImportUsersModal } from './ImportUsersModal';

interface UsersManagementProps {
    token: string | null;
}

export const UsersManagement: React.FC<UsersManagementProps> = ({ token }) => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
        if (token) {
            fetchUsers();
        }
    }, [token]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    const handleUserAdded = () => {
        fetchUsers();
    };

    const handleUserUpdated = () => {
        fetchUsers();
    };

    const handleUserDeleted = () => {
        fetchUsers();
    };

    const handleEditClick = (user: any) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user: any) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id: string) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const isAllSelected = filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length;

    if (loading) {
        return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Carregando usuários...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header com busca */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar usuários..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {selectedUsers.length > 0 && (
                        <button
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                            onClick={async () => {
                                if (confirm(`Tem certeza que deseja excluir ${selectedUsers.length} usuários?`)) {
                                    try {
                                        const res = await fetch('/api/admin/users/bulk-delete', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                                'Authorization': `Bearer ${token}`
                                            },
                                            body: JSON.stringify({ userIds: selectedUsers })
                                        });
                                        if (res.ok) {
                                            setSelectedUsers([]);
                                            fetchUsers();
                                        } else {
                                            const data = await res.json();
                                            alert(data.error || 'Erro ao excluir usuários');
                                        }
                                    } catch (e) {
                                        alert('Erro de conexão');
                                    }
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                            Excluir ({selectedUsers.length})
                        </button>
                    )}
                    <button
                        onClick={handleRefresh}
                        disabled={refreshing}
                        className="p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors disabled:opacity-50"
                        title="Atualizar"
                    >
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                    >
                        <Upload className="h-4 w-4" />
                        Importar CSV
                    </button>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                    >
                        <UserPlus className="h-4 w-4" />
                        Adicionar Usuário
                    </button>
                </div>
            </div>

            {/* Tabela de usuários */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Usuário
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Sermões
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Assinatura
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedUsers.includes(user.id) ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''}`}>
                                <td className="px-6 py-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => handleSelectUser(user.id)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                            {user.name || 'Sem nome'}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.email}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.role === 'ADMIN'
                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${user.isActive
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                        }`}>
                                        {user.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                    {user._count?.sermons || 0}
                                </td>
                                <td className="px-6 py-4">
                                    {user.subscriptions && user.subscriptions.length > 0 ? (
                                        <div className="text-sm">
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {user.subscriptions[0].plan.name}
                                            </div>
                                            <div className="text-gray-500 dark:text-gray-400">
                                                {user.subscriptions[0].status}
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400 dark:text-gray-500">Sem plano</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                            title="Editar usuário"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(user)}
                                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                            title="Remover usuário"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Mostrando {filteredUsers.length} de {users.length} usuários
            </div>

            {/* Modais */}
            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                token={token}
                onUserAdded={handleUserAdded}
            />

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                token={token}
                user={selectedUser}
                onUserUpdated={handleUserUpdated}
            />

            <DeleteUserModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                token={token}
                user={selectedUser}
                onUserDeleted={handleUserDeleted}
            />

            <ImportUsersModal
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                token={token}
                onComplete={handleUserAdded}
            />
        </div>
    );
};
