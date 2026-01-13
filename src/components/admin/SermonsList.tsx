import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Trash2, Edit, Calendar } from 'lucide-react';

interface SermonsListProps {
    token: string | null;
}

export const SermonsList: React.FC<SermonsListProps> = ({ token }) => {
    const [sermons, setSermons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (token) {
            fetchSermons();
        }
    }, [token]);

    const fetchSermons = async () => {
        try {
            const response = await fetch('/api/admin/sermons', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setSermons(data);
            }
        } catch (error) {
            console.error('Error fetching sermons:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredSermons = sermons.filter(sermon =>
        sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sermon.user?.name && sermon.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Carregando sermões...</div>;
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
                            placeholder="Buscar sermões..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* Lista de sermões */}
            <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Título
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Autor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Criado em
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Atualizado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredSermons.map((sermon) => (
                            <tr key={sermon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                        {sermon.title || 'Sem título'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {sermon.user?.name || sermon.user?.email || 'Desconhecido'}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(sermon.createdAt).toLocaleDateString('pt-BR')}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(sermon.updatedAt).toLocaleDateString('pt-BR')}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="Ver">
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Deletar">
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
                Mostrando {filteredSermons.length} de {sermons.length} sermões
            </div>
        </div>
    );
};
