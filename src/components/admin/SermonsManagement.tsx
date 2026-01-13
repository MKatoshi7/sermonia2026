import React, { useState, useEffect } from 'react';
import { FileText, Eye, Download, Trash2, Search, RefreshCw, Calendar, User } from 'lucide-react';

interface SermonsManagementProps {
    token: string | null;
}

export const SermonsManagement: React.FC<SermonsManagementProps> = ({ token }) => {
    const [sermons, setSermons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSermon, setSelectedSermon] = useState<any>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    useEffect(() => {
        if (token) {
            fetchSermons();
        }
    }, [token]);

    const fetchSermons = async () => {
        setLoading(true);
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

    const handleDelete = async (id: string) => {
        if (deleteConfirm !== id) {
            setDeleteConfirm(id);
            setTimeout(() => setDeleteConfirm(null), 3000);
            return;
        }

        try {
            const response = await fetch(`/api/admin/sermons/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('✅ Sermão deletado!');
                fetchSermons();
            } else {
                alert('❌ Erro ao deletar');
            }
        } catch (error) {
            alert('❌ Erro de conexão');
        }
        setDeleteConfirm(null);
    };

    const handleBackup = (sermon: any) => {
        const dataStr = JSON.stringify(sermon, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `sermao-${sermon.title.slice(0, 30).replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const filteredSermons = sermons.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-12">Carregando sermões...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Gerenciar Sermões
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {sermons.length} sermões no total
                    </p>
                </div>
                <button
                    onClick={fetchSermons}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                    <RefreshCw className="h-5 w-5" />
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Buscar por título, autor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800"
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Autor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Criado em</th>
                            <th className="px-6 py-3 text-left text-xs font-medium uppercase">Atualizado</th>
                            <th className="px-6 py-3 text-right text-xs font-medium uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredSermons.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    {searchTerm ? 'Nenhum sermão encontrado' : 'Nenhum sermão criado ainda'}
                                </td>
                            </tr>
                        ) : (
                            filteredSermons.map((sermon) => (
                                <tr key={sermon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{sermon.title || 'Sem título'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-gray-400" />
                                            <div>
                                                <div className="text-sm font-medium">{sermon.user?.name || 'Desconhecido'}</div>
                                                <div className="text-xs text-gray-500">{sermon.user?.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(sermon.createdAt).toLocaleDateString('pt-BR')}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(sermon.updatedAt).toLocaleDateString('pt-BR')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setSelectedSermon(sermon)}
                                                className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleBackup(sermon)}
                                                className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                                title="Fazer backup"
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(sermon.id)}
                                                className={`p-1 transition-colors ${deleteConfirm === sermon.id
                                                        ? 'text-red-600 animate-pulse'
                                                        : 'text-gray-400 hover:text-red-600'
                                                    }`}
                                                title={deleteConfirm === sermon.id ? 'Clique novamente para confirmar' : 'Deletar'}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Mostrando {filteredSermons.length} de {sermons.length} sermões
            </div>

            {/* Modal de Visualização */}
            {selectedSermon && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-xl max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                    {selectedSermon.title || 'Sem título'}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    Por {selectedSermon.user?.name} • {new Date(selectedSermon.createdAt).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedSermon(null)}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {(() => {
                                try {
                                    const content = typeof selectedSermon.content === 'string'
                                        ? JSON.parse(selectedSermon.content)
                                        : selectedSermon.content;

                                    return (
                                        <>
                                            {content.mainVerse && (
                                                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
                                                    <p className="font-medium text-indigo-900 dark:text-indigo-100">
                                                        {content.mainVerse}
                                                    </p>
                                                    <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
                                                        {content.mainVerseText}
                                                    </p>
                                                </div>
                                            )}

                                            {content.objective && (
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Objetivo:</h4>
                                                    <p className="text-gray-700 dark:text-gray-300">{content.objective}</p>
                                                </div>
                                            )}

                                            {content.introOpening && (
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Introdução:</h4>
                                                    <p className="text-gray-700 dark:text-gray-300">{content.introOpening}</p>
                                                </div>
                                            )}

                                            {content.points && content.points.length > 0 && (
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Pontos Principais:</h4>
                                                    <div className="space-y-3">
                                                        {content.points.map((point: any, i: number) => (
                                                            <div key={i} className="border-l-4 border-indigo-600 pl-4">
                                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                    {i + 1}. {point.title}
                                                                </p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                    {point.content}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {content.concSummary && (
                                                <div>
                                                    <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Conclusão:</h4>
                                                    <p className="text-gray-700 dark:text-gray-300">{content.concSummary}</p>
                                                </div>
                                            )}
                                        </>
                                    );
                                } catch (e) {
                                    return <p className="text-red-600">Erro ao carregar conteúdo</p>;
                                }
                            })()}
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex gap-3">
                            <button
                                onClick={() => handleBackup(selectedSermon)}
                                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Fazer Backup
                            </button>
                            <button
                                onClick={() => setSelectedSermon(null)}
                                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg"
                            >
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
